// Injects the built asset list and a content hash into dist/sw.js.
// Runs after the Vite build and the SEO step (see package.json postbuild).
//
// The version changes only when built output changes, so clients pick up a new
// deploy on their next visit without a manual cache-bust.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const PRECACHE_PATTERN = /\.(js|css|html|png|svg|json)$/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(distDir);

const precache = files
  .map((file) => relative(distDir, file).split('\\').join('/'))
  .filter((path) => PRECACHE_PATTERN.test(path))
  .filter((path) => path !== 'sw.js' && !path.endsWith('.map'))
  .map((path) => `/${path}`)
  .sort();

if (!precache.includes('/index.html')) {
  throw new Error('dist/index.html is missing — run the Vite build before this step.');
}

const hash = createHash('sha256');
hash.update(precache.join('\n'));
for (const path of precache) {
  hash.update(await readFile(join(distDir, path.slice(1))));
}
const version = hash.digest('hex').slice(0, 12);

const swPath = join(distDir, 'sw.js');
let sw = await readFile(swPath, 'utf8');

if (!sw.includes('__PRECACHE_MANIFEST__') || !sw.includes('__SW_VERSION__')) {
  throw new Error('dist/sw.js is missing its build placeholders.');
}

sw = sw
  .replace('__PRECACHE_MANIFEST__', JSON.stringify(precache))
  .replace('__SW_VERSION__', version);

await writeFile(swPath, sw);
console.log(`Service worker: ${precache.length} files precached, version ${version}`);
