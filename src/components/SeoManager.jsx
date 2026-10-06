import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NOINDEX_ROUTES, ROUTES, SITE_LOCALE, SOCIAL_IMAGE, absoluteUrl } from '../seo/site.js';
import { buildJsonLd } from '../seo/schema.js';

const MANAGED_ATTR = 'data-seo-managed';

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  return element;
}

function upsertProperty(property, content) {
  return upsertMeta(`meta[property="${property}"]`, { property, content });
}

function upsertName(name, content) {
  return upsertMeta(`meta[name="${name}"]`, { name, content });
}

function syncJsonLd(data) {
  const id = 'ausali-route-jsonld';
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
}

function normalisePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const path = normalisePath(pathname);

  useEffect(() => {
    const noindexMeta = document.querySelector(`meta[name="${MANAGED_ATTR}-robots"]`);
    const noindexRoute = NOINDEX_ROUTES.find((route) => route.path === path);
    const route = ROUTES.find((item) => item.path === path);

    if (noindexRoute || !route) {
      document.title = noindexRoute
        ? noindexRoute.title
        : 'Page Not Found | AUSALI SOLUTIONS';

      if (!noindexMeta) {
        const created = document.createElement('meta');
        created.name = 'robots';
        created.setAttribute(MANAGED_ATTR, 'true');
        document.head.appendChild(created);
      }
      const meta = document.querySelector(`meta[name="${MANAGED_ATTR}-robots"]`);
      if (meta) {
        meta.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
      }
      return undefined;
    }

    const canonical = absoluteUrl(path);

    document.title = route.title;

    upsertName('description', route.description);
    upsertName('robots', 'index, follow, max-image-preview:large, max-snippet:-1');
    upsertName('googlebot', 'index, follow');
    upsertLink('canonical', canonical);

    upsertProperty('og:type', 'website');
    upsertProperty('og:url', canonical);
    upsertProperty('og:title', route.title);
    upsertProperty('og:description', route.description);
    upsertProperty('og:image', absoluteUrl(SOCIAL_IMAGE.url));
    upsertProperty('og:image:alt', route.imageAlt || SOCIAL_IMAGE.alt);
    upsertProperty('og:locale', SITE_LOCALE);

    upsertName('twitter:card', 'summary_large_image');
    upsertName('twitter:title', route.title);
    upsertName('twitter:description', route.description);
    upsertName('twitter:image', absoluteUrl(SOCIAL_IMAGE.url));
    upsertName('twitter:image:alt', route.imageAlt || SOCIAL_IMAGE.alt);

    syncJsonLd(
      buildJsonLd(route, {
        includeFaq: route.path === '/contact',
        includeServices: route.path === '/' || route.path === '/home-package',
        includeProjects: route.path === '/projects',
      }),
    );

    const robotsMeta = document.querySelector(`meta[name="${MANAGED_ATTR}-robots"]`);
    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1');
    }

    return undefined;
  }, [path]);

  return null;
}