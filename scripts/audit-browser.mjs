// Real-browser verification for the claims that unit tests cannot make:
// RTL layout, keyboard focus, axe accessibility, responsive overflow, SPA
// deep links and the service worker. Run against `vite preview` (production
// build), not the dev server, so the service worker is exercised too.
//
//   node scripts/audit-browser.mjs
//
// Verdicts are printed as PASS/FAIL and the process exits non-zero on failure.

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.AUDIT_URL ?? 'http://127.0.0.1:5199';
const ARTIFACTS = 'artifacts';

let failures = 0;
function record(name, ok, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
}

await mkdir(ARTIFACTS, { recursive: true });

const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(String(err)));

const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
async function axeScan(label) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] });
    return res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
  });
  const serious = result.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  record(
    `axe ${label}: no serious/critical WCAG A/AA violations`,
    serious.length === 0,
    serious.map((v) => `${v.id}(${v.nodes})`).join(', ') || `${result.length} minor`
  );
  if (serious.length) {
    console.log('      ' + JSON.stringify(serious));
  }
}

// ── 1. Public landing page ────────────────────────────────────────────────
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForSelector('h1');

record('landing renders a heading for a first-time visitor', await page.locator('h1').first().isVisible());
record('public page has no workspace sidebar', (await page.locator('aside').count()) === 0, `asides=${await page.locator('aside').count()}`);
await axeScan('landing');
await page.screenshot({ path: `${ARTIFACTS}/landing-en.png`, fullPage: false });

// ── 2. Keyboard: first Tab reaches the skip link, with a visible outline ──
await page.keyboard.press('Tab');
const firstStop = await page.evaluate(() => {
  const el = document.activeElement;
  const style = el ? getComputedStyle(el) : null;
  return {
    tag: el?.tagName ?? '',
    text: (el?.textContent ?? '').trim().slice(0, 40),
    outline: style ? `${style.outlineStyle} ${style.outlineWidth}` : '',
  };
});
record('first Tab stop is the skip link', /home/i.test(firstStop.text) || firstStop.tag === 'A', JSON.stringify(firstStop));
record('focused element shows a visible outline', !/none|0px/.test(firstStop.outline), firstStop.outline);

// ── 3. Arabic: real translation + RTL document direction ────────────────
const langSelect = page.locator('select').first();
await langSelect.selectOption('ar');
await page.waitForTimeout(500);
const dir = await page.evaluate(() => document.documentElement.dir);
const heroAr = (await page.locator('h1').first().innerText()).trim();
record('Arabic sets document direction to rtl', dir === 'rtl', `dir=${dir}`);
record('Arabic hero text is actually translated', /[\u0600-\u06FF]/.test(heroAr), heroAr.slice(0, 32));
const rtlOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
record('RTL layout does not overflow horizontally', rtlOverflow <= 1, `overflow=${rtlOverflow}px`);
await page.screenshot({ path: `${ARTIFACTS}/landing-ar-rtl.png`, fullPage: false });

await langSelect.selectOption('fr');
await page.waitForTimeout(400);
const heroFr = (await page.locator('h1').first().innerText()).trim();
record('French hero text is translated', /recherche/i.test(heroFr), heroFr.slice(0, 40));
await langSelect.selectOption('en');
await page.waitForTimeout(300);

// ── 4. Onboarding flow ───────────────────────────────────────────────────
await page.getByRole('button', { name: /Get started/i }).first().click();
await page.waitForTimeout(400);
record('Get started opens onboarding', await page.getByRole('heading', { name: /Choose your language/i }).isVisible());
await axeScan('onboarding step 1');
await page.screenshot({ path: `${ARTIFACTS}/onboarding-step1.png` });

await page.getByRole('button', { name: /Continue/i }).click();
await page.getByRole('radio', { name: /Patient or survivor/i }).check();
await page.getByRole('button', { name: /Continue/i }).click();
await page.getByRole('checkbox', { name: /Larger text/i }).check();
const largeTextApplied = await page.evaluate(() => document.documentElement.classList.contains('a11y-large-text'));
record('accessibility choice applies to the document', largeTextApplied);
await page.screenshot({ path: `${ARTIFACTS}/onboarding-accessibility.png` });

await page.getByRole('button', { name: /Continue/i }).click();  await page.getByRole('radio', { name: /^Simple/i }).check();
await page.getByRole('button', { name: /Continue/i }).click();
await axeScan('onboarding summary');
await page.getByRole('button', { name: /Enter OncoFrontiers/i }).click();
await page.waitForTimeout(600);

const inWorkspace = (await page.locator('aside').count()) > 0;
record('finishing onboarding opens the workspace', inWorkspace);
const density = await page.evaluate(() => document.documentElement.dataset.density);
record('workspace density is applied to the document', density === 'simple', `density=${density}`);
await page.screenshot({ path: `${ARTIFACTS}/workspace-simple.png` });
await axeScan('workspace');

// ── 5. Deep link + SPA refresh ───────────────────────────────────────────
await page.goto(`${BASE}/#/anatomy`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const anatomyText = (await page.locator('main').innerText()).trim();
record('deep link #/anatomy loads the Atlas module after refresh', anatomyText.length > 300, `${anatomyText.length} chars`);
await page.screenshot({ path: `${ARTIFACTS}/atlas-anatomy.png` });

// ── 6. Service worker ────────────────────────────────────────────────────
const swState = await page.evaluate(async () => {
  if (!('serviceWorker' in navigator)) return 'unsupported';
  const reg = await navigator.serviceWorker.getRegistration();
  return reg ? (reg.active ? 'active' : reg.installing ? 'installing' : 'waiting') : 'none';
});
record('service worker is registered and active', swState === 'active', swState);

// ── 7. Mobile viewport ───────────────────────────────────────────────────
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mpage = await mobile.newPage();
await mpage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
const mobileOverflow = await mpage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
record('mobile landing has no horizontal overflow', mobileOverflow <= 1, `overflow=${mobileOverflow}px`);
await mpage.screenshot({ path: `${ARTIFACTS}/landing-mobile.png`, fullPage: false });
await mobile.close();

record('no console errors during the whole run', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();
console.log(failures === 0 ? '\nBROWSER AUDIT: all checks passed' : `\nBROWSER AUDIT: ${failures} check(s) failed`);
process.exitCode = failures === 0 ? 0 : 1;
