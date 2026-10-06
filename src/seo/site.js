export const SITE_URL = 'https://ausalisolutions.com.au';
export const SITE_NAME = 'AUSALI SOLUTIONS';
export const SITE_LOCALE = 'en_AU';
export const SITE_LANG = 'en-AU';

export const BUSINESS = {
  name: 'AUSALI SOLUTIONS',
  legalName: 'AUSALI SOLUTIONS',
  description:
    'Architectural aluminium gates, slat fencing, façade screening, sunhoods, louvres and balustrades — designed, fabricated and installed in-house across Brisbane and South East Queensland.',
  slogan: 'Designed Around Your Space',
  phone: '0434230821',
  phoneDisplay: '0434 230 821',
  phoneE164: '+61434230821',
  email: 'info@ausalisolutions.com.au',
  streetLocality: 'Capalaba',
  region: 'Queensland',
  regionCode: 'QLD',
  postalCode: '4157',
  country: 'Australia',
  countryCode: 'AU',
  latitude: -27.487,
  longitude: 153.1966,
  priceRange: '$$',
  currenciesAccepted: 'AUD',
  paymentAccepted: 'Cash, Bank transfer, Credit card',
  foundingPlace: 'Brisbane, Queensland, Australia',
  instagram: 'https://www.instagram.com/ausali_solutions?stkn=M211eThlNHVwZ2Ft',
  facebook: 'https://www.facebook.com/share/19xiCPZAGv/',
};

export const OPENING_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:00' },
  { days: ['Saturday'], opens: '08:00', closes: '12:00' },
];

export const AREAS_SERVED = [
  { name: 'Brisbane', type: 'City' },
  { name: 'Capalaba', type: 'City' },
  { name: 'Coorparoo', type: 'City' },
  { name: 'Wakerley', type: 'City' },
  { name: 'Carindale', type: 'City' },
  { name: 'Mansfield', type: 'City' },
  { name: 'Wynnum', type: 'City' },
  { name: 'Cleveland', type: 'City' },
  { name: 'Logan', type: 'City' },
  { name: 'Springwood', type: 'City' },
  { name: 'Ipswich', type: 'City' },
  { name: 'Redlands Bay', type: 'City' },
  { name: 'Mount Gravatt', type: 'City' },
  { name: 'Sunnybank', type: 'City' },
  { name: 'Rochedale', type: 'City' },
  { name: 'Bulimba', type: 'City' },
  { name: 'West End', type: 'City' },
  { name: 'Camp Hill', type: 'City' },
  { name: 'Hawthorne', type: 'City' },
  { name: 'South East Queensland', type: 'AdministrativeArea' },
];

export const SERVICES = [
  {
    name: 'Architectural Aluminium Gates',
    slug: 'aluminium-gates',
    description:
      'Sliding, swinging, pivot and automated aluminium gates for driveways, front entries and side access, engineered for smooth daily operation.',
    type: 'Sliding gates, automated gates, entry gates, driveway gates',
  },
  {
    name: 'Aluminium Slat Fencing & Boundary Screening',
    slug: 'aluminium-slat-fencing',
    description:
      'High-durability architectural slat fencing and privacy screening that secures the boundary without blocking light or airflow.',
    type: 'Slat fencing, boundary screening, privacy screens',
  },
  {
    name: 'Façade Screening & Battens',
    slug: 'facade-screening',
    description:
      'Precision vertical aluminium battens for solar shading, heat control and distinctive modern curb appeal across front façades.',
    type: 'Façade battens, architectural screening, sun shading',
  },
  {
    name: 'Sunhoods & Louvres',
    slug: 'sunhoods-louvres',
    description:
      'Engineered aluminium window hoods and louvres that provide passive cooling and shade while lifting the modern look of the home.',
    type: 'Window sunhoods, louvres, awnings, passive cooling',
  },
  {
    name: 'Glass & Aluminium Balustrades',
    slug: 'balustrades',
    description:
      'Structural glass and aluminium balustrading for decks, balconies, staircases and waterfront properties, built to Australian safety standards.',
    type: 'Glass balustrades, balcony balustrades, deck handrails',
  },
  {
    name: 'Full Home Aluminium Package',
    slug: 'home-package',
    description:
      'Gates, fencing, screening, sunhoods and balustrades specified as one coordinated architectural system so every element matches.',
    type: 'Home package, whole-home aluminium, integrated design',
  },
  {
    name: 'Aluminium Repairs & Servicing',
    slug: 'repairs-servicing',
    description:
      'Motor, track, alignment and powder coat repairs for existing aluminium gates and screens, extending the life of your installation.',
    type: 'Gate repair, motor service, powder coat touch-up, realignment',
  },
];

