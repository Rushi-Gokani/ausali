import projectBoundary from '../assets/project-boundary.jpg';
import minimalistBattenScreen from '../assets/images/minimalist_batten_screen.jpg';
import projectEntry from '../assets/project-entry.jpg';
import './HomePackageIncludes.css';

const packageCards = [
  {
    title: 'ENTRY & BOUNDARY',
    image: projectBoundary,
    alt: 'Architectural aluminium entry gate and boundary fencing',
    items: ['Gates', 'Front fencing', 'Entry features', 'Boundary solutions'],
  },
  {
    title: 'ARCHITECTURAL SCREENING',
    image: minimalistBattenScreen,
    alt: 'Architectural aluminium louvre and screening detail',
    items: ['Facade screening', 'Privacy screening', 'Window shading', 'Vertical battens'],
  },
  {
    title: 'FINISHING TOUCHES',
    image: projectEntry,
    alt: 'Coordinated aluminium pedestrian gate and entry feature',
    items: ['Enclosures', 'House numbers', 'Mailboxes'],
  },
];

const packageBenefits = [
  {
    title: 'HOMEOWNERS & BUILDERS',
    description: 'Designed for residential homes and multi-residential projects.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M14 38 40 16l26 22" />
        <path d="M22 35v31h36V35" />
        <path d="M34 66V48h12v18" />
      </svg>
    ),
  },
  {
    title: 'SUPPLY ONLY OR SUPPLY & INSTALL',
    description: 'Choose the option that works for your project.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="m40 9 17 10v20L40 49 23 39V19L40 9Z" />
        <path d="m23 41 17 10v20L23 61 6 51V31l17 10Z" />
        <path d="m57 41 17-10v20L57 61 40 71V51l17-10Z" />
        <path d="M23 19 40 29l17-10" />
      </svg>
    ),
  },
  {
    title: 'SINGLE ELEMENTS OR COMPLETE PACKAGES',
    description: 'Select what you need - from one element to a full exterior solution.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M10 22h60" />
        <path d="M10 40h60" />
        <path d="M10 58h60" />
        <circle cx="52" cy="22" r="5" />
        <circle cx="28" cy="40" r="5" />
        <circle cx="43" cy="58" r="5" />
      </svg>
    ),
  },
];

function HomePackageIncludes() {
  return (
    <section className="home-package-includes">
      <div className="package-intro-band">
        <div className="container package-intro-container">
          <div className="package-intro-copy">
            <span className="package-kicker">WHAT IS THE AUSALI HOME PACKAGE?</span>
            <span className="package-accent"></span>
            <h2>Your exterior aluminium elements, designed as one.</h2>
            <p>
              The AUSALI Home Package brings your exterior aluminium elements together under
              one coordinated design. From gates and front fencing through to facade screening,
              privacy solutions, balustrades and architectural finishing details, each element is
              designed to complement your home and work together seamlessly.
            </p>
          </div>

          <div className="package-card-slider" aria-label="Home package categories">
            {packageCards.map((card) => (
              <article className="package-feature-card" key={card.title}>
                <img src={card.image} alt={card.alt} loading="lazy" />
                <div className="package-feature-copy">
                  <h3>{card.title}</h3>
                  <p>{card.items.join('  •  ')}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="package-flex-band">
        <div className="container package-flex-container">
          <div className="package-flex-copy">
            <span className="package-kicker">ONE PACKAGE. BUILT AROUND YOUR PROJECT.</span>
            <span className="package-accent"></span>
            <h2>Flexible. Coordinated. Seamless.</h2>
            <p>
              Your package can include one element or an entire exterior suite. Choose what you
              need, select your preferred styles and finishes, upload inspiration and tell us about
              your project. We'll use that information to develop your scope and quote.
            </p>
          </div>

          <div className="package-benefits-grid">
            {packageBenefits.map((benefit) => (
              <article className="package-benefit" key={benefit.title}>
                <div className="package-benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePackageIncludes;
