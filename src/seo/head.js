import {
  BUSINESS,
  NOINDEX_ROUTES,
  ROUTES,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE,
  absoluteUrl,
} from './site.js';
import { buildJsonLd } from './schema.js';

const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, googlebot, googlebot-snippet, googlebot-image, googlebot-video, googlebot-mobile, bingbot';

const ROBOTS_NOINDEX = 'noindex, nofollow, noarchive, nosnippet, noimageindex';

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLdBlock(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function renderHeadTags({ route, noindex = false } = {}) {
  const canonical = route.path === '/' ? `${SITE_URL}/` : absoluteUrl(route.path);
  const image = absoluteUrl(SOCIAL_IMAGE.url);
  const imageAlt = route.imageAlt || SOCIAL_IMAGE.alt;
  const robots = noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX;

  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${SITE_LOCALE}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@ausali_solutions" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="geo.region" content="AU-QLD" />`,
    `<meta name="geo.placename" content="Capalaba, Queensland" />`,
    `<meta name="geo.position" content="${BUSINESS.latitude};${BUSINESS.longitude}" />`,
    `<meta name="ICBM" content="${BUSINESS.latitude}, ${BUSINESS.longitude}" />`,
    `<meta name="author" content="${esc(SITE_NAME)}" />`,
    `<meta name="rating" content="general" />`,
    jsonLdBlock(
      buildJsonLd(route, {
        noindex,
        includeFaq: route.path === '/contact',
        includeServices: route.path === '/' || route.path === '/home-package',
        includeProjects: route.path === '/projects',
      }),
    ),
  ];

  return tags.join('\n    ');
}

function internalLinks(currentPath) {
  return ROUTES.filter((route) => route.path !== currentPath)
    .map((route) => `<li><a href="${route.path === '/' ? '/' : absoluteUrl(route.path)}">${esc(route.nav)}</a></li>`)
    .join('');
}

export function renderPrerenderBody(route) {
  const escapeText = (text) => esc(text);
  const parts = [];

  parts.push(`<section class="prerender-content">`);
  parts.push(`<h1>${escapeText(route.h1 || route.title)}</h1>`);

  if (route.lead) {
    parts.push(`<p class="prerender-lead">${escapeText(route.lead)}</p>`);
  }

  if (route.noscript) {
    parts.push('<div class="prerender-prose">');
    route.noscript.forEach((paragraph) => parts.push(`<p>${escapeText(paragraph)}</p>`));
    parts.push('</div>');
  }

  if (route.projects && route.projects.length) {
    parts.push('<h2>Featured projects</h2>');
    parts.push('<ul class="prerender-list">');
    route.projects.forEach((project) => {
      parts.push(
        `<li><strong>${escapeText(project.title)}</strong> — ${escapeText(
          project.category,
        )}, ${escapeText(project.location)}. ${escapeText(project.desc)}</li>`,
      );
    });
    parts.push('</ul>');
  }

  (route.sections || []).forEach((section) => {
    parts.push(`<h2>${escapeText(section.h2)}</h2>`);
    if (section.text) {
      parts.push(`<p>${escapeText(section.text)}</p>`);
    }
    if (section.items && section.items.length) {
      parts.push('<ul class="prerender-list">');
      section.items.forEach((item) => parts.push(`<li>${escapeText(item)}</li>`));
      parts.push('</ul>');
    }
  });

  parts.push('<h2>Contact AUSALI Solutions</h2>');
  parts.push(
    `<address class="prerender-address"><a href="tel:${BUSINESS.phoneE164}">${BUSINESS.phoneDisplay}</a> &middot; <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a> &middot; ${BUSINESS.streetLocality}, ${BUSINESS.regionCode}, Australia</address>`,
  );
  parts.push('<ul class="prerender-links">');
  parts.push(internalLinks(route.path));
  parts.push('</ul>');
  parts.push('</section>');

  return parts.join('\n');
}

export function routeEntries() {
  return [
    ...ROUTES.map((route) => ({ route, noindex: false })),
    ...NOINDEX_ROUTES.map((route) => ({
      route: { ...route, nav: 'Admin', description: 'Internal quote manager. Not for indexing.' },
      noindex: true,
    })),
  ];
}