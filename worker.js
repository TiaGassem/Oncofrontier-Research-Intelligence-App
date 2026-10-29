// Freebuff Sites entry point for the built OncoFrontiers SPA.
//
// Static assets are served by the platform asset binding; `spa: true` in
// freebuff.manifest.json makes unknown paths fall back to index.html, which is
// the same contract public/_redirects provides on Netlify/Cloudflare Pages.
// The app uses hash routing (#/curemap), so "/" is the only path the browser
// ever requests directly.
//
// NOTE: _redirects must be excluded from the deployed assets — Cloudflare's
// worker upload rejects a file with that name (code 100324). It stays in
// public/ for Cloudflare Pages builds; remove it from dist before sites_deploy.

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
