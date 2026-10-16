// Builds the static site into dist/: copies public/ (compiled app + assets) and
// generates crawlable landing, module, about, and localized pages plus robots/sitemap.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SITE = 'https://oncofrontier-research.netlify.app';
const OUT = process.env.OUT_DIR || 'dist';
const NAME = 'ONCOFRONTIER';
const DISCLAIMER =
  'ONCOFRONTIER is a research tool for literature and trial discovery. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult the original sources and qualified clinicians.';

const SOURCES = [
  ['PubMed / NCBI E-utilities', 'Biomedical literature citations and abstracts', 'https://pubmed.ncbi.nlm.nih.gov/'],
  ['Europe PMC', 'European and global life-science articles, including open-access full text', 'https://europepmc.org/'],
  ['ClinicalTrials.gov (API v2)', 'Registered clinical studies, status, phase, and interventions', 'https://clinicaltrials.gov/'],
  ['Open Targets Platform', 'Target–disease associations, tractability, known drugs, and safety liabilities', 'https://platform.opentargets.org/'],
  ['PubChem', 'Compound names, SMILES, and molecular properties', 'https://pubchem.ncbi.nlm.nih.gov/'],
];

const MODULES = [
  {
    slug: 'curemap',
    name: 'CUREMAP',
    tag: 'Cancer evidence explorer',
    desc: 'Search PubMed, Europe PMC, and ClinicalTrials.gov at once by cancer type, gene, drug, or treatment, with deduplicated, source-linked results.',
    intro: 'CUREMAP runs one query across PubMed, Europe PMC, and ClinicalTrials.gov and merges the results into a single evidence list. Records are deduplicated by PMID, DOI, and NCT ID, labeled with their study context, and always link back to the original source.',
    points: ['Unified search across three literature and trial sources', 'Filters by cancer type, gene, drug, treatment, and research question', 'Deduplication by PMID, DOI, and NCT ID', 'Study-context labels and verified identifiers with original source links'],
    q: ['How do I search cancer literature and clinical trials together?', 'Open CUREMAP, enter a cancer type, gene, drug, or question, and it queries PubMed, Europe PMC, and ClinicalTrials.gov in parallel. Duplicate records are merged and every result links to its original source.'],
  },
  {
    slug: 'discovery-bridge',
    name: 'Discovery Bridge',
    tag: 'Cancer drug discovery workspace',
    desc: 'Assess cancer drug targets with Open Targets evidence, look up compounds in PubChem, and plan translational validation from one workspace.',
    intro: 'Discovery Bridge connects target biology to chemistry. It pulls target–disease association scores, known drugs and clinical stages, and safety liabilities from the Open Targets Platform, looks up compounds by name or SMILES in PubChem, and adds resistance context from published studies and trials.',
    points: ['Target–disease associations with datatype-specific scores', 'Drug and clinical candidates with maximum clinical stage', 'Safety liabilities from Open Targets', 'PubChem compound lookup by name or SMILES, with SMILES syntax checking', 'Translational validation planner and Markdown research brief export'],
    q: ['How can I evaluate a cancer drug target?', 'In Discovery Bridge, enter a target and a cancer type to see Open Targets association scores by evidence type, known drugs and their highest clinical stage, safety liabilities, and related resistance literature.'],
  },
  {
    slug: 'resistance-atlas',
    name: 'Resistance Atlas',
    tag: 'Cancer treatment resistance mechanisms',
    desc: 'Explore reported treatment resistance mechanisms by cancer type, therapy, target, and gene, with every finding linked to its publication.',
    intro: 'Resistance Atlas surfaces published reports of treatment resistance in cancer. Filter by cancer type, therapy, molecular target, or gene to see the mechanisms described in the literature. Every finding links to its supporting publication, so you can check the evidence yourself.',
    points: ['Resistance mechanisms by cancer type, therapy, target, and gene', 'Retrieved live from PubMed and Europe PMC', 'Every finding links to its supporting publication'],
    q: ['How does ONCOFRONTIER find treatment-resistance evidence?', 'Resistance Atlas searches PubMed and Europe PMC for studies reporting resistance to a given therapy, target, or gene in a chosen cancer type. It lists the mechanisms those studies report and links each one to the source publication. Nothing is inferred or generated.'],
  },
  {
    slug: 'equity-radar',
    name: 'Cancer Equity Radar',
    tag: 'Cancer research gaps',
    desc: 'Compare publication and registered clinical trial activity across cancer types to spot under-researched areas, with data limits stated plainly.',
    intro: 'Cancer Equity Radar compares how much research activity each cancer type receives, using publication counts and registered clinical trials. It helps identify under-studied cancers and research gaps. It never fabricates statistics and states the limits of the underlying counts clearly.',
    points: ['Publication activity by cancer type', 'Registered clinical trial activity by cancer type', 'Explicit data limitations, with no fabricated statistics'],
    q: ['How can I identify research gaps in cancer?', 'Cancer Equity Radar compares live publication counts and registered trial counts across cancer types. Low activity relative to other cancers points to possible research gaps, and the tool states the limits of these counts alongside the results.'],
  },
  {
    slug: 'action-planner',
    name: 'Action Planner',
    tag: 'Research brief builder',
    desc: 'Collect selected papers and trials into an exportable research brief in Markdown, with full source traceability.',
    intro: 'Action Planner turns the records you select across ONCOFRONTIER into a structured research brief. Export it as Markdown with every citation and identifier preserved, ready for a lab meeting, grant draft, or literature review.',
    points: ['Collect records from any module', 'Markdown export with copy or download', 'Source traceability for every item'],
    q: ['Can I export my findings as a research brief?', 'Yes. Select records in any module, then open Action Planner to build a brief and export it as Markdown. Each item keeps its PMID, DOI, or NCT ID and original link.'],
  },
  {
    slug: 'research-assistant',
    name: 'Research Assistant',
    tag: 'Retrieval-based cancer research Q&A',
    desc: 'Ask cancer research questions and get answers retrieved from connected public sources, with citations. No generative model invents results.',
    intro: 'Research Assistant answers questions by retrieving matching records from the connected public sources and citing them. It is a retrieval-based assistant: no generative AI model writes the answers, so every claim that depends on a source points to that source.',
    points: ['Keyword-based retrieval from PubMed, Europe PMC, and ClinicalTrials.gov', 'Citations for source-dependent claims', 'No generative model, so no invented papers or citations'],
    q: ['Does ONCOFRONTIER use generative AI?', 'No. Research Assistant is retrieval-based. It finds and cites matching records from public sources rather than generating text, so it cannot invent papers or citations.'],
  },
];

