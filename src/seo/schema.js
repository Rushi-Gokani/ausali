import {
  AREAS_SERVED,
  BUSINESS,
  FAQS,
  OPENING_HOURS,
  ROUTES,
  SERVICES,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE,
  absoluteUrl,
} from './site.js';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BUSINESS_ID = `${SITE_URL}/#localbusiness`;

export function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.streetLocality,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.countryCode,
  };
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: absoluteUrl('/logo.png'),
      contentUrl: absoluteUrl('/logo.png'),
      width: 1983,
      height: 793,
      caption: `${BUSINESS.name} logo`,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#primaryimage`,
      url: absoluteUrl(SOCIAL_IMAGE.url),
      contentUrl: absoluteUrl(SOCIAL_IMAGE.url),
      width: SOCIAL_IMAGE.width,
      height: SOCIAL_IMAGE.height,
      caption: SOCIAL_IMAGE.alt,
    },
    email: BUSINESS.email,
    telephone: BUSINESS.phoneE164,
    telephoneDisplay: BUSINESS.phoneDisplay,
    address: postalAddress(),
    foundingLocation: { '@type': 'Place', name: BUSINESS.foundingPlace },
    sameAs: [BUSINESS.instagram, BUSINESS.facebook],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS.phoneE164,
        email: BUSINESS.email,
        contactType: 'sales',
        areaServed: 'AU',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS.phoneE164,
        contactType: 'customer support',
        areaServed: 'AU',
        availableLanguage: ['English'],
      },
    ],
  };
}

export function localBusinessNode() {
  return {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: `${SITE_URL}/`,
    logo: { '@id': `${SITE_URL}/#logo` },
    image: { '@id': `${SITE_URL}/#primaryimage` },
    parentOrganization: { '@id': ORG_ID },
    email: BUSINESS.email,
    telephone: BUSINESS.phoneE164,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: BUSINESS.paymentAccepted,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${BUSINESS.name}, ${BUSINESS.streetLocality}, ${BUSINESS.regionCode}, ${BUSINESS.country}`,
    )}`,
    areaServed: AREAS_SERVED.map((area) =>
      area.type === 'City'
        ? { '@type': 'City', name: area.name, containedInPlace: { '@type': 'State', name: 'Queensland' } }
        : { '@type': 'AdministrativeArea', name: area.name },
    ),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS.latitude,
        longitude: BUSINESS.longitude,
      },
      geoRadius: '75000',
    },
    openingHoursSpecification: OPENING_HOURS.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    makesOffer: SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        serviceType: service.type,
        provider: { '@id': BUSINESS_ID },
        areaServed: { '@type': 'State', name: 'Queensland' },
      },
    })),
    knowsAbout: SERVICES.map((service) => service.name),
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: `${SITE_NAME} — Architectural Aluminium`,
    alternateName: BUSINESS.name,
    description: BUSINESS.description,
    inLanguage: 'en-AU',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/contact?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageNode(route, { noindex = false } = {}) {
  const url = route.path === '/' ? `${SITE_URL}/` : absoluteUrl(route.path);
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@id': `${SITE_URL}/#primaryimage` },
    inLanguage: 'en-AU',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    ...(noindex ? { robots: 'noindex, nofollow' } : {}),
  };
}

export function breadcrumbNode(route) {
  const items = [{ name: 'Home', item: `${SITE_URL}/` }];
  items.push({ name: route.nav, item: absoluteUrl(route.path) });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(route.path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function serviceCatalogNode() {
  return {
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/#services`,
    name: `${BUSINESS.name} architectural aluminium services`,
    description: BUSINESS.description,
    provider: { '@id': BUSINESS_ID },
    itemListElement: SERVICES.map((service, index) => ({
      '@type': 'Offer',
      position: index + 1,
      url: `${SITE_URL}/contact`,
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        serviceType: service.type,
        provider: { '@id': BUSINESS_ID },
      },
    })),
  };
}

export function faqNode() {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/contact#faq`,
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function buildJsonLd(route, options = {}) {
  const { noindex = false, includeFaq = false, includeServices = false, includeProjects = false } = options;

  const graph = [organizationNode(), localBusinessNode(), websiteNode(), webPageNode(route, { noindex })];

  if (route.path !== '/') graph.push(breadcrumbNode(route));
  if (includeServices) graph.push(serviceCatalogNode());
  if (includeFaq) graph.push(faqNode());

  if (includeProjects && route.projects) {
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${absoluteUrl(route.path)}#projectlist`,
      name: route.title,
      description: route.description,
      isPartOf: { '@id': WEBSITE_ID },
      url: absoluteUrl(route.path),
      mainEntity: {
        '@type': 'ItemList',
        name: 'AUSALI Solutions aluminium projects',
        numberOfItems: route.projects.length,
        itemListElement: route.projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.title,
            abstract: project.desc,
            locationCreated: { '@type': 'Place', name: `${project.location}, Australia` },
            creator: { '@id': ORG_ID },
          },
        })),
      },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph, inLanguage: SITE_LOCALE };
}

export function buildGlobalJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), localBusinessNode(), websiteNode(), serviceCatalogNode()],
  };
}

export function getSitemapEntries() {
  return ROUTES.map((route) => ({
    loc: route.path === '/' ? `${SITE_URL}/` : absoluteUrl(route.path),
    priority: route.priority,
    changefreq: route.changefreq,
  }));
}