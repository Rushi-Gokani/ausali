import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  AREAS_SERVED,
  BUSINESS,
  FAQS,
  NOINDEX_ROUTES,
  ROUTES,
  SERVICES,
  SITE_URL,
  absoluteUrl,
} from '../src/seo/site.js';
import { renderHeadTags, renderPrerenderBody } from '../src/seo/head.js';
import { buildGlobalJsonLd } from '../src/seo/schema.js';

const dist = process.argv[2] || 'dist';
const indexPath = join(dist, 'index.html');
const template = readFileSync(indexPath, 'utf8');
const buildDate = new Date().toISOString().slice(0, 10);

function writeFile(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, 'utf8');
}

/* ---------------------------------------------------------------- robots.txt */

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'CCBot',
];

function renderRobots() {
  const lines = [
    '# robots.txt for AUSALI SOLUTIONS',
    `# ${BUSINESS.name} — architectural aluminium, Brisbane & South East Queensland`,
    `# Last updated: ${buildDate}`,
    '',
    '# ---------- Search engines ----------',
    'User-agent: *',
    'Allow: /',
    '',
    '# Internal tools — never index',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /*?replytocom',
    'Disallow: /*?gclid',
    'Disallow: /*?gbraid',
    'Disallow: /*?wbraid',
    'Disallow: /*?utm_',
    'Disallow: /wp-admin/',
    'Disallow: /cgi-bin/',
    '',
    '# ---------- AI / LLM crawlers (explicitly welcome) ----------',
  ];

  AI_CRAWLERS.forEach((bot) => {
    lines.push('', `User-agent: ${bot}`, 'Allow: /', 'Disallow: /admin', 'Disallow: /api/');
  });

  lines.push(
    '',
    '# ---------- Host directive (Yandex) ----------',
    'User-agent: Yandex',
    'Allow: /',
    'Disallow: /admin',
    '',
    `# ---------- Sitemap ----------`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    `# Host: ${SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')}`,
    '',
  );

  return lines.join('\n');
}

/* -------------------------------------------------------------- sitemap.xml */

function renderSitemap() {
  const entries = ROUTES.map((route) => ({
    loc: route.path === '/' ? `${SITE_URL}/` : absoluteUrl(route.path),
    priority: route.priority,
    changefreq: route.changefreq,
  }));

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/sitemap/0.9">
${urls}
</urlset>
`;
}

/* -------------------------------------------------------------- llms.txt */

function renderLlmsTxt() {
  const areas = AREAS_SERVED.map((a) => a.name).join(', ');

  return `# AUSALI SOLUTIONS

> ${BUSINESS.description}

AUSALI Solutions is an architectural aluminium specialist based in ${BUSINESS.streetLocality}, ${BUSINESS.regionCode}, on Brisbane's north side. The business designs, fabricates and installs aluminium gates, slat fencing, facade screening, sunhoods, louvres and balustrades for modern homes. Design, fabrication and installation are all completed in-house by its own Brisbane team, with no subcontractors. Projects typically run 2-4 weeks for a single sliding gate and 4-8 weeks for a full home package. Council approvals are prepared, lodged and managed by AUSALI Solutions on the client's behalf.

## Contact

- Phone: ${BUSINESS.phoneDisplay} (${BUSINESS.phone})
- Email: ${BUSINESS.email}
- Location: ${BUSINESS.streetLocality}, ${BUSINESS.regionCode} ${BUSINESS.postalCode}, ${BUSINESS.country}
- Website: ${SITE_URL}
- Instagram: ${BUSINESS.instagram}
- Facebook: ${BUSINESS.facebook}
- Hours: Monday to Friday 07:00-17:00, Saturday 08:00-12:00, closed Sunday

## Services

${SERVICES.map((service) => `- **${service.name}** (${service.slug}): ${service.description}`).join('\n')}

## Pages

${ROUTES.map((route) => `- [${route.nav}](${route.path === '/' ? `${SITE_URL}/` : absoluteUrl(route.path)}): ${route.description}`).join('\n')}

## Service area

Suburbs and areas served: ${areas}.

## Frequently asked questions

${FAQS.map((faq) => `### ${faq.q}\n\n${faq.a}`).join('\n\n')}

## Optional

- [Full JSON-LD structured data](${SITE_URL}/structured-data.json)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;
}

/* ------------------------------------------------------- prerender routes */

function injectIntoTemplate(route, { noindex }) {
  const head = renderHeadTags({ route, noindex });
  const body = noindex ? '' : renderPrerenderBody(route);

  let html = template;

  // Strip every template SEO tag first. The injected block is the single source
  // of truth, otherwise the page would carry duplicate <title>/description/
  // canonical tags and Google would pick whichever appears first (the home page
  // defaults) on every route.
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/g, '');
  html = html.replace(/<meta\s+name="description"[\s\S]*?\/>/g, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/g, '');

  html = html.replace(/<!-- seo:route-head -->/, `<!-- seo:route-head -->\n    ${head}`);

  if (!noindex && body) {
    html = html.replace(
      /<div id="root"><\/div>/,
      `<noscript>\n${body}\n    </noscript>\n    <div id="root"></div>`,
    );
  }

  return html;
}

function prerenderRoutes() {
  const written = [];

  ROUTES.forEach((route) => {
    const html = injectIntoTemplate(route, { noindex: false });
    const target = join(dist, route.file);
    writeFile(target, html);
    written.push(target);
  });

  NOINDEX_ROUTES.forEach((route) => {
    const html = injectIntoTemplate(
      {
        ...route,
        nav: 'Admin',
        description: 'Internal quote manager. Not for indexing.',
        imageAlt: 'AUSALI Solutions admin',
      },
      { noindex: true },
    );
    const target = join(dist, route.file);
    writeFile(target, html);
    written.push(target);
  });

  return written;
}

/* ---------------------------------------------------- structured-data.json */

function renderStructuredDataJson() {
  return `${JSON.stringify(buildGlobalJsonLd(), null, 2)}\n`;
}

/* -------------------------------------------------------------------- run */

const written = prerenderRoutes();

writeFile(join(dist, 'robots.txt'), renderRobots());
writeFile(join(dist, 'sitemap.xml'), renderSitemap());
writeFile(join(dist, 'llms.txt'), renderLlmsTxt());
writeFile(join(dist, 'structured-data.json'), renderStructuredDataJson());

console.log(`[seo] prerendered ${written.length} routes`);
console.log('[seo] wrote robots.txt, sitemap.xml, llms.txt, structured-data.json');