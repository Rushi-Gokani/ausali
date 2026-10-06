import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero-bg.jpg';
import homePackageSketch from '../assets/home-package-sketch.jpg';
import projectFacade from '../assets/project-facade.jpg';
import projectEntry from '../assets/project-entry.jpg';
import projectBoundary from '../assets/project-boundary.jpg';
import { icons } from '../components/icons';

const recentProjects = [
  {
    id: 'facade-screening',
    title: 'FAÇADE SCREENING',
    location: 'Coorparoo, QLD',
    image: projectFacade,
    category: 'Architectural Battens',
    desc: 'Precision vertical aluminium battens providing solar shading and distinctive modern curb appeal.'
  },
  {
    id: 'residential-entry',
    title: 'RESIDENTIAL FRONT ENTRY',
    location: 'Capalaba, QLD',
    image: projectEntry,
    category: 'Gates & Entries',
    desc: 'Automated sliding driveway gate seamlessly integrated with matching pedestrian gate and rendered pillars.'
  },
  {
    id: 'boundary-screening',
    title: 'BOUNDARY SCREENING',
    location: 'Wakerley, QLD',
    image: projectBoundary,
    category: 'Privacy Screens',
    desc: 'High-durability architectural slat boundary screening ensuring complete privacy and structural rigidity.'
  }
];

const packageItems = [
  { id: 'sliding-gate', num: '01', name: 'SLIDING GATE', desc: 'Precision motorized & manual architectural aluminium sliding gates.', x: 44, y: 72 },
  { id: 'pedestrian-gate', num: '02', name: 'PEDESTRIAN GATE', desc: 'Matching keyed or smart lock pedestrian side access gates.', x: 30, y: 70 },
  { id: 'front-fence', num: '03', name: 'FRONT FENCE', desc: 'Continuous horizontal or vertical aluminium slat boundary fencing.', x: 18, y: 72 },
  { id: 'entry-arbour', num: '04', name: 'ENTRY ARBOUR', desc: 'Architectural entry portal structures connecting gate to facade.', x: 50, y: 52 },
  { id: 'facade-screening', num: '05', name: 'FAÇADE SCREENING', desc: 'Upper-level vertical decorative aluminium battens and screening.', x: 44, y: 28 },
  { id: 'window-sunhoods', num: '06', name: 'WINDOW SUNHOODS', desc: 'Engineered aluminium window shading hoods and angled louvres.', x: 63, y: 27 },
  { id: 'privacy-screening', num: '07', name: 'PRIVACY SCREENING', desc: 'Perimeter privacy screening providing airflow and total seclusion.', x: 74, y: 70 },
  { id: 'bin-enclosure', num: '08', name: 'BIN ENCLOSURE', desc: 'Concealed custom waste enclosure matching house slat profile.', x: 56, y: 66 },
  { id: 'ac-unit-screening', num: '09', name: 'AC UNIT SCREENING', desc: 'Acoustic & ventilation-safe architectural condenser covers.', x: 49, y: 65 },
  { id: 'balustrades', num: '10', name: 'BALUSTRADES', desc: 'Structural glass & aluminium balcony and void balustrading.', x: 68, y: 35 }
];

const processSteps = [
  {
    num: '01',
    title: 'CONSULT',
    desc: 'We listen, understand your vision and provide expert advice.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6C11.163 6 4 12.268 4 20c0 3.29 1.312 6.309 3.53 8.688L6 34l6.155-1.538C14.364 33.456 17.09 34 20 34c8.837 0 16-6.268 16-14S28.837 6 20 6z"/>
        <circle cx="14" cy="20" r="1.5" fill="currentColor"/>
        <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
        <circle cx="26" cy="20" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
  {
    num: '02',
    title: 'DESIGN',
    desc: 'Concepts and drawings tailored to your home and needs.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="6" width="26" height="28" rx="2"/>
        <line x1="12" y1="6" x2="12" y2="34"/>
        <line x1="12" y1="12" x2="9" y2="12"/>
        <line x1="12" y1="18" x2="9" y2="18"/>
        <line x1="12" y1="24" x2="9" y2="24"/>
        <line x1="12" y1="30" x2="9" y2="30"/>
        <path d="M20 25l7-7 3 3-7 7-3.5.5.5-3.5z"/>
        <line x1="25" y1="20" x2="28" y2="23"/>
      </svg>
    )
  },
  {
    num: '03',
    title: 'QUOTE',
    desc: 'Detailed, transparent pricing with no surprises.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 6h14l8 8v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
        <polyline points="24 6 24 14 32 14"/>
        <line x1="14" y1="18" x2="22" y2="18"/>
        <line x1="14" y1="23" x2="20" y2="23"/>
        <circle cx="27" cy="27" r="4.5" fill="#f7f6f1" stroke="currentColor" strokeWidth="1.6"/>
        <line x1="27" y1="25" x2="27" y2="29"/>
        <line x1="25" y1="27" x2="29" y2="27"/>
      </svg>
    )
  },
  {
    num: '04',
    title: 'FABRICATE',
    desc: 'Precision manufactured in Brisbane using quality materials.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 32V18l8 5V18l8 5V12h12v20H6z"/>
        <line x1="26" y1="12" x2="26" y2="7"/>
        <circle cx="26" cy="6" r="1.5" stroke="none" fill="currentColor"/>
        <circle cx="28" cy="4" r="1" stroke="none" fill="currentColor"/>
        <line x1="10" y1="28" x2="10.01" y2="28" strokeWidth="2.5"/>
        <line x1="15" y1="28" x2="15.01" y2="28" strokeWidth="2.5"/>
        <line x1="20" y1="28" x2="20.01" y2="28" strokeWidth="2.5"/>
        <line x1="26" y1="20" x2="30" y2="20"/>
        <line x1="26" y1="25" x2="30" y2="25"/>
      </svg>
    )
  },
  {
    num: '05',
    title: 'INSTALL',
    desc: 'Professional installation with a focus on detail and finish.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 28l10-10m4-4l-3-3a2.12 2.12 0 0 0-3 3l-1 1 5 5 1-1a2.12 2.12 0 0 0-3-3z"/>
        <path d="M26 28l-4-4 2-2 4 4-2 2z"/>
        <path d="M28 26l3.5-3.5a1.5 1.5 0 0 0-2.12-2.12l-1.42 1.41"/>
        <path d="M12 12l5 5-2 2-5-5a2.83 2.83 0 0 1 4-4l2 2"/>
      </svg>
    )
  }
];

