import { useLocation, useNavigate } from 'react-router-dom';

export default function useSectionNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  return (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
}
