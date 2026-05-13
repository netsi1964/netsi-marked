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

test('jsr entrypoints declare self types and published declaration files', async () => {
  const jsr = JSON.parse(await readFile(new URL('../jsr.json', import.meta.url), 'utf8'));

  for (const exportPath of Object.values(jsr.exports)) {
    const source = await readFile(new URL(`..${exportPath.slice(1)}`, import.meta.url), 'utf8');
    const declarationPath = exportPath.replace(/\.js$/, '.d.ts');
    await readFile(new URL(`..${declarationPath.slice(1)}`, import.meta.url), 'utf8');
    assert.match(source, /@ts-self-types=/, `${exportPath} should declare self types for JSR`);
  }

  assert.ok(jsr.publish.include.includes('src/**/*.d.ts'));
});

test('jsr declaration entrypoints keep module docs', async () => {
  const declarations = [
    '../src/index.d.ts',
    '../src/netsi-marked.d.ts',
    '../src/plugins.d.ts',
    '../src/locales.d.ts',
    '../src/built-ins.d.ts'
  ];

  for (const declaration of declarations) {
    const source = await readFile(new URL(declaration, import.meta.url), 'utf8');
    assert.match(source, /@module\b/, `${declaration} should include module docs for JSR`);
  }
});
