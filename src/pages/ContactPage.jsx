import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '../components/icons';
import projectBoundary from '../assets/project-boundary.jpg';
import './ContactPage.css';

const contactApiUrl = import.meta.env.VITE_CONTACT_API_URL
  || (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost/ausali-api/contact.php'
    : '/api/contact.php');

function createSubmissionUid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `contact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const suburbs = [
  'COORPAROO', 'CAPALABA', 'WAKERLEY', 'CARINDALE', 'MANSFIELD', 'WYNNUM',
  'CLEVELAND', 'LOGAN', 'SPRINGWOOD', 'IPSWICH', 'REDLANDS BAY', 'MOUNT GRAVATT',
  'SUNNYBANK', 'ROCHEDALE', 'BULIMBA', 'WEST END'
];

const quickContacts = [
  { id: 'phone', icon: 'phone', label: 'CALL US', value: '0434230821', href: 'tel:0434230821' },
  { id: 'email', icon: 'mail', label: 'EMAIL US', value: 'info@ausalisolutions.com.au', href: 'mailto:info@ausalisolutions.com.au' },
  { id: 'pin', icon: 'pin', label: 'ADDRESS', value: 'Capalaba QLD', href: null },
  { id: 'clock', icon: 'clock', label: 'HOURS', value: 'Mon–Fri 7AM–5PM • Sat 8AM–12PM', href: null }
];

const socialLinks = {
  instagram: 'https://www.instagram.com/ausali_solutions?stkn=M211eThlNHVwZ2Ft',
  facebook: 'https://www.facebook.com/share/19xiCPZAGv/',
};

const nextSteps = [
  {
    num: '01',
    title: 'WE CALL YOU BACK',
    desc: 'Within one business day — to talk through your project, ideas and rough budget.'
  },
  {
    num: '02',
    title: 'SITE VISIT & DETAILED QUOTE',
    desc: 'We measure on site and quote in detail. Fixed price, no vague allowances.'
  },
  {
    num: '03',
    title: 'DESIGN, BUILD & INSTALL',
    desc: 'Drawings, fabrication and installation by our own Brisbane team — no subcontractors.'
  }
];

const serviceOptions = [
  'Full Home Package',
  'Sliding Gate & Entry',
  'Façade Screening & Battens',
  'Boundary & Privacy Screening',
  'Sunhoods & Louvres',
  'Balustrades',
  'Repair / Service',
  'Other / Not Sure Yet'
];

const budgetOptions = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $30,000',
  '$30,000+',
  'Not sure yet'
];

const faqs = [
  {
    q: 'What areas do you service?',
    a: 'We design, fabricate and install across Brisbane, the Bayside, Logan, Ipswich, Redlands and greater South East Queensland. If you are nearby and unsure, just ask — if we cannot help, we will say so straight up.'
  },
  {
    q: 'How long does a typical project take?',
    a: 'A single sliding gate usually runs 2–4 weeks from sign-off. Full home packages — fence, gates, screening and façade elements — typically 4–8 weeks depending on complexity and council requirements.'
  },
  {
    q: 'Do you handle council approvals?',
    a: 'Yes. Where approvals are needed we prepare the drawings, lodge the application and manage it through to sign-off, so you do not have to.'
  },
  {
    q: "Can you match my home's existing colours?",
    a: 'Almost certainly. We powder coat in the full Dulux range, so your gate, fence or screening can match windows, roof, garage door or render exactly.'
  },
  {
    q: 'Do you only build new, or do you repair too?',
    a: 'We service and repair existing aluminium gates and screens — motors, tracks, powder coat touch-ups and realignment. If it is beyond saving, we will tell you honestly and quote the replacement.'
  }
];

function ContactPage() {
  const submissionUidRef = useRef(createSubmissionUid());
  const submitInFlightRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formState, setFormState] = useState('idle');
  const [formError, setFormError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Contact Us | AUSALI SOLUTIONS';
  }, []);

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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitInFlightRef.current) {
      return;
    }

    submitInFlightRef.current = true;
    setFormState('sending');
    setFormError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      submissionUid: submissionUidRef.current,
      ...Object.fromEntries(formData.entries()),
    };

    try {
      const response = await fetch(contactApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({
        ok: false,
        message: 'The server returned an invalid response.',
      }));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'The message could not be saved.');
      }

      form.reset();
      setFormState('sent');
    } catch (error) {
      setFormState('idle');
      setFormError(error.message || 'The message could not be saved.');
    } finally {
      submitInFlightRef.current = false;
    }
  };

  const resetForm = () => {
    submissionUidRef.current = createSubmissionUid();
    setFormError('');
    setFormState('idle');
  };

  return (
    <div className="contact-page" ref={sectionRef}>
      <section className="contact-hero">
        <div className="contact-hero-bg-container">
          <img
            src={projectBoundary}
            alt="Architectural aluminium boundary screening on a Queensland home"
            className={`contact-hero-bg-image ${isLoaded ? 'loaded' : ''}`}
          />
          <div className="contact-hero-overlay"></div>
          <div className="contact-hero-bottom-fade"></div>
        </div>

        <div className="container contact-hero-grid">
          <div className={`contact-hero-content ${isLoaded ? 'animate-enter' : ''}`}>
            <div className="contact-breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                HOME
              </a>
              <span className="contact-breadcrumb-sep">/</span>
              <span className="contact-breadcrumb-current">CONTACT</span>
            </div>

            <h1 className="contact-hero-title">
              <span className="contact-title-line contact-title-line-1">GOOD PROJECTS</span>
              <span className="contact-title-line contact-title-line-2">START WITH A</span>
              <span className="contact-title-line contact-title-line-3 contact-title-accent">CONVERSATION.</span>
            </h1>

            <p className="contact-hero-lede">
              Tell us what you're building. We reply within one business day with straight
              answers, real pricing guidance and a clear next step.
            </p>

            <div className="contact-hero-response">
              <span className="contact-live-dot"></span>
              <span>Currently taking new projects for this season</span>
            </div>
          </div>

          <div className={`contact-glass-card ${isLoaded ? 'card-enter' : ''}`}>
            <span className="contact-glass-label">DIRECT LINES</span>
            <div className="contact-glass-rows">
              {quickContacts.map((item) => {
                const rowContent = (
                  <>
                    <span className="contact-glass-icon">{icons[item.icon]}</span>
                    <span className="contact-glass-text">
                      <span className="contact-glass-text-label">{item.label}</span>
                      <span className="contact-glass-text-value">{item.value}</span>
                    </span>
                  </>
                );
                return item.href ? (
                  <a key={item.id} href={item.href} className="contact-glass-row">
                    {rowContent}
                  </a>
                ) : (
                  <div key={item.id} className="contact-glass-row">
                    {rowContent}
                  </div>
                );
              })}
            </div>
            <div className="contact-glass-footer">
              <span className="contact-live-dot"></span>
              <span>We answer every enquiry within one business day.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-marquee" aria-hidden="true">
        <div className="contact-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="contact-marquee-copy">
              {suburbs.map((suburb) => (
                <span key={`${copy}-${suburb}`} className="contact-marquee-item">
                  {suburb}
                  <span className="contact-marquee-diamond"></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="contact-form-band">
        <div className="container contact-form-grid">
          <div className="contact-form-left">
            <span className="contact-label-dark reveal">GET IN TOUCH</span>
            <h2 className="contact-form-heading reveal">Tell us about<br />your project.</h2>
            <div className="heading-accent-bar contact-accent-bar reveal"></div>
            <p className="contact-form-intro reveal">
              The more detail you give us, the sharper our first answer will be.
              No obligation, no pressure — just useful advice from people who build these every day.
            </p>

            <div className="contact-next-steps">
              <span className="contact-next-steps-label reveal">WHAT HAPPENS NEXT</span>
              {nextSteps.map((step) => (
                <div key={step.num} className="contact-next-step reveal">
                  <span className="contact-next-step-num">{step.num}</span>
                  <div className="contact-next-step-copy">
                    <h3 className="contact-next-step-title">{step.title}</h3>
                    <p className="contact-next-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-card-wrap reveal">
            {formState !== 'sent' ? (
              <form className="contact-form-card" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input id="contact-name" name="name" type="text" required placeholder="John Smith" />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="contact-email">Email *</label>
                    <input id="contact-email" name="email" type="email" required placeholder="john@example.com" />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-phone">Phone *</label>
                    <input id="contact-phone" name="phone" type="tel" required placeholder="0400 000 000" />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="contact-suburb">Suburb</label>
                    <input id="contact-suburb" name="suburb" type="text" placeholder="e.g. Coorparoo" />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-service">Service Required *</label>
                    <select id="contact-service" name="service" required defaultValue="">
                      <option value="" disabled>Select a service</option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="contact-budget">Estimated Budget</label>
                    <select id="contact-budget" name="budget" defaultValue="Not sure yet">
                      {budgetOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-message">Project Details *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us about your home, the elements you're after, approximate dimensions, timelines — anything that helps."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-hero-action contact-submit-btn"
                  disabled={formState === 'sending'}
                >
                  <span>{formState === 'sending' ? 'SENDING…' : 'SEND MESSAGE'}</span>
                  <span className="btn-icon">{icons.arrowRight}</span>
                </button>

                {formError ? <p className="contact-form-error">{formError}</p> : null}

                <p className="contact-form-privacy">
                  Your details stay with us. No spam, no lists — just a reply from a real person.
                </p>
              </form>
            ) : (
              <div className="contact-form-card contact-success-card">
                <div className="contact-success-icon">
                  <svg className="contact-check" viewBox="0 0 52 52">
                    <circle className="contact-check-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="contact-check-mark" fill="none" d="M14 27l8 8 16-16" />
                  </svg>
                </div>
                <h3 className="contact-success-title">Message received.</h3>
                <p className="contact-success-text">
                  Thanks for reaching out — we'll be in touch within one business day.
                  If it's urgent, call us directly on <a href="tel:0434230821">0434230821</a>.
                </p>
                <button type="button" className="btn-hero-action contact-success-reset" onClick={resetForm}>
                  <span>SEND ANOTHER MESSAGE</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="contact-faq-band">
        <div className="container contact-faq-grid">
          <div className="contact-faq-main">
            <span className="contact-label reveal">COMMON QUESTIONS</span>
            <h2 className="contact-faq-heading reveal">Answers, upfront.</h2>

            <div className="contact-faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q} className={`contact-faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="contact-faq-question"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="contact-faq-num">0{index + 1}</span>
                      <span className="contact-faq-q-text">{faq.q}</span>
                      <span className={`contact-faq-chevron ${isOpen ? 'rotated' : ''}`}>{icons.chevronDown}</span>
                    </button>
                    <div className="contact-faq-answer">
                      <div className="contact-faq-answer-inner">
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="contact-aside-card reveal">
            <span className="contact-aside-label">PREFER TO TALK?</span>
            <a href="tel:0434230821" className="contact-aside-phone">
              {icons.phone}
              <span>0434230821</span>
            </a>
            <a href="mailto:info@ausalisolutions.com.au" className="contact-aside-email">
              {icons.mail}
              <span>info@ausalisolutions.com.au</span>
            </a>
            <div className="contact-aside-address">
              {icons.pin}
              <span>Capalaba QLD</span>
            </div>
            <p className="contact-aside-note">
              Real people, Brisbane based. Ask us anything — advice is free, and we would rather
              help you get it right than sell you the wrong thing.
            </p>
            <div className="contact-aside-divider"></div>
            <div className="contact-aside-social">
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">{icons.instagram}</a>
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">{icons.facebook}</a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
