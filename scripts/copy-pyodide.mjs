// Vendors the Pyodide core runtime from node_modules into public/pyodide/ so the
// coding playground runs Python 100% offline and locally (no CDN, nothing global).
// Runs automatically on `npm install` (postinstall). Safe to re-run.
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'pyodide');
const dest = join(root, 'public', 'pyodide');

// The minimal set needed for loadPyodide() to boot the interpreter + stdlib.
const files = [
  'pyodide.mjs', // the ESM loader (imported at runtime by the worker)
  'pyodide.asm.wasm',
  'pyodide.asm.js',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

if (!existsSync(src)) {
  console.warn('[copy-pyodide] node_modules/pyodide not found — skipping (run `npm install`).');
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
let copied = 0;
for (const f of files) {
  const from = join(src, f);
  if (existsSync(from)) {
    copyFileSync(from, join(dest, f));
    copied++;
  } else {
    console.warn(`[copy-pyodide] missing ${f} in pyodide package`);
  }
}
console.log(`[copy-pyodide] vendored ${copied}/${files.length} files into public/pyodide/`);
