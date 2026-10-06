import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const pages = [
  ['index.html', '/', false],
  ['about/index.html', '/about', false],
  ['home-package/index.html', '/home-package', false],
  ['projects/index.html', '/projects', false],
  ['contact/index.html', '/contact', false],
  ['admin/index.html', '/admin', true],
];

let failures = 0;

const fail = (page, msg) => {
  failures += 1;
  console.log(`  FAIL [${page}] ${msg}`);
};

console.log('== per-page validation ==\n');

const countOf = (html, re) => (html.match(re) || []).length;

pages.forEach(([file, route, expectNoindex]) => {
  const html = readFileSync(join(dist, file), 'utf8');
  console.log(`--- ${route} (${file})`);

  // Duplicate head tags are the classic SPA-SEO bug: Google honours the first
  // occurrence, so a leftover template tag silently overrides every page.
  [
    ['title', /<title>/g, 1],
    ['meta description', /<meta\s+name="description"/g, 1],
    ['canonical', /<link\s+rel="canonical"/g, 1],
    ['meta robots', /<meta\s+name="robots"/g, 1],
    ['og:title', /<meta\s+property="og:title"/g, 1],
    ['twitter:card', /<meta\s+name="twitter:card"/g, 1],
    ['json-ld', /<script type="application\/ld\+json">/g, 1],
    // noindex pages get no crawlable prerender body
    ['noscript prerender', /<noscript>/g, expectNoindex ? 0 : 1],
  ].forEach(([label, re, expected]) => {
    const n = countOf(html, re);
    if (n !== expected) fail(route, `expected ${expected} "${label}" tag(s), found ${n}`);
  });
  console.log('  duplicate head tags: none');

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  if (!title) fail(route, 'missing <title>');
  else console.log(`  title: ${title.length} chars - ${title}`);

  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const expectedCanonical = route === '/' ? 'https://ausalisolutions.com.au/' : `https://ausalisolutions.com.au${route}`;
  if (canonical !== expectedCanonical) fail(route, `canonical "${canonical}" != "${expectedCanonical}"`);
  else console.log(`  canonical: ${canonical}`);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!desc) fail(route, 'missing meta description');
  else if (desc.length > 160) fail(route, `meta description ${desc.length} chars (>160)`);
  else console.log(`  description: ${desc.length} chars`);

  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1];
  if (!robots) fail(route, 'missing meta robots');
  else console.log(`  robots: ${robots.slice(0, 40)}`);
  if (expectNoindex && !/noindex/.test(robots || '')) fail(route, 'admin not noindex');
  if (!expectNoindex && /noindex/.test(robots || '')) fail(route, 'public page accidentally noindex');

  ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale', 'twitter:card', 'twitter:image'].forEach((p) => {
    const re = p.startsWith('og:')
      ? new RegExp(`<meta property="${p}" content="([^"]*)"`)
      : new RegExp(`<meta name="${p}" content="([^"]*)"`);
    const v = (html.match(re) || [])[1];
    if (!v) fail(route, `missing ${p}`);
  });
  console.log('  og + twitter tags: present');

  ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'site.webmanifest', 'browserconfig.xml'].forEach((asset) => {
    if (!html.includes(asset)) fail(route, `missing icon/manifest link: ${asset}`);
  });
  if (!html.includes('theme-color')) fail(route, 'missing theme-color');
  console.log('  icons + manifest + theme-color: present');

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLdBlocks.length === 0) fail(route, 'no JSON-LD block');
  jsonLdBlocks.forEach((m, i) => {
    try {
      const data = JSON.parse(m[1].replace(/\\u003c/g, '<'));
      const types = (data['@graph'] || []).map((n) => n['@type']).flat();
      console.log(`  json-ld[${i}] OK - ${types.join(', ')}`);
      if (!types.includes('Organization')) fail(route, 'graph missing Organization');
      if (!types.includes('WebSite')) fail(route, 'graph missing WebSite');
      if (!types.some((t) => t.includes('Business'))) fail(route, 'graph missing LocalBusiness');
      if (route === '/contact' && !types.includes('FAQPage')) fail(route, 'contact missing FAQPage');
      if (route === '/about' && !types.includes('BreadcrumbList')) fail(route, 'about missing BreadcrumbList');
    } catch (err) {
      fail(route, `json-ld[${i}] invalid JSON: ${err.message}`);
    }
  });

  if (!expectNoindex) {
    if (!/<noscript>/.test(html)) fail(route, 'missing noscript prerender content');
    else {
      const nsBlock = (html.match(/<noscript>[\s\S]*?<\/noscript>/) || [''])[0];
      const h1 = (nsBlock.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1];
      const links = nsBlock.match(/<a /g) || [];
      const words = nsBlock.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      console.log(`  noscript: h1="${(h1 || '').slice(0, 58)}..." links=${links.length} words=${words}`);
      if (!h1) fail(route, 'noscript missing h1');
      if (words < 80) fail(route, `noscript too thin (${words} words)`);
    }
  }

  console.log('');
});

console.log('== cross-page checks ==');
const home = readFileSync(join(dist, 'index.html'), 'utf8');
const contact = readFileSync(join(dist, 'contact/index.html'), 'utf8');
const about = readFileSync(join(dist, 'about/index.html'), 'utf8');

const ogImage = (home.match(/<meta property="og:image" content="([^"]*)"/) || [])[1];
if (ogImage !== 'https://ausalisolutions.com.au/og-image.jpg') fail('home', `og:image "${ogImage}"`);
else console.log(`  og:image absolute: ${ogImage}`);

const canonicals = pages.map(([f]) => {
  const h = readFileSync(join(dist, f), 'utf8');
  return (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
});
if (new Set(canonicals).size !== canonicals.length) fail('all', 'duplicate canonical URLs');
else console.log('  all canonicals unique');

const h1s = pages.filter(([, , n]) => !n).map(([, route]) => {
  const file = pages.find(([, r]) => r === route)[0];
  const h = readFileSync(join(dist, file), 'utf8');
  const n2 = (h.match(/<noscript>[\s\S]*?<\/noscript>/) || [''])[0].match(/<h1>/g) || [];
  return `${route}:${n2.length}`;
});
console.log(`  prerender h1 count -> ${h1s.join(' ')}`);
if (h1s.some((x) => x.endsWith(':0'))) fail('all', 'a public route has no prerendered h1');

if (!about.includes('Coorparoo')) fail('about', 'suburb keywords missing from prerender');
if (!contact.includes('0434 230 821') && !contact.includes('0434230821')) fail('contact', 'phone missing from prerender');
console.log('  NAP + suburb keywords present in prerendered copy');

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);