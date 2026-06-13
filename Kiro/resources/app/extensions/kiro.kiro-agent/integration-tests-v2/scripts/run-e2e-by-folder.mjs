#!/usr/bin/env node
// @ts-check
/* eslint-disable no-console */
/**
 * Runs e2e tests folder-by-folder, each in its own vitest process.
 *
 * Each folder gets a fresh Kiro launch via global-setup/teardown, which
 * prevents cascading failures when the Kiro process becomes unhealthy
 * after many sequential window reloads.
 *
 * ## Isolation annotation
 *
 * Test files that destabilize the Electron process (e.g. by triggering
 * heavy file-system operations that hang the renderer on macOS) can opt
 * into running in their own Kiro instance by adding a JSDoc annotation:
 *
 *   // @kiro-isolation <tag>
 *
 * Files sharing the same tag run together in one vitest invocation.
 * Files without the annotation share the default invocation for their
 * folder. This keeps the domain-based folder grouping intact while
 * isolating problematic tests.
 *
 * Usage:
 *   node scripts/run-e2e-by-folder.mjs              # run all folders
 *   node scripts/run-e2e-by-folder.mjs tools hooks   # run specific folders
 *
 * Exit code is 1 if any folder had failures, 0 if all passed.
 */
import { spawn as spawnChild } from 'child_process';
import { readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INTEG_ROOT = path.resolve(__dirname, '..');
const TESTS_DIR = path.join(INTEG_ROOT, 'src', 'tests');

/** @typedef {{ folder: string, label: string, files: string[] }} RunGroup */
/** @typedef {{ folder: string, passed: number, failed: number, skipped: number, duration: string, exitCode: number }} FolderResult */

/**
 * Discover test subdirectories under src/tests/.
 * @param {string[]} filter — if non-empty, only include these folder names
 * @returns {string[]} sorted list of folder names to run
 */
function discoverFolders(filter) {
  const all = readdirSync(TESTS_DIR).filter((entry) => {
    const full = path.join(TESTS_DIR, entry);
    return statSync(full).isDirectory();
  });

  if (filter.length > 0) {
    const missing = filter.filter((f) => !all.includes(f));
    if (missing.length > 0) {
      console.error(`Unknown test folder(s): ${missing.join(', ')}`);
      console.error(`Available: ${all.join(', ')}`);
      process.exit(1);
    }
    return filter;
  }

  return all.sort();
}

/**
 * Read the file header (first 1024 characters) and extract a @kiro-isolation tag.
 * @param {string} filePath
 * @returns {string | null} the isolation tag, or null if not annotated
 */
function readIsolationTag(filePath) {
  const head = readFileSync(filePath, 'utf-8').slice(0, 1024);
  const match = head.match(/@kiro-isolation\s+(\S+)/);
  return match ? match[1] : null;
}

/**
 * Split a folder's test files into run groups based on @kiro-isolation tags.
 * Files without the annotation go into the default group.
 * Files sharing the same tag go into a named group.
 * @param {string} folder
 * @returns {RunGroup[]} ordered list of groups (default first, then isolated)
 */
function buildRunGroups(folder) {
  const folderPath = path.join(TESTS_DIR, folder);
  const testFiles = readdirSync(folderPath)
    .filter((f) => f.endsWith('.test.ts'))
    .sort();

  /** @type {Map<string, string[]>} tag → file paths (relative to INTEG_ROOT) */
  const isolated = new Map();
  /** @type {string[]} */
  const defaultFiles = [];

  for (const file of testFiles) {
    const fullPath = path.join(folderPath, file);
    const relPath = path.relative(INTEG_ROOT, fullPath).replace(/\\/g, '/');
    const tag = readIsolationTag(fullPath);

    if (tag) {
      if (!isolated.has(tag)) isolated.set(tag, []);
      /** @type {string[]} */ (isolated.get(tag)).push(relPath);
    } else {
      defaultFiles.push(relPath);
    }
  }

  /** @type {RunGroup[]} */
  const groups = [];

  if (defaultFiles.length > 0) {
    groups.push({ folder, label: folder, files: defaultFiles });
  }

  for (const [tag, files] of isolated) {
    groups.push({ folder, label: `${folder}/${tag}`, files });
  }

  return groups;
}

/**
 * Parse vitest verbose output for pass/fail/skip counts.
 * Checks both "Test Files" and "Tests" summary lines.
 * @param {string} output
 * @returns {{ passed: number, failed: number, skipped: number, duration: string }} parsed counts
 */
function parseVitestOutput(output) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let duration = '?';

  // Match "Tests  N failed | N passed | N skipped (N)" or subsets
  const testsLine = output.match(/Tests\s+(.+)\((\d+)\)/);
  if (testsLine) {
    const parts = testsLine[1];
    const failMatch = parts.match(/(\d+)\s+failed/);
    const passMatch = parts.match(/(\d+)\s+passed/);
    const skipMatch = parts.match(/(\d+)\s+skipped/);
    if (failMatch) failed = parseInt(failMatch[1], 10);
    if (passMatch) passed = parseInt(passMatch[1], 10);
    if (skipMatch) skipped = parseInt(skipMatch[1], 10);
  }

  // Also check "Test Files" line — vitest reports suite-level failures
  // here (e.g. timed-out tests) that may not appear in the "Tests" line.
  if (failed === 0) {
    const filesLine = output.match(/Test Files\s+(.+)\((\d+)\)/);
    if (filesLine) {
      const parts = filesLine[1];
      const failMatch = parts.match(/(\d+)\s+failed/);
      if (failMatch) failed = parseInt(failMatch[1], 10);
    }
  }

  const durationMatch = output.match(/Duration\s+([^\n]+)/);
  if (durationMatch) {
    duration = durationMatch[1].trim();
  }

  return { passed, failed, skipped, duration };
}

