import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFINITIVE_PATTERNS,
  HEURISTIC_PATTERNS,
  isUnitTestFile,
  scanFileContent,
  deduplicateWarnings,
} from '../check-pbt-drift.mjs';

// ── isUnitTestFile ───────────────────────────────────────────────────

describe('isUnitTestFile', () => {
  it('accepts standard .test.ts files', () => {
    assert.equal(isUnitTestFile('foo.test.ts'), true);
    assert.equal(isUnitTestFile('bar.spec.test.ts'), true);
  });

  it('accepts .test.tsx files', () => {
    assert.equal(isUnitTestFile('Component.test.tsx'), true);
  });

  it('rejects .pbt-test.ts and .pbt-test.tsx files', () => {
    assert.equal(isUnitTestFile('foo.pbt-test.ts'), false);
    assert.equal(isUnitTestFile('foo.pbt-test.tsx'), false);
  });

  it('rejects non-test files', () => {
    assert.equal(isUnitTestFile('foo.ts'), false);
    assert.equal(isUnitTestFile('foo.test.js'), false);
  });
});

// ── Tier 1: DEFINITIVE_PATTERNS ──────────────────────────────────────

describe('DEFINITIVE_PATTERNS', () => {
  const match = (line) => DEFINITIVE_PATTERNS.filter(({ re }) => re.test(line)).map(({ label }) => label);

  it('detects import from fast-check (single quotes)', () => {
    assert.deepEqual(match("import fc from 'fast-check';"), ['fast-check import']);
  });

  it('detects import from fast-check (double quotes)', () => {
    assert.deepEqual(match('import * as fc from "fast-check";'), ['fast-check import']);
  });

  it('detects @fast-check scoped imports', () => {
    assert.deepEqual(match("import { fc } from '@fast-check/vitest';"), ['@fast-check/* import']);
  });

  it('detects require("fast-check")', () => {
    assert.deepEqual(match("const fc = require('fast-check');"), ['fast-check require']);
  });

  it('detects fc.assert(', () => {
    assert.deepEqual(match('    fc.assert('), ['fc.assert()']);
  });

  it('detects fc.property(', () => {
    assert.deepEqual(match('      fc.property(fc.integer(), (n) => n > 0),'), ['fc.property()']);
  });

  it('detects fc.asyncProperty(', () => {
    assert.deepEqual(match('    fc.asyncProperty(fc.string(), async (s) => {}),'), ['fc.asyncProperty()']);
  });

  it('does not match normal test code', () => {
    assert.deepEqual(match("import { expect } from 'chai';"), []);
    assert.deepEqual(match("expect(result).to.have.property('name');"), []);
    assert.deepEqual(match('describe("my test", () => {'), []);
    assert.deepEqual(match('const factory = createFactory();'), []);
  });

  it('does not match fast-check in comments', () => {
    // The patterns intentionally match comments too — a comment mentioning
    // fc.assert( is suspicious enough to flag. This test documents that behavior.
    const hits = match('// fc.assert(fc.property(...))');
    assert.ok(hits.length > 0, 'comments with fc.assert are flagged');
  });
});

// ── Tier 2: HEURISTIC_PATTERNS ───────────────────────────────────────