export const FAQS = [
  {
    q: 'What areas do you service?',
    a: 'We design, fabricate and install across Brisbane, the Bayside, Logan, Ipswich, Redlands and greater South East Queensland. If you are nearby and unsure, just ask — if we cannot help, we will say so straight up.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'A single sliding gate usually runs 2–4 weeks from sign-off. Full home packages — fence, gates, screening and façade elements — typically 4–8 weeks depending on complexity and council requirements.',
  },
  {
    q: 'Do you handle council approvals?',
    a: 'Yes. Where approvals are needed we prepare the drawings, lodge the application and manage it through to sign-off, so you do not have to.',
  },
  {
    q: "Can you match my home's existing colours?",
    a: 'Almost certainly. We powder coat in the full Dulux range, so your gate, fence or screening can match windows, roof, garage door or render exactly.',
  },
  {
    q: 'Do you only build new, or do you repair too?',
    a: 'We service and repair existing aluminium gates and screens — motors, tracks, powder coat touch-ups and realignment. If it is beyond saving, we will tell you honestly and quote the replacement.',
  },
];

export const SOCIAL_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'AUSALI Solutions — architectural aluminium gates, screening and balustrades in Brisbane',
};

export const ROUTES = [
  {
    path: '/',
    file: 'index.html',
    nav: 'Home',
    navOrder: 1,
    title: 'Aluminium Gates & Screening Brisbane | AUSALI Solutions',
    description:
      'Design, fabricate and install architectural aluminium gates, slat fencing, facade screening and balustrades across Brisbane & South East Queensland.',
    image: '/hero-bg.jpg',
    imageAlt:
      'Architectural aluminium slat gate and facade battens on a modern Queensland home at dusk',
    priority: '1.0',
    changefreq: 'weekly',
    h1: 'Architectural Aluminium Gates, Screening & Balustrades in Brisbane',
    lead:
      'AUSALI Solutions designs, fabricates and installs architectural aluminium gates, slat fencing, facade screening, sunhoods and balustrades for modern Queensland homes. One trade, mastered in-house — measured on site, quoted in detail, built and installed by our own Brisbane team.',
    noscript: [
      'We design, fabricate and install architectural aluminium gates, slat fencing, facade screening, sunhoods and balustrades across Brisbane, the Bayside, Logan, Ipswich, the Redlands and greater South East Queensland.',
      'Every project is measured on site and quoted as a fixed price with no vague allowances. Where council approvals are needed we prepare the drawings, lodge the application and manage it through to sign-off.',
      'Because design, fabrication and installation all happen in-house, gates, fences, screening and balustrades are specified as one coordinated architectural language rather than a patchwork of suppliers.',
    ],
    sections: [
      { h2: 'What we do', items: SERVICES.map((s) => `${s.name} — ${s.description}`) },
      {
        h2: 'Areas we service',
        text: 'Coorparoo, Capalaba, Wakerley, Carindale, Mansfield, Wynnum, Cleveland, Logan, Springwood, Ipswich, Redlands Bay, Mount Gravatt, Sunnybank, Rochedale, Bulimba, West End, Camp Hill and Hawthorne.',
      },
      { h2: 'Our five-step process', text: 'Enquiry and quote request, site visit and detailed fixed-price quote, design and drawings, council approvals where required, then fabrication and installation by our own team.' },
    ],
  },
  {
    path: '/about',
    file: 'about/index.html',
    nav: 'About',
    navOrder: 2,
    title: 'About AUSALI Solutions | Aluminium Specialists, Brisbane',
    description:
      'Meet AUSALI Solutions: Brisbane aluminium specialists designing, fabricating and installing architectural gates, screening and balustrades in-house.',
    image: '/hero-bg.jpg',
    imageAlt: 'AUSALI Solutions architectural aluminium installation in Brisbane',
    priority: '0.8',
    changefreq: 'monthly',
    h1: 'About AUSALI Solutions — Brisbane Aluminium Specialists',
    lead:
      'AUSALI Solutions is a Brisbane aluminium specialist focused on a single trade: architectural aluminium. We design, fabricate and install gates, slat fencing, facade screening, sunhoods and balustrades for modern homes across South East Queensland.',
    noscript: [
      'We are a specialist aluminium company based in Capalaba, on Brisbane’s north side, working across Brisbane, the Bayside, Logan, Ipswich and the Redlands.',
      'Design, fabrication and installation are all handled by our own team — no subcontractors. That means one point of contact, one standard of finish and one warranty across your whole project.',
    ],
    sections: [
      { h2: 'Why aluminium', text: 'Aluminium is corrosion resistant, low maintenance and endlessly powder coatable in the full Dulux range, so gates, fencing and screening can match windows, roofs, garage doors and render exactly.' },
      { h2: 'How we work', text: 'Clear fixed-price quotes, detailed drawings, council approvals managed on your behalf, and fabrication and installation completed by the same team that measured the site.' },
    ],
  },
  {
    path: '/home-package',
    file: 'home-package/index.html',
    nav: 'Home Package',
    navOrder: 3,
    title: 'The AUSALI Home Package | Integrated Aluminium Design',
    description:
      'One material, one architectural language. Gates, slat fencing, screening, sunhoods and balustrades designed as one coordinated system for your home.',
    image: '/home-package-sketch.jpg',
    imageAlt: 'The AUSALI Home Package — ten integrated aluminium elements in one architectural system',
    priority: '0.9',
    changefreq: 'monthly',
    h1: 'The AUSALI Home Package — One Material, One Architectural Language',
    lead:
      'The AUSALI Home Package unifies gates, slat fencing, facade screening, sunhoods, louvres and balustrades into a single coordinated system. One extrusion language, one finish, one installer — so every element of your home reads as a single design.',
    noscript: [
      'Rather than sourcing a gate from one supplier, a fence from another and screening from a third, the Home Package specifies every aluminium element of the property together.',
      'Because the whole system is designed, fabricated and installed in-house, profiles, finishes and hardware stay consistent across your front entry, boundary, façade, windows and balconies.',
    ],
    sections: [
      { h2: 'What is included', items: SERVICES.filter((s) => s.slug !== 'repairs-servicing').map((s) => s.name) },
      { h2: 'Who it suits', text: 'New homes, major renovations and full-facade makeovers where matching multiple aluminium elements at once saves time, cost and visual mismatch.' },
    ],
  },
  {
    path: '/projects',
    file: 'projects/index.html',
    nav: 'Projects',
    navOrder: 4,
    title: 'Aluminium Gate & Screening Projects | AUSALI Solutions',
    description:
      'Browse recent AUSALI Solutions work across Brisbane: facade battens, automated sliding gates, boundary screening, sunhoods, balustrades and full home packages.',
    image: '/hero-bg.jpg',
    imageAlt: 'AUSALI Solutions aluminium screening and gate projects across Brisbane',
    priority: '0.9',
    changefreq: 'weekly',
    h1: 'Recent Aluminium Gate, Screening & Balustrade Projects',
    lead:
      'A selection of recent AUSALI Solutions installations across South East Queensland — from striking facades to integrated home packages, engineered to elevate every property.',
    noscript: [
      'Our recent work spans facade screening, residential front entries, boundary screening, architectural sunhoods, luxury balustrades and complete home packages.',
    ],
    projects: [
      { title: 'Facade Screening', location: 'Coorparoo, QLD', category: 'Architectural Battens', desc: 'Precision vertical aluminium battens providing solar shading and distinctive modern curb appeal.' },
      { title: 'Residential Front Entry', location: 'Capalaba, QLD', category: 'Gates & Entries', desc: 'Automated sliding driveway gate seamlessly integrated with matching pedestrian gate and rendered pillars.' },
      { title: 'Boundary Screening', location: 'Wakerley, QLD', category: 'Privacy Screens', desc: 'High-durability architectural slat boundary screening ensuring complete privacy and structural rigidity.' },
      { title: 'Architectural Sunhoods', location: 'Camp Hill, QLD', category: 'Window Shading', desc: 'Engineered aluminium window shading hoods providing passive cooling while elevating the modern aesthetic.' },
      { title: 'Luxury Balustrade', location: 'Hawthorne, QLD', category: 'Balustrades', desc: 'Seamless structural glass and aluminium balustrading for a luxury waterfront property.' },
      { title: 'Complete Home Package', location: 'New Farm, QLD', category: 'Home Package', desc: 'A full suite of integrated aluminium elements designed with one consistent architectural language.' },
    ],
    sections: [],
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    nav: 'Contact',
    navOrder: 5,
    title: 'Contact & Free Quote | AUSALI Solutions, Brisbane',
    description:
      'Request a free quote for aluminium gates, screening or a full home package. Call 0434 230 821 or email info@ausalisolutions.com.au. Mon–Fri 7am–5pm.',
    image: '/hero-bg.jpg',
    imageAlt: 'Contact AUSALI Solutions for a free aluminium gate and screening quote in Brisbane',
    priority: '0.9',
    changefreq: 'monthly',
    h1: 'Contact AUSALI Solutions — Free Quote for Aluminium Gates & Screening',
    lead:
      'Tell us about your project and we will call you back within one business day. We answer every enquiry within one business day, then visit the site, measure properly and send a detailed fixed-price quote.',
    noscript: [
      'Call 0434 230 821, email info@ausalisolutions.com.au, or send a quote request and we will call you back within one business day.',
      'Once we speak we arrange a site visit, measure on site and quote in detail — fixed price, no vague allowances. Drawings, fabrication and installation are all handled by our own Brisbane team.',
      'Opening hours: Monday to Friday 7am–5pm, Saturday 8am–12pm.',
    ],
    sections: [
      { h2: 'Service areas', text: 'Brisbane, Coorparoo, Capalaba, Wakerley, Carindale, Mansfield, Wynnum, Cleveland, Logan, Springwood, Ipswich, Redlands Bay, Mount Gravatt, Sunnybank, Rochedale, Bulimba, West End, Camp Hill and Hawthorne.' },
      { h2: 'Our three next steps', items: ['We call you back within one business day to talk through your project, ideas and rough budget.', 'Site visit and detailed fixed-price quote — measured on site, no vague allowances.', 'Design, build and install — drawings, fabrication and installation by our own Brisbane team, no subcontractors.'] },
      { h2: 'Frequently asked questions', items: FAQS.map((f) => `Q: ${f.q} A: ${f.a}`) },
    ],
  },
];

export const NOINDEX_ROUTES = [
  { path: '/admin', file: 'admin/index.html', title: 'Quote Manager | AUSALI SOLUTIONS' },
];

export const ALL_INDEXABLE_PATHS = ROUTES.map((r) => r.path);

export function absoluteUrl(path) {
  if (!path) return `${SITE_URL}/`;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getRoute(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return ROUTES.find((r) => r.path === clean) || null;
}