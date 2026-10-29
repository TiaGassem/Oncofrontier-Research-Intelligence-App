// Verifies the built artifact behaves like a correctly configured static host:
// SPA fallback for unknown paths, hashed assets served as JS/CSS, SEO files and
// the service worker present. This is what Netlify/Cloudflare must reproduce.
//
//   node scripts/check-dist.mjs        (after a build)

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = 5188;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(distDir, safe);

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    // SPA fallback: unknown routes serve the app shell, exactly like
    // public/_redirects does on the real host.
    filePath = join(distDir, 'index.html');
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end('read failed');
  }
});

let failures = 0;
function check(name, ok, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
}

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${PORT}`;

try {
  const root = await fetch(`${base}/`);
  const html = await root.text();
  check('GET / serves HTML', root.status === 200 && root.headers.get('content-type')?.includes('text/html'), `${root.status}`);
  check('index.html links hashed JS and CSS', /src="\/assets\/[^"]+\.js"/.test(html) && /href="\/assets\/[^"]+\.css"/.test(html));

  const assetMatch = html.match(/src="(\/assets\/[^"]+\.js)"/);
  if (assetMatch) {
    const asset = await fetch(`${base}${assetMatch[1]}`);
    check('hashed asset served as JavaScript', asset.status === 200 && asset.headers.get('content-type')?.includes('javascript'), `${asset.status} ${asset.headers.get('content-type')}`);
  }

  const deep = await fetch(`${base}/some/deep/route`);
  const deepHtml = await deep.text();
  check('unknown deep route falls back to the app shell (SPA)', deep.status === 200 && deepHtml.includes('<div id="root">'));

  const sw = await fetch(`${base}/sw.js`);
  const swBody = await sw.text();
  check('service worker served as JavaScript', sw.status === 200 && sw.headers.get('content-type')?.includes('javascript'), `${sw.status}`);
  check('service worker has its injected precache list', !swBody.includes('__PRECACHE_MANIFEST__') && /const PRECACHE = \[/.test(swBody));

  for (const file of ['/robots.txt', '/sitemap.xml', '/manifest.json']) {
    const res = await fetch(`${base}${file}`);
    check(`${file} is served`, res.status === 200, `${res.status}`);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
  check('canonical points at the configured origin', canonical.startsWith('https://') && !canonical.includes('localhost'), canonical);
} finally {
  server.close();
}

console.log(failures === 0 ? '\nDIST CHECK: artifact is deployable' : `\nDIST CHECK: ${failures} failure(s)`);
process.exitCode = failures === 0 ? 0 : 1;
