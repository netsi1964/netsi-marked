import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('package has npm and jsr exports', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const jsr = JSON.parse(await readFile(new URL('../jsr.json', import.meta.url), 'utf8'));
  assert.equal(pkg.type, 'module');
  assert.ok(pkg.exports['.']);
  assert.ok(jsr.exports['.']);
});
