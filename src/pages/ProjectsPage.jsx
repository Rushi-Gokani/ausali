import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '../components/icons';
import projectFacade from '../assets/project-facade.jpg';
import projectEntry from '../assets/project-entry.jpg';
import projectBoundary from '../assets/project-boundary.jpg';
import placeholderPhoto from '../assets/placeholder-photo.jpg';
import './ProjectsPage.css';

const allProjects = [
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
  },
  {
    id: 'sunhood-design',
    title: 'ARCHITECTURAL SUNHOODS',
    location: 'Camp Hill, QLD',
    image: placeholderPhoto,
    category: 'Window Shading',
    desc: 'Engineered aluminium window shading hoods providing passive cooling while elevating the modern aesthetic.'
  },
  {
    id: 'luxury-balustrade',
    title: 'LUXURY BALUSTRADE',
    location: 'Hawthorne, QLD',
    image: placeholderPhoto,
    category: 'Balustrades',
    desc: 'Seamless structural glass and aluminium balustrading for a luxury waterfront property.'
  },
  {
    id: 'full-home-package',
    title: 'COMPLETE HOME PACKAGE',
    location: 'New Farm, QLD',
    image: placeholderPhoto,
    category: 'Home Package',
    desc: 'A full suite of integrated aluminium elements designed with one consistent architectural language.'
  }
];

function ProjectsPage({ onQuote }) {
  const sectionRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.title = 'Our Projects | AUSALI SOLUTIONS';
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="projects-hero-bg">
          <img src={projectFacade} alt="Ausali Projects" className={`projects-bg-img ${isLoaded ? 'loaded' : ''}`} />
          <div className="projects-hero-overlay"></div>
        </div>
        <div className="container projects-hero-content">
          <div className={`projects-hero-text ${isLoaded ? 'animate-enter' : ''}`}>
            <span className="section-label">OUR PORTFOLIO</span>
            <h1 className="hero-main-title">
              <span className="title-line">BUILT WITH</span>
              <span className="title-line text-blue">PRECISION.</span>
            </h1>
            <p className="projects-hero-desc">
              Explore our recent installations across South East Queensland. From striking façades to integrated home packages, we engineer solutions that elevate every property.
            </p>
          </div>
        </div>
      </section>

      <section className="projects-gallery" ref={sectionRef}>
        <div className="container">
          <div className="projects-grid">
            {allProjects.map((project, index) => (
              <article 
                key={project.id} 
                className="project-grid-card reveal" 
                style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                onClick={onQuote}
              >
                <div className="project-card-image-wrap">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="project-card-overlay">
                    <span className="view-project-text">VIEW DETAILS</span>
                  </div>
                </div>
                <div className="project-card-content">
                  <span className="project-card-category">{project.category}</span>
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-location">{project.location}</p>
                  <p className="project-card-desc">{project.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="projects-cta reveal">
            <h3 className="projects-cta-title">Ready to start your project?</h3>
            <button className="btn-hero-action" onClick={onQuote}>
              <span>REQUEST A QUOTE</span>
              <div className="btn-glow-line"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;
