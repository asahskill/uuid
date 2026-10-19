import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import generate, { v4, v7, generate as namedGenerate } from '../src/index.mjs';

const require = createRequire(import.meta.url);
const cjs = require('../src/index.cjs');
const pattern = /^([0-9a-f]{8})-([0-9a-f]{4})-([47][0-9a-f]{3})-([89ab][0-9a-f]{3})-([0-9a-f]{12})$/;

test('ESM and CommonJS provide valid RFC version and variant bits', () => {
  for (const api of [{ v4, v7 }, cjs]) {
    for (const version of ['v4', 'v7']) {
      const ids = Array.from({ length: 1000 }, () => api[version]());
      assert.equal(new Set(ids).size, ids.length);
      for (const id of ids) {
        assert.match(id, pattern);
        assert.equal(id[14], version[1]);
      }
    }
  }
  assert.equal(generate, v7);
  assert.equal(namedGenerate, v7);
  assert.equal(cjs.generate, cjs.v7);
});

test('v7 retains timestamp and strictly sorts within the same millisecond', () => {
  const originalNow = Date.now;
  const now = originalNow();
  Date.now = () => now;
  try {
    for (const api of [{ v7 }, cjs]) {
      const ids = Array.from({ length: 10000 }, () => api.v7());
      assert.deepEqual(ids, [...ids].sort());
      for (const id of ids) assert.equal(Number.parseInt(id.slice(0, 8) + id.slice(9, 13), 16), now);
    }
  } finally {
    Date.now = originalNow;
  }
});

test('v7 remains ordered across a clock rollback', () => {
  const originalNow = Date.now;
  const now = originalNow();
  try {
    Date.now = () => now;
    const first = v7();
    Date.now = () => now - 1000;
    assert.ok(v7() > first);
  } finally {
    Date.now = originalNow;
  }
});

test('CLI switches versions, prints count, and rejects invalid input', () => {
  const bin = new URL('../bin/uuid-gen.mjs', import.meta.url).pathname;
  const ids = execFileSync(process.execPath, [bin, '--v4', '-n', '3'], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(ids.length, 3);
  ids.forEach(id => assert.equal(id[14], '4'));
  assert.throws(() => execFileSync(process.execPath, [bin, '--count', '0'], { stdio: 'pipe' }));
});
