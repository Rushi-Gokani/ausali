import { useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

function Logo({ className = '', onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onNavigate) onNavigate();
  };

  return (
    <a href="/" className={`nav-brand ${className}`} aria-label="AUSALI SOLUTIONS Home" onClick={handleHome}>
      <img src={logoImg} alt="AUSALI SOLUTIONS" className="brand-logo-img" />
    </a>
  );
}

export default Logo;
