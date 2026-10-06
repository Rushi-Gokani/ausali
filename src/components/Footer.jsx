import { useNavigate } from 'react-router-dom';
import { icons } from './icons';
import Logo from './Logo';
import useSectionNavigate from '../hooks/useSectionNavigate';

function Footer({ onQuote }) {
  const navigate = useNavigate();
  const goToSection = useSectionNavigate();
  const socialLinks = {
    instagram: 'https://www.instagram.com/ausali_solutions?stkn=M211eThlNHVwZ2Ft',
    facebook: 'https://www.facebook.com/share/19xiCPZAGv/',
  };

  const section = (id, label) => (
    <li>
      <a
        href={`/#${id}`}
        onClick={(e) => {
          e.preventDefault();
          goToSection(id);
        }}
      >
        {label}
      </a>
    </li>
  );

  return (
    <footer id="contact" className="footer-wrapper">
      <div className="footer-top-banner">
        <div className="container footer-banner-container">
          <div className="footer-cta-text">
            <h2>Let's build something<br />exceptional.</h2>
            <p>Have a project in mind? Contact our Brisbane team for tailored aluminium design & installation.</p>
            <button className="btn-hero-action" onClick={onQuote}>
              <span>GET IN TOUCH</span>
              <span className="btn-icon">{icons.arrowRight}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <Logo />
            <p className="footer-about-text">
              Custom architectural aluminium gates, facades, and bespoke screening designed and made for modern Queensland homes.
            </p>
          </div>

          <div className="footer-col">
            <h5>COMPANY</h5>
            <ul>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                >
                  About AUSALI
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                >
                  Contact Us
                </a>
              </li>
              {section('process', 'Our 5-Step Process')}
              {section('projects', 'Recent Projects')}
              {section('package', 'The Home Package')}
            </ul>
          </div>

          <div className="footer-col">
            <h5>CONTACT</h5>
            <ul className="contact-details">
              <li><span>📞 0434230821</span></li>
              <li><span>✉️ info@ausalisolutions.com.au</span></li>
              <li><span>📍 Capalaba QLD</span></li>
            </ul>
            <div className="social-links-row">
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">{icons.instagram}</a>
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">{icons.facebook}</a>
            </div>
          </div>
        </div>

        <div className="container footer-copyright">
          <p>© {new Date().getFullYear()} AUSALI SOLUTIONS. All Rights Reserved. Architectural Aluminium Specialists.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