const FAQ = [
  ['What is ONCOFRONTIER?', 'ONCOFRONTIER is a free pan-cancer research intelligence platform. It searches published literature and clinical trials in real time and organizes the evidence on cancer types, genes, drugs, treatment resistance, and research gaps.'],
  ['Where does ONCOFRONTIER get its data?', 'From five public sources queried live: PubMed (NCBI E-utilities), Europe PMC, ClinicalTrials.gov API v2, the Open Targets Platform, and PubChem. No results are stored, invented, or hardcoded.'],
  MODULES[2].q,
  MODULES[0].q,
  MODULES[5].q,
  ['Who is ONCOFRONTIER for?', 'Academic researchers, students, translational and clinical researchers, and pharmaceutical R&D teams who need traceable cancer evidence quickly.'],
  ['Is ONCOFRONTIER free, and do I need an account?', 'Yes, it is free, and all research features work without an account. An optional account saves search history, favorites, projects, and notes.'],
  ['Does ONCOFRONTIER give medical advice?', 'No. It is a research tool for discovering literature and trials. It does not diagnose or recommend treatment. Consult qualified clinicians for medical decisions.'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const faqLd = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

const CSS = `.of{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#16293f;line-height:1.6;max-width:880px;margin:0 auto;padding:24px}.of a{color:#0f7f73}.of nav{display:flex;flex-wrap:wrap;gap:14px;font-size:14px;padding-bottom:12px;border-bottom:1px solid #e2e8f0;margin-bottom:24px}.of nav a{text-decoration:none}.of h1{font-size:2rem;line-height:1.2;margin:.4em 0}.of h2{font-size:1.3rem;margin:1.6em 0 .5em}.of h3{font-size:1.05rem;margin:1em 0 .2em}.of ul{padding-inline-start:1.2em}.of .tag{color:#0f7f73;font-weight:600;margin:0}.of .cta{display:inline-block;background:#16293f;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 0}.of .note{font-size:14px;color:#475569;border-top:1px solid #e2e8f0;margin-top:32px;padding-top:12px}`;

const nav = (lang = 'en') =>
  lang === 'en'
    ? `<nav aria-label="Site"><a href="/"><strong>${NAME}</strong></a>${MODULES.map((m) => `<a href="/${m.slug}">${m.name}</a>`).join('')}<a href="/about">About &amp; methodology</a><a href="/fr/" hreflang="fr">Français</a><a href="/ar/" hreflang="ar">العربية</a></nav>`
    : `<nav aria-label="Site"><a href="/"><strong>${NAME}</strong></a><a href="/" hreflang="en">English</a><a href="/fr/" hreflang="fr">Français</a><a href="/ar/" hreflang="ar">العربية</a></nav>`;

const sourcesList = () => `<ul>${SOURCES.map(([n, d, u]) => `<li><a href="${u}" rel="noopener">${esc(n)}</a>: ${esc(d)}</li>`).join('')}</ul>`;
const footer = () => `<p class="note">${esc(DISCLAIMER)} <a href="/about">Methodology and limitations</a>.</p>`;

function head({ path, title, desc, lang = 'en', alternates = false, extra = '' }) {
  const url = SITE + path;
  const alt = alternates
    ? ['en:/', 'fr:/fr/', 'ar:/ar/', 'x-default:/'].map((p) => { const [l, h] = p.split(':'); return `<link rel="alternate" hreflang="${l}" href="${SITE}${h}">`; }).join('')
    : '';
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">${alt}<link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="theme-color" content="#16293f"><meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="${{ en: 'en_US', fr: 'fr_FR', ar: 'ar_AR' }[lang]}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${SITE}/og-image.png">${extra}`;
}

const staticPage = (opts, body) =>
  `<!doctype html><html lang="${opts.lang || 'en'}"${opts.lang === 'ar' ? ' dir="rtl"' : ''}><head>${head(opts)}<style>${CSS}</style></head><body><main class="of">${body}</main></body></html>`;

function write(path, html) {
  const file = join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

rmSync(OUT, { recursive: true, force: true });
cpSync('public', OUT, { recursive: true });

// Home: the React app mounts into #root and replaces this pre-rendered content,
// which stays available to crawlers and AI agents that do not execute JavaScript.
const homeDesc = 'Free pan-cancer research intelligence: search PubMed, Europe PMC, ClinicalTrials.gov, Open Targets, and PubChem live to explore cancer evidence, treatment resistance, and research gaps.';
const homeLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: NAME, url: SITE + '/', description: homeDesc, applicationCategory: 'ResearchApplication', operatingSystem: 'Any (web browser)', inLanguage: ['en', 'fr', 'ar'], isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  faqLd(FAQ),
];
write(
  'index.html',
  `<!doctype html><html lang="en"><head>${head({ path: '/', title: `${NAME}: Pan-Cancer Research Intelligence`, desc: homeDesc, alternates: true, extra: homeLd.map(ld).join('') })}<style>${CSS}</style><script type="module" crossorigin src="/assets/index-DXo83J1d.js"></script><link rel="stylesheet" crossorigin href="/assets/index-Bktchn_t.css"></head><body><div id="root"><main class="of">${nav()}
<h1>${NAME}: pan-cancer research intelligence</h1>
<p>${NAME} is a free research platform that searches published cancer literature and clinical trials in real time. It helps you explore evidence by cancer type, gene, drug, and treatment, understand treatment resistance, and find research gaps. Every record traces back to a verifiable source: no fabricated papers, no invented citations, no hardcoded results.</p>
<h2>Modules</h2>${MODULES.map((m) => `<h3><a href="/${m.slug}">${m.name}</a>: ${m.tag}</h3><p>${esc(m.desc)}</p>`).join('')}
<h2>Data sources</h2><p>All data comes live from five public, key-free sources:</p>${sourcesList()}
<h2>Who it is for</h2><p>Academic researchers, students, translational scientists, clinical researchers, and pharmaceutical R&amp;D teams. Available in English, French, and Arabic.</p>
<h2>Evidence integrity</h2><p>Results are retrieved directly from source APIs at query time and shown with their identifiers (PMID, DOI, NCT ID) and original links. Records are deduplicated across sources and labeled by study context. When a source fails or data is limited, ${NAME} says so instead of filling the gap.</p>
<h2>Frequently asked questions</h2>${FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}
${footer()}</main></div></body></html>`
);

for (const m of MODULES) {
  const title = `${m.name}: ${m.tag} | ${NAME}`;
  const extra = ld({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: m.desc, url: `${SITE}/${m.slug}`, isPartOf: { '@type': 'WebApplication', name: NAME, url: SITE + '/' } }) + ld(faqLd([m.q]));
  write(
    `${m.slug}/index.html`,
    staticPage(
      { path: `/${m.slug}`, title, desc: m.desc, extra },
      `${nav()}<p class="tag">${esc(m.tag)}</p><h1>${m.name}</h1><p>${esc(m.intro)}</p><a class="cta" href="/">Open ${m.name} in ${NAME}</a>
<h2>What you can do</h2><ul>${m.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
<h2>${esc(m.q[0])}</h2><p>${esc(m.q[1])}</p>
<h2>Data sources</h2>${sourcesList()}${footer()}`
    )
  );
}

write(
  'about/index.html',
  staticPage(
    { path: '/about', title: `About and methodology | ${NAME}`, desc: `How ${NAME} retrieves, deduplicates, and labels cancer research evidence from five public sources, its limitations, and its medical disclaimer.` },
    `${nav()}<h1>About ${NAME} and our methodology</h1>
<p>${NAME} is an independent, open-source (MIT-licensed) research intelligence project. It makes public cancer research data faster to explore while keeping every result traceable to its origin.</p>
<h2>How sources are retrieved</h2><p>Each search is sent at query time from your browser directly to the public APIs below. ${NAME} does not maintain its own copy of the literature and does not generate content with AI models.</p>${sourcesList()}
<h2>How records are processed and labeled</h2><ul><li>Results from different sources are merged and deduplicated by PMID, DOI, and NCT ID.</li><li>Each record shows its source, identifiers, and a link to the original page.</li><li>Records carry study-context labels, such as publication versus registered trial, so evidence types are not mixed up.</li><li>Gene symbols, compound names, and identifiers are never translated.</li></ul>
<h2>Limitations</h2><ul><li>Coverage and ranking depend on each source's own search behavior and indexing delays.</li><li>Publication and trial counts measure research activity, not evidence quality or clinical value.</li><li>Keyword retrieval can miss relevant studies or include tangential ones. Always review the primary sources.</li><li>If a source is unavailable, the affected results show an error instead of substitute data.</li></ul>
<h2>Privacy</h2><p>All research features work without an account. Optional accounts store search history, favorites, projects, and notes, accessible only to their owner.</p>
<h2>Medical disclaimer</h2><p>${esc(DISCLAIMER)}</p>`
  )
);

const LOCALES = {
  fr: {
    title: `${NAME} : intelligence de recherche pan-cancer`,
    desc: 'Plateforme gratuite de recherche sur le cancer : interrogez PubMed, Europe PMC, ClinicalTrials.gov, Open Targets et PubChem en temps réel pour explorer les données, la résistance aux traitements et les lacunes de la recherche.',
    body: `<h1>${NAME} : intelligence de recherche pan-cancer</h1><p>${NAME} est une plateforme gratuite qui interroge en temps réel la littérature publiée et les essais cliniques sur le cancer. Explorez les données par type de cancer, gène, médicament et traitement, analysez la résistance aux traitements et repérez les lacunes de la recherche. Chaque résultat renvoie à une source vérifiable.</p><a class="cta" href="/">Ouvrir ${NAME}</a><p>Choisissez « Français » dans le sélecteur de langue de l'application.</p>
<h2>Modules</h2><ul><li><strong>CUREMAP</strong> : recherche unifiée dans PubMed, Europe PMC et ClinicalTrials.gov</li><li><strong>Discovery Bridge</strong> : évaluation des cibles thérapeutiques (Open Targets) et des composés (PubChem)</li><li><strong>Resistance Atlas</strong> : mécanismes de résistance aux traitements, chacun lié à sa publication</li><li><strong>Cancer Equity Radar</strong> : activité de publication et d'essais par type de cancer</li><li><strong>Action Planner</strong> : export de synthèses de recherche en Markdown</li><li><strong>Research Assistant</strong> : questions-réponses fondées sur la recherche documentaire, avec citations</li></ul>
<h2>Sources de données</h2><p>PubMed, Europe PMC, ClinicalTrials.gov, Open Targets Platform et PubChem, interrogées en direct. Aucun résultat n'est inventé.</p>
<h2>Pour qui ?</h2><p>Chercheurs, étudiants, chercheurs translationnels et cliniques, équipes R&amp;D pharmaceutiques.</p>
<p class="note">${NAME} est un outil de recherche et ne fournit pas d'avis médical, de diagnostic ni de recommandation thérapeutique.</p>`,
  },
  ar: {
    title: `${NAME}: منصة ذكاء بحثي شاملة لأبحاث السرطان`,
    desc: 'منصة مجانية لأبحاث السرطان تبحث مباشرة في PubMed وEurope PMC وClinicalTrials.gov وOpen Targets وPubChem لاستكشاف الأدلة ومقاومة العلاج والفجوات البحثية.',
    body: `<h1>${NAME}: منصة ذكاء بحثي شاملة لأبحاث السرطان</h1><p>${NAME} منصة مجانية تبحث مباشرة في الأدبيات المنشورة والتجارب السريرية المتعلقة بالسرطان. استكشف الأدلة حسب نوع السرطان والجين والدواء والعلاج، وافهم آليات مقاومة العلاج، وحدد الفجوات البحثية. كل نتيجة مرتبطة بمصدر يمكن التحقق منه.</p><a class="cta" href="/">افتح ${NAME}</a><p>اختر «العربية» من قائمة اللغات داخل التطبيق.</p>
<h2>الوحدات</h2><ul><li><strong>CUREMAP</strong>: بحث موحد في PubMed وEurope PMC وClinicalTrials.gov</li><li><strong>Discovery Bridge</strong>: تقييم الأهداف الدوائية (Open Targets) والمركبات (PubChem)</li><li><strong>Resistance Atlas</strong>: آليات مقاومة العلاج، كل منها مرتبط بمنشوره</li><li><strong>Cancer Equity Radar</strong>: نشاط النشر والتجارب حسب نوع السرطان</li><li><strong>Action Planner</strong>: تصدير ملخصات بحثية بصيغة Markdown</li><li><strong>Research Assistant</strong>: أسئلة وأجوبة قائمة على استرجاع المصادر مع الاستشهادات</li></ul>
<h2>مصادر البيانات</h2><p>PubMed وEurope PMC وClinicalTrials.gov وOpen Targets Platform وPubChem، يتم الاستعلام عنها مباشرة. لا توجد نتائج مختلقة.</p>
<h2>لمن هذه المنصة؟</h2><p>الباحثون الأكاديميون والطلاب والباحثون الانتقاليون والسريريون وفرق البحث والتطوير الدوائي.</p>
<p class="note">${NAME} أداة بحثية ولا تقدم استشارة طبية أو تشخيصًا أو توصيات علاجية.</p>`,
  },
};
for (const [lang, l] of Object.entries(LOCALES)) {
  write(`${lang}/index.html`, staticPage({ path: `/${lang}/`, title: l.title, desc: l.desc, lang, alternates: true }, nav(lang) + l.body));
}

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
const urls = ['/', ...MODULES.map((m) => `/${m.slug}`), '/about', '/fr/', '/ar/'];
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`
);

console.log(`Built ${urls.length} pages into ${OUT}/`);
