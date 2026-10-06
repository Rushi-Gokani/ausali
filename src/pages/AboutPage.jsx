import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '../components/icons';
import projectFacade from '../assets/project-facade.jpg';
import projectEntry from '../assets/project-entry.jpg';
import './AboutPage.css';

const aboutStats = [
  { id: 'experience', value: '15+', label: 'Years combined trade experience' },
  { id: 'installed', value: '400+', label: 'Elements designed & installed' },
  { id: 'package', value: '10', label: 'Integrated home package elements' },
  { id: 'shortcuts', value: '0', label: 'Shortcuts. Ever.' }
];

const aboutValues = [
  {
    num: '01',
    title: 'PRECISION',
    desc: 'Millimetre tolerances, routed connections, hidden fixings. The details you never see are the ones we obsess over.'
  },
  {
    num: '02',
    title: 'TRANSPARENCY',
    desc: 'One clear quote, one point of contact, one timeline. Nothing changes between contract and handover.'
  },
  {
    num: '03',
    title: 'DURABILITY',
    desc: 'Marine-grade aluminium and powder coat built for Queensland sun, storms and salt air. Warrantied, not just promised.'
  },
  {
    num: '04',
    title: 'LOCAL',
    desc: 'Brisbane made, Brisbane installed. We measure, fabricate and fit every job ourselves across South East Queensland.'
  }
];

const whyRows = [
  {
    num: '01',
    title: 'RUST-PROOF BY NATURE',
    desc: 'Aluminium does not corrode, warp or rot — the right material for Queensland humidity and coastal salt air.'
  },
  {
    num: '02',
    title: 'MARINE-GRADE FINISH',
    desc: 'Powder coating tested for coastal exposure, in any Dulux colour, matched to your façade palette.'
  },
  {
    num: '03',
    title: 'ENGINEERED JOINTS',
    desc: 'Routed and welded connections instead of brackets and visible screws — stronger structures, cleaner lines.'
  },
  {
    num: '04',
    title: 'FULLY RECYCLABLE',
    desc: 'One hundred percent recyclable, endlessly reprocessed. Long-life material with a lighter footprint.'
  }
];

const storyPoints = [
  'Designed & fabricated under one roof',
  'Marine-grade powder coat finishes',
  'Installed by our own team — no subcontractors'
];

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function AboutPage({ onQuote }) {
  const sectionRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'About Us | AUSALI SOLUTIONS';
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
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page" ref={sectionRef}>
      <section className="about-hero">
        <div className="about-hero-bg-container">
          <img
            src={projectFacade}
            alt="Architectural aluminium facade battens on a modern Queensland home"
            className={`about-hero-bg-image ${isLoaded ? 'loaded' : ''}`}
          />
          <div className="about-hero-overlay"></div>
          <div className="about-hero-bottom-fade"></div>
        </div>

        <div className="container about-hero-container">
          <div className={`about-hero-content ${isLoaded ? 'animate-enter' : ''}`}>
            <div className="about-breadcrumb">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                HOME
              </a>
              <span className="about-breadcrumb-sep">/</span>
              <span className="about-breadcrumb-current">ABOUT US</span>
            </div>

            <h1 className="about-hero-title">
              <span className="about-title-line about-title-line-1">WE BUILD THE PARTS</span>
              <span className="about-title-line about-title-line-2">OF A HOME PEOPLE</span>
              <span className="about-title-line about-title-line-3 about-title-accent">NOTICE FIRST.</span>
            </h1>

            <p className="about-hero-lede">
              AUSALI is a Brisbane specialist in architectural aluminium gates, facade battens,
              screening and balustrades, designed as one system, fabricated in-house and installed
              by the same hands that drew it.
            </p>

            <div className="about-hero-actions">
              <button className="btn-hero-action" onClick={onQuote}>
                <span>GET A QUOTE</span>
                <span className="btn-icon">{icons.arrowRight}</span>
              </button>
              <button
                className="btn-hero-action about-btn-ghost"
                onClick={() => navigate('/#projects')}
              >
                <span>VIEW OUR WORK</span>
                <span className="btn-icon">{icons.arrowRight}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="about-stats-strip">
        <div className="container about-stats-grid">
          {aboutStats.map((stat) => (
            <div key={stat.id} className="about-stat-cell reveal">
              <span className="about-stat-value">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="about-story-band">
        <div className="container about-story-grid">
          <div className="about-story-media">
            <div className="about-story-main-img-wrap reveal">
              <img
                src={projectFacade}
                alt="Architectural aluminium façade battens installed on a modern Queensland home"
                className="about-story-main-img"
                loading="lazy"
              />
              <div className="about-story-caption">
                <span className="about-story-caption-title">FAÇADE SCREENING</span>
                <span className="about-story-caption-loc">COORPAROO, QLD</span>
              </div>
            </div>
            <div className="about-story-inset-img-wrap reveal">
              <img
                src={projectEntry}
                alt="Automated sliding gate integrated with matching pedestrian entry"
                className="about-story-inset-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-story-copy">
            <span className="about-label-dark reveal">OUR STORY</span>
            <h2 className="about-story-heading reveal">One trade,<br />mastered.</h2>
            <div className="heading-accent-bar about-accent-bar reveal"></div>
            <p className="about-story-text reveal">
              AUSALI began with a simple frustration: beautiful homes finished with gates and
              screens that looked bolted on, not designed in. We set out to close that gap.
            </p>
            <p className="about-story-text reveal">
              Every element is drawn, routed, welded and powder-coated to a single architectural
              language, so your gate, fence and façade read as one deliberate gesture — made in
              Brisbane, built for Queensland weather.
            </p>
            <ul className="about-story-points reveal">
              {storyPoints.map((point) => (
                <li key={point} className="about-story-point">
                  <span className="about-point-check">{checkIcon}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="about-story-signoff reveal">
              <span>DESIGN</span>
              <span className="about-signoff-dot">•</span>
              <span>FABRICATE</span>
              <span className="about-signoff-dot">•</span>
              <span>INSTALL</span>
              <span className="about-signoff-dot">•</span>
              <span>SINCE DAY ONE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-band">
        <div className="container">
          <div className="about-values-header">
            <div className="about-values-title-block">
              <span className="about-label reveal">WHAT WE STAND FOR</span>
              <h2 className="about-values-heading reveal">How we work.</h2>
            </div>
            <p className="about-values-intro reveal">
              Four principles behind every gate, screen and balustrade that leaves our workshop.
            </p>
          </div>

          <div className="about-values-grid">
            {aboutValues.map((value) => (
              <article key={value.num} className="about-value-card reveal">
                <span className="about-value-num">{value.num}</span>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-desc">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-why-band">
        <div className="container about-why-grid">
          <div className="about-why-left">
            <span className="about-label-dark reveal">THE MATERIAL</span>
            <h2 className="about-why-heading reveal">Why aluminium.</h2>
            <div className="heading-accent-bar about-accent-bar reveal"></div>
            <p className="about-why-intro reveal">
              Queensland homes need a material that shrugs off sun, storms and salt air.
              Here is why aluminium is the only metal we work with.
            </p>
          </div>

          <div className="about-why-list">
            {whyRows.map((row) => (
              <div key={row.num} className="about-why-row reveal">
                <span className="about-why-num">{row.num}</span>
                <div className="about-why-copy">
                  <h3 className="about-why-title">{row.title}</h3>
                  <p className="about-why-desc">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-band">
        <div className="container about-cta-container">
          <div className="about-cta-text reveal">
            <h2>Let's build the part<br />everyone notices first.</h2>
            <p>Tell us about your project — we design, fabricate and install across Brisbane & South East Queensland.</p>
          </div>
          <div className="about-cta-actions reveal">
            <button className="btn-hero-action" onClick={onQuote}>
              <span>GET A QUOTE</span>
              <span className="btn-icon">{icons.arrowRight}</span>
            </button>
            <button
              className="btn-hero-action about-btn-ghost"
              onClick={() => navigate('/#projects')}
            >
              <span>VIEW OUR WORK</span>
              <span className="btn-icon">{icons.arrowRight}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
