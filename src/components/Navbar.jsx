import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from './icons';
import Logo from './Logo';

function Navbar({ onQuote }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickedNav, setClickedNav] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onAboutPage = location.pathname === '/about';
  const onContactPage = location.pathname === '/contact';
  const onHomePackagePage = location.pathname === '/home-package';
  const onProjectsPage = location.pathname === '/projects';
  const routeActive = onAboutPage ? 'about' : onContactPage ? 'contact' : onProjectsPage ? 'projects' : null;
  const hashNav = location.hash ? location.hash.replace('#', '') : null;
  const activeNav = onHomePackagePage ? 'package' : routeActive || hashNav || clickedNav || 'home';

  const goToProjects = () => {
    setClickedNav(null);
    setMobileMenuOpen(false);
    if (location.pathname !== '/projects') {
      navigate('/projects');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let homePackageComplete = false;

    const handleHomePackageProgress = (event) => {
      homePackageComplete = Boolean(event.detail?.complete);
      handleScroll();
    };

    const handleScroll = () => {
      if (location.pathname === '/home-package') {
        setIsScrolled(homePackageComplete);
        return;
      }

      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('ausali:home-package-progress', handleHomePackageProgress);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('ausali:home-package-progress', handleHomePackageProgress);
    };
  }, [location.pathname]);

  const goToSection = (id) => {
    setClickedNav(id);
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      if (id === 'package') {
        navigate('/home-package');
      } else {
        navigate(`/#${id}`);
      }
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToAbout = () => {
    setClickedNav(null);
    setMobileMenuOpen(false);
    if (location.pathname !== '/about') {
      navigate('/about');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToContact = () => {
    setClickedNav(null);
    setMobileMenuOpen(false);
    if (location.pathname !== '/contact') {
      navigate('/contact');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sectionLink = (id, label) => (
    <a
      href={`/#${id}`}
      className={`nav-link ${!routeActive && activeNav === id ? 'active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        goToSection(id);
      }}
    >
      {label}
      {!routeActive && activeNav === id && <span className="active-line" />}
    </a>
  );

  const pageLink = (path, label, isActive, onClick) => (
    <a
      href={path}
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {label}
      {isActive && <span className="active-line" />}
    </a>
  );

  const mobileSectionLink = (id, label, num) => (
    <a
      href={`/#${id}`}
      className={`mobile-link ${!routeActive && activeNav === id ? 'active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        goToSection(id);
      }}
    >
      <span className="mobile-link-num">{num}</span>
      <span className="mobile-link-text">{label}</span>
    </a>
  );

  const mobilePageLink = (path, label, num, isActive, onClick) => (
    <a
      href={path}
      className={`mobile-link ${isActive ? 'active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span className="mobile-link-num">{num}</span>
      <span className="mobile-link-text">{label}</span>
    </a>
  );

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Logo />

        <nav className="nav-links" aria-label="Main Navigation">
          {sectionLink('home', 'HOME', '01')}
          {pageLink('/home-package', 'HOME PACKAGE', onHomePackagePage, () => {
            setMobileMenuOpen(false);
            if (location.pathname !== '/home-package') {
              navigate('/home-package');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          })}

          {pageLink('/projects', 'PROJECTS', onProjectsPage, goToProjects)}

          {pageLink('/about', 'ABOUT', onAboutPage, goToAbout)}
          {pageLink('/contact', 'CONTACT', onContactPage, goToContact)}
        </nav>

        <div className="nav-actions">
          <button
            className="btn-quote btn-quote-desktop"
            onClick={onQuote}
            aria-label="Request a free quote"
          >
            <span>GET A QUOTE</span>
          </button>

          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </div>

      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <Logo onNavigate={() => setMobileMenuOpen(false)} />
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            {icons.close}
          </button>
        </div>

        <div className="mobile-nav-inner">
          <nav className="mobile-links-list">
            {mobileSectionLink('home', 'HOME', '01')}
            {mobilePageLink('/home-package', 'HOME PACKAGE', '02', onHomePackagePage, () => {
              setMobileMenuOpen(false);
              if (location.pathname !== '/home-package') {
                navigate('/home-package');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            })}

            {mobilePageLink('/projects', 'PROJECTS', '03', onProjectsPage, goToProjects)}

            {mobilePageLink('/about', 'ABOUT', '04', onAboutPage, goToAbout)}
            {mobilePageLink('/contact', 'CONTACT', '05', onContactPage, goToContact)}
          </nav>

          <div className="mobile-drawer-bottom">
            <button
              className="btn-hero-action mobile-quote-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onQuote();
              }}
            >
              <span>GET A FREE QUOTE</span>
              <span className="btn-icon">{icons.arrowRight}</span>
            </button>

            <div className="mobile-quick-contact">
              <a href="tel:0434230821" className="mobile-contact-pill">
                <span>📞 0434230821</span>
              </a>
              <a href="mailto:info@ausalisolutions.com.au" className="mobile-contact-pill">
                <span>✉️ info@ausalisolutions.com.au</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