/**
 * Run vitest for a run group.
 * If the group contains all files in a folder, passes the folder path.
 * Otherwise passes individual file paths.
 * @param {RunGroup} group
 * @returns {Promise<FolderResult>} result with exit code and parsed counts
 */
function runGroup(group) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  Running: ${group.label}`);
  console.log(`${'='.repeat(70)}\n`);

  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const args = ['vitest', '--run', '--config', 'vitest.e2e.config.ts', ...group.files];
    const child = spawnChild('npx', args, {
      cwd: INTEG_ROOT,
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: isWindows, // Windows needs shell for npx; Unix can spawn directly
      env: { ...process.env },
    });

    let output = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      const exitCode = code ?? 1;
      const counts = parseVitestOutput(output);
      resolve({ folder: group.label, ...counts, exitCode });
    });

    child.on('error', (err) => {
      console.error(`Failed to spawn vitest for ${group.label}: ${err.message}`);
      resolve({ folder: group.label, passed: 0, failed: 0, skipped: 0, duration: 'error', exitCode: 1 });
    });
  });
}

/**
 * Print the aggregated summary table.
 * @param {FolderResult[]} results
 */
function printSummary(results) {
  const totalPassed = results.reduce((s, r) => s + r.passed, 0);
  const totalFailed = results.reduce((s, r) => s + r.failed, 0);
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0);
  const anyFailed = results.some((r) => r.exitCode !== 0);

  console.log(`\n${'='.repeat(70)}`);
  console.log('  AGGREGATED E2E RESULTS');
  console.log(`${'='.repeat(70)}\n`);

  // Column widths
  const folderWidth = Math.max(10, ...results.map((r) => r.folder.length)) + 2;

  // Header
  const header =
    '  ' +
    'Folder'.padEnd(folderWidth) +
    'Status'.padEnd(10) +
    'Passed'.padEnd(10) +
    'Failed'.padEnd(10) +
    'Skipped'.padEnd(10) +
    'Duration';
  console.log(header);
  console.log('  ' + '-'.repeat(header.length - 2));

  for (const r of results) {
    const status = r.exitCode === 0 ? 'PASS' : 'FAIL';
    const statusStr = r.exitCode === 0 ? `\x1b[32m${status}\x1b[0m` : `\x1b[31m${status}\x1b[0m`;
    const line =
      '  ' +
      r.folder.padEnd(folderWidth) +
      statusStr.padEnd(10 + 9) + // +9 for ANSI escape codes
      String(r.passed).padEnd(10) +
      String(r.failed).padEnd(10) +
      String(r.skipped).padEnd(10) +
      r.duration;
    console.log(line);
  }

  console.log('  ' + '-'.repeat(header.length - 2));
  const totalStatus = anyFailed ? '\x1b[31mFAIL\x1b[0m' : '\x1b[32mPASS\x1b[0m';
  const totalLine =
    '  ' +
    'TOTAL'.padEnd(folderWidth) +
    totalStatus.padEnd(10 + 9) +
    String(totalPassed).padEnd(10) +
    String(totalFailed).padEnd(10) +
    String(totalSkipped).padEnd(10);
  console.log(totalLine);
  console.log();

  if (anyFailed) {
    const failedFolders = results.filter((r) => r.exitCode !== 0).map((r) => r.folder);
    console.log(`  Failed folders: ${failedFolders.join(', ')}`);
    console.log();
  }
}

// --- Main ---

const filterArgs = process.argv.slice(2);
const folders = discoverFolders(filterArgs);

/** @type {RunGroup[]} */
const allGroups = [];
for (const folder of folders) {
  allGroups.push(...buildRunGroups(folder));
}

const isolatedCount = allGroups.filter((g) => g.label !== g.folder).length;
const isolatedSuffix = isolatedCount > 0 ? ` (${isolatedCount} isolated)` : '';
const groupNames = allGroups.map((g) => g.label).join(', ');
console.log(
  `Discovered ${folders.length} test folder(s), ${allGroups.length} run group(s)${isolatedSuffix}: ${groupNames}`,
);

/** @type {FolderResult[]} */
const results = [];

for (let i = 0; i < allGroups.length; i++) {
  results.push(await runGroup(allGroups[i]));

  // Brief pause between groups to let ports fully release
  if (i < allGroups.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

printSummary(results);

const anyFailed = results.some((r) => r.exitCode !== 0);
process.exit(anyFailed ? 1 : 0);
