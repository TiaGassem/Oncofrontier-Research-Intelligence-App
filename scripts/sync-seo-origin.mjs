import { readFile, writeFile } from 'node:fs/promises';

const configuredOrigin = process.env.PUBLIC_SITE_URL || process.env.URL;
if (!configuredOrigin) {
  throw new Error('Set PUBLIC_SITE_URL to the public HTTPS domain, or run the build on Netlify so URL is provided.');
}
let siteUrl;

try {
  siteUrl = new URL(configuredOrigin);
} catch {
  throw new Error('PUBLIC_SITE_URL/URL must be an absolute HTTP(S) URL.');
}

if (siteUrl.protocol !== 'https:' && siteUrl.hostname !== 'localhost') {
  throw new Error('The public site URL must use HTTPS.');
}

const origin = siteUrl.origin;
const indexPath = new URL('../dist/index.html', import.meta.url);
const robotsPath = new URL('../dist/robots.txt', import.meta.url);
const sitemapPath = new URL('../dist/sitemap.xml', import.meta.url);

let html = await readFile(indexPath, 'utf8');
function setHeadTag(source, pattern, tag) {
  if (pattern.test(source)) return source.replace(pattern, tag);
  return source.replace('</head>', `    ${tag}\n  </head>`);
}

html = setHeadTag(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${origin}/" />`);
html = setHeadTag(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${origin}/" />`);
html = setHeadTag(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${origin}/icon-512.png" />`);
html = setHeadTag(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${origin}/icon-512.png" />`);
await writeFile(indexPath, html);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`;
await Promise.all([writeFile(robotsPath, robots), writeFile(sitemapPath, sitemap)]);
console.log(`SEO metadata set for ${origin}`);