function HomePage({ onQuote }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    document.title = 'AUSALI SOLUTIONS | Architectural Aluminium & Gate Solutions';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const progress = (scrollLeft / maxScroll) * 100;
        setSliderProgress(progress);
      }
      const cardWidth = clientWidth * 0.82;
      const index = Math.round(scrollLeft / (cardWidth > 0 ? cardWidth : 1));
      setActiveSlideIndex(Math.min(Math.max(index, 0), recentProjects.length - 1));
    }
  };

  const scrollToSlide = (index) => {
    if (sliderRef.current) {
      const targetCard = sliderRef.current.children[index];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  };

  return (
    <>
      <section id="home" className="hero-section">
        <div className="hero-bg-container">
          <img
            src={heroBg}
            alt="Modern luxury home with architectural aluminium slat gates and facade battens at dusk"
            className={`hero-background-image ${isLoaded ? 'loaded' : ''}`}
          />
          <div className="hero-overlay-gradient"></div>
          <div className="hero-ambient-glow"></div>
        </div>

        <div className="container hero-content-container">
          <div className={`hero-content-block ${isLoaded ? 'animate-enter' : ''}`}>
            <h1 className="hero-main-title">
              <span className="title-line title-line-1">DESIGNED</span>
              <span className="title-line title-line-2">AROUND</span>
              <span className="title-line title-line-3">YOUR SPACE.</span>
            </h1>

            <div className="hero-tagline">
              <span>DESIGN</span>
              <span className="tagline-dot">•</span>
              <span>FABRICATE</span>
              <span className="tagline-dot">•</span>
              <span>INSTALLED</span>
            </div>

            <p className="hero-location-text">
              Around Brisbane &<br />
              South East Queensland.
            </p>

            <div className="hero-cta-wrap">
              <button
                className="btn-hero-action"
                onClick={() => scrollToSection('projects')}
              >
                <span>VIEW OUR WORK</span>
                <div className="btn-glow-line"></div>
              </button>
            </div>
          </div>

          <div
            className="hero-scroll-indicator"
            onClick={() => scrollToSection('package')}
            role="button"
            tabIndex={0}
            aria-label="Scroll down to home package"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('package'); }}
          >
            <div className="scroll-arrow-icon">
              {icons.arrowDown}
            </div>
          </div>
        </div>
      </section>

      <section id="package" className="home-package-section">
        <div className="container package-container">
          <div className="package-layout-grid">
            <div className="package-left-col">
              <button
                type="button"
                className="package-heading-link"
                onClick={() => navigate('/home-package')}
                aria-label="Open the Home Package page"
              >
                <span className="package-sub-title">THE AUSALI HOME PACKAGE</span>
                <h2 className="package-main-heading">
                  One material.<br />
                  One architectural<br />
                  language.
                </h2>
              </button>
              <div className="heading-accent-bar"></div>
              <p className="package-intro-text">
                Seamless aluminium solutions designed to connect every element of your home.
              </p>
              <button
                className="btn-package-explore"
                onClick={() => navigate('/home-package')}
              >
                <span>EXPLORE THE HOME PACKAGE</span>
                <span className="btn-arrow-right">{icons.arrowRight}</span>
              </button>
            </div>

            <div className="package-center-col">
              <div
                className="sketch-display-card"
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <div className="sketch-image-wrapper">
                  <img
                    src={homePackageSketch}
                    alt="The AUSALI Home Package architectural system diagram with 10 integrated elements"
                    className="sketch-img"
                  />

                  {packageItems.map((item) => {
                    const isActive = activeHotspot === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`hotspot-pin hotspot-${item.id} ${isActive ? 'active-pin' : ''}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        onMouseEnter={() => setActiveHotspot(item.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(activeHotspot === item.id ? null : item.id);
                        }}
                        aria-label={`View ${item.name}`}
                      >
                        <span className="pin-pulse"></span>
                        <span className="pin-circle">{item.num}</span>
                        {isActive && (
                          <div className="pin-tooltip desktop-tooltip">
                            <span className="tooltip-num">{item.num}</span>
                            <span className="tooltip-name">{item.name}</span>
                            <span className="tooltip-desc">{item.desc}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {activeHotspot && (
                  <div className="active-element-banner">
                    {(() => {
                      const current = packageItems.find(p => p.id === activeHotspot) || packageItems[0];
                      return (
                        <div className="active-banner-content">
                          <div className="active-banner-header">
                            <span className="active-banner-num">{current.num}</span>
                            <span className="active-banner-title">{current.name}</span>
                          </div>
                          <p className="active-banner-desc">{current.desc}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div className="package-right-col">
              <div
                className="package-elements-list"
                role="list"
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {packageItems.map((item) => {
                  const isRowActive = activeHotspot === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`package-element-row ${isRowActive ? 'highlighted-row' : ''}`}
                      onMouseEnter={() => setActiveHotspot(item.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === item.id ? null : item.id);
                      }}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveHotspot(item.id); }}
                    >
                      <span className="element-num">{item.num}</span>
                      <span className="element-label">{item.name}</span>
                      {isRowActive && <span className="element-active-dot"></span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects-section">
        <div className="container">
          <div className="projects-header">
            <div className="projects-title-block">
              <span className="section-label">RECENT PROJECTS</span>
              <h2 className="section-heading">Built with precision.</h2>
            </div>
            <button className="btn-secondary btn-view-all" onClick={onQuote}>
              <span>VIEW ALL PROJECTS</span>
            </button>
          </div>

          <div
            className="projects-slider-wrapper"
            ref={sliderRef}
            onScroll={handleSliderScroll}
          >
            {recentProjects.map((project, idx) => (
              <article
                key={project.id}
                className={`project-card ${activeSlideIndex === idx ? 'slide-active' : ''}`}
                onClick={onQuote}
              >
                <div className="project-img-wrap">
                  <img
                    src={project.image}
                    alt={`${project.title} - ${project.location}`}
                    className="project-img"
                    loading="lazy"
                  />
                  <div className="project-shimmer-effect"></div>
                </div>
                <div className="project-overlay">
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-location">{project.location}</p>
                  </div>
                  <div className="project-arrow" aria-label={`View details for ${project.title}`}>
                    {icons.arrowRight}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="projects-slider-controls">
            <div className="slider-counter">
              <span className="counter-current">0{activeSlideIndex + 1}</span>
              <span className="counter-divider">/</span>
              <span className="counter-total">0{recentProjects.length}</span>
            </div>

            <div className="slider-progress-track">
              <div
                className="slider-progress-bar"
                style={{ width: `${Math.max(sliderProgress, ((activeSlideIndex + 1) / recentProjects.length) * 100)}%` }}
              ></div>
            </div>

            <div className="slider-nav-buttons">
              <button
                type="button"
                className="slider-nav-btn"
                onClick={() => scrollToSlide(Math.max(0, activeSlideIndex - 1))}
                disabled={activeSlideIndex === 0}
                aria-label="Previous project slide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                className="slider-nav-btn"
                onClick={() => scrollToSlide(Math.min(recentProjects.length - 1, activeSlideIndex + 1))}
                disabled={activeSlideIndex === recentProjects.length - 1}
                aria-label="Next project slide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="process-section">
        <div className="container process-container">
          <div className="process-header">
            <span className="section-label">OUR PROCESS</span>
            <h2 className="section-heading">Simple. Transparent. Professional.</h2>
          </div>

          <div className="process-timeline-wrapper">
            <div className="process-steps-track">
              {processSteps.map((step, index) => (
                <div key={step.num} className="process-step-item">
                  {index > 0 && (
                    <div className="process-connector-line">
                      <span className="connector-dot"></span>
                    </div>
                  )}

                  <div className="process-step-card">
                    <div className="process-icon-box">
                      {step.icon}
                    </div>
                    <div className="process-step-card-content">
                      <div className="process-num-badge">{step.num}</div>
                      <h3 className="process-step-title">{step.title}</h3>
                      <p className="process-step-desc">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-about-cta">
            <span className="section-label">WANT TO KNOW US BETTER?</span>
            <h3 className="home-about-cta-heading">The people behind the metal.</h3>
            <button
              className="btn-package-explore"
              onClick={() => navigate('/about')}
            >
              <span>ABOUT AUSALI</span>
              <span className="btn-arrow-right">{icons.arrowRight}</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
