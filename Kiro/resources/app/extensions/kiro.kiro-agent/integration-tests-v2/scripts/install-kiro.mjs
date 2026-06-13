#!/usr/bin/env node
// @ts-check
/**
 * Downloads and extracts a Kiro installation for the CDP integration tests.
 *
 * Installs into integration-tests-v2/.kiro-test/ so it doesn't interfere
 * with the .vscode-test/ directory used by @vscode/test-electron tests.
 *
 * Reuses the shared download/extract utilities from scripts/.
 */
import { systemDefaultPlatform } from '@vscode/test-electron/out/util.js';
import { spawn } from 'child_process';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';
import { Extract } from 'unzipper';
import { fileURLToPath } from 'url';
import { cachePath, kiroTestVersion } from '../../scripts/constants.mjs';
import { downloadKiro, getKiroDownloadName } from '../../scripts/utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INTEG_ROOT = path.resolve(__dirname, '..');
const INSTALL_DIR = path.join(INTEG_ROOT, '.kiro-test');

/**
 * Extracts a Kiro release archive into the given directory.
 * @param {import('../../scripts/utils.mjs').KiroArchiveInfo} archiveFile
 * @param {string} installationPath
 */
async function extractKiroArchive(archiveFile, installationPath) {
  await fs.rm(installationPath, { force: true, recursive: true });

  if (archiveFile.format === 'zip') {
    if (process.platform === 'win32') {
      mkdirSync(installationPath, { recursive: true });
      await spawnChild('tar', ['-xf', archiveFile.path, '-C', installationPath]);
    } else if (process.platform === 'darwin') {
      await spawnChild('unzip', ['-q', archiveFile.path, '-d', installationPath]);
    } else {
      await new Promise((resolve, reject) =>
        createReadStream(archiveFile.path)
          .pipe(Extract({ path: installationPath }))
          .on('close', resolve)
          .on('error', reject),
      );
    }
  } else {
    mkdirSync(installationPath, { recursive: true });
    await spawnChild('tar', ['-xzf', archiveFile.path, '--strip-components=1', '-C', installationPath]);
  }

  await fs.writeFile(path.join(installationPath, 'is-complete'), '');
}

/**
 * Spawns a child process and waits for it to exit.
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function spawnChild(command, args) {
  // nosemgrep: javascript.lang.security.detect-child-process.detect-child-process
  const child = spawn(command, args, { stdio: 'pipe' });
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
  return new Promise((resolve, reject) => {
    child.on('error', (err) => reject(new Error(`Failed to spawn ${command}: ${err.message}`)));
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`))));
  });
}

/** Downloads and installs Kiro for the CDP integration tests. */
async function main() {
  /** @type {import('../../scripts/utils.mjs').KiroVersionInfo} */
  const versionInfo = {
    version: kiroTestVersion,
    platform: systemDefaultPlatform,
    quality: 'insider',
  };

  const name = getKiroDownloadName(versionInfo);
  const installationPath = path.join(INSTALL_DIR, name);

  // Skip if already installed
  if (existsSync(path.join(installationPath, 'is-complete'))) {
    // eslint-disable-next-line no-console
    console.log(`Kiro already installed at ${installationPath}, skipping.`);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`Downloading Kiro (${name})...`);
  const archive = await downloadKiro(versionInfo, cachePath);

  // eslint-disable-next-line no-console
  console.log(`Extracting to ${installationPath}...`);
  mkdirSync(installationPath, { recursive: true });
  await extractKiroArchive(archive, installationPath);

  // eslint-disable-next-line no-console
  console.log('Done.');
}

try {
  await main();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Failed to install Kiro for integration tests:', error);
  process.exit(1);
}