describe('HEURISTIC_PATTERNS', () => {
  const match = (line) => HEURISTIC_PATTERNS.filter(({ re }) => re.test(line)).map(({ label }) => label);

  it('detects fc.integer( and similar namespace calls', () => {
    const hits = match('fc.integer({ min: 0, max: 100 })');
    assert.ok(hits.includes('fc.* namespace usage'));
  });

  it('detects fc.string(', () => {
    const hits = match('fc.string({ minLength: 1 })');
    assert.ok(hits.includes('fc.* namespace usage'));
  });

  it('detects fc.Arbitrary type annotation', () => {
    const hits = match('const myArb: fc.Arbitrary<string> = fc.string();');
    assert.ok(hits.includes('fc.Arbitrary type annotation'));
  });

  it('detects const nameArb variable declaration', () => {
    const hits = match('const nameArb = fc.string();');
    assert.ok(hits.includes('variable declared as *Arb (arbitrary convention)'));
  });

  it('detects let/var Arb declarations', () => {
    assert.ok(match('let serverArb = fc.record({})').includes('variable declared as *Arb (arbitrary convention)'));
    assert.ok(match('var itemArb = fc.oneof()').includes('variable declared as *Arb (arbitrary convention)'));
  });

  it('does not match Arb in non-declaration contexts', () => {
    // Plain usage of a variable named fooArb should not trigger
    const hits = match('return fooArb;');
    assert.ok(!hits.includes('variable declared as *Arb (arbitrary convention)'));
  });

  it('does not match normal test code', () => {
    assert.deepEqual(match("expect(result).to.have.property('name');"), []);
    assert.deepEqual(match('const result = calculateDiff(a, b);'), []);
    assert.deepEqual(match("it('should handle arbitrary input', () => {"), []);
  });
});

// ── scanFileContent ──────────────────────────────────────────────────

describe('scanFileContent', () => {
  it('returns empty arrays for clean unit test code', () => {
    const content = [
      "import { expect } from 'chai';",
      "describe('my test', () => {",
      "  it('works', () => { expect(1).to.equal(1); });",
      '});',
    ].join('\n');

    const { violations, warnings } = scanFileContent(content, 'clean.test.ts');
    assert.equal(violations.length, 0);
    assert.equal(warnings.length, 0);
  });

  it('detects tier 1 violations with correct line numbers', () => {
    const content = ["import fc from 'fast-check';", '', 'fc.assert(fc.property(fc.integer(), (n) => n === n));'].join(
      '\n',
    );

    const { violations } = scanFileContent(content, 'drift.test.ts');
    assert.ok(violations.length >= 2, `expected >= 2 violations, got ${violations.length}`);

    const importHit = violations.find((v) => v.label === 'fast-check import');
    assert.ok(importHit);
    assert.equal(importHit.line, 1);
    assert.equal(importHit.file, 'drift.test.ts');

    const assertHit = violations.find((v) => v.label === 'fc.assert()');
    assert.ok(assertHit);
    assert.equal(assertHit.line, 3);
  });

  it('detects tier 2 warnings', () => {
    const content = 'const nameArb = fc.string();';
    const { warnings } = scanFileContent(content, 'heuristic.test.ts');
    assert.ok(warnings.length > 0, 'expected at least one warning');
  });

  it('reports correct relative path in results', () => {
    const content = "import fc from 'fast-check';";
    const { violations } = scanFileContent(content, 'src/utils/my.test.ts');
    assert.equal(violations[0].file, 'src/utils/my.test.ts');
  });
});

// ── deduplicateWarnings ──────────────────────────────────────────────

describe('deduplicateWarnings', () => {
  it('removes warnings for lines that already have violations', () => {
    const violations = [{ file: 'a.test.ts', line: 3, text: 'fc.assert(', label: 'fc.assert()' }];
    const warnings = [
      { file: 'a.test.ts', line: 3, text: 'fc.assert(', label: 'fc.* namespace usage' },
      { file: 'a.test.ts', line: 5, text: 'const nameArb = ...', label: 'variable declared as *Arb' },
    ];

    const unique = deduplicateWarnings(violations, warnings);
    assert.equal(unique.length, 1);
    assert.equal(unique[0].line, 5);
  });

  it('keeps all warnings when there are no violations', () => {
    const unique = deduplicateWarnings(
      [],
      [
        { file: 'a.test.ts', line: 1, text: 'x', label: 'y' },
        { file: 'a.test.ts', line: 2, text: 'x', label: 'y' },
      ],
    );
    assert.equal(unique.length, 2);
  });

  it('returns empty array when both inputs are empty', () => {
    assert.deepEqual(deduplicateWarnings([], []), []);
  });
});
