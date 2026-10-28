import { useMemo, useRef, useState } from 'react';
import { icons } from './icons';
import slidingGateImg from '../assets/images/modern_sliding_gate.jpg';
import frontFenceImg from '../assets/images/contemporary_front_fence.jpg';
import screenImg from '../assets/images/minimalist_batten_screen.jpg';
import decorativeImg from '../assets/images/decorative_entry_feature.jpg';
import entryImg from '../assets/project-entry.jpg';
import boundaryImg from '../assets/project-boundary.jpg';
import facadeImg from '../assets/project-facade.jpg';
import needBalustradesImg from '../../need/Copy of balustrade and handrail final.png';
import needEntryFeatureImg from '../../need/Copy of ENTRY Arbor.png';
import needFacadeImg from '../../need/Copy of Facade Screening Final.png';
import needDecorativeImg from '../../need/Copy of Final CNC Screens.png';
import needSunHoodsImg from '../../need/Copy of Final Sun Hoods_.png';
import needFrontFenceImg from '../../need/Copy of Front Fence Final_.png';
import needPedestrianGateImg from '../../need/Copy of Pedestrian Gate Final.png';
import needSlidingGateImg from '../../need/Copy of Sliding Gate Final.png';
import needUtilityImg from '../../need/Copy of utility enclosure final.png';
import needWindowShadeImg from '../../need/Window Shade_.png';
import horizontalSlatsStyleImg from '../../styles/Horizontal slat final.png';
import verticalSlatsStyleImg from '../../styles/Vertical Slat.png';
import battenStyleImg from '../../styles/Batten Style Final.png';
import louvreStyleImg from '../../styles/Fixed Louvre Style.png';
import flatBarStyleImg from '../../styles/Flat Bar Style.png';
import hamptonStyleImg from '../../styles/Hampton Style.png';
import customDesignStyleImg from '../../styles/Custom Designs_.png';
import timberBlackWengeImg from '../../finishing/Black Wenge.png';
import timberGreyAshImg from '../../finishing/Grey Ash.png';
import timberHinokiImg from '../../finishing/Hinoki.png';
import timberMerbauImg from '../../finishing/Merbau.png';
import timberNordicOakImg from '../../finishing/Nordic Oak.png';
import timberNorwegianBeechImg from '../../finishing/Norwegian Beech.png';
import timberQueenslandWalnutImg from '../../finishing/Queensland Walnut.png';
import timberSpruceImg from '../../finishing/Spruce.png';
import timberSycamoreImg from '../../finishing/Sycamore.png';
import timberTassieOakImg from '../../finishing/Tassie Oak.png';

const pathwayLabels = {
  'full-package': 'Full Package',
  'supply-only': 'Supply Only',
  installation: 'Installation',
  'talk-to-team': 'Team Help',
};

const fullPackageSteps = [
  'Project',
  'Products',
  'Design',
  'Details',
  'Site',
  'Contact',
  'Review',
];

const fullPackageBuilderSteps = [
  'Project',
  'Details',
  'Site',
  'Contact',
  'Review',
];

const installationSteps = [
  'Project',
  'Installation',
  'Site',
  'Contact',
  'Review',
];

const supplyOnlySteps = [
  'Project',
  'Products',
  'Design',
  'Details',
  'Fulfillment',
  'Contact',
  'Review',
];

const quoteApiUrl = import.meta.env.VITE_QUOTE_API_URL
  || (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost/ausali-api/quote.php'
    : '/api/quote.php');

function createSubmissionUid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `ausali-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const projectTypes = [
  {
    id: 'home',
    title: 'HOME / RESIDENTIAL',
    description: 'For homeowners looking for gates, fencing, screening, balustrades and other architectural aluminium features for their home.',
    image: slidingGateImg,
    icon: 'home',
  },
  {
    id: 'builder',
    title: 'BUILDER / ARCHITECT',
    description: 'For builders, architects and developers working on residential, commercial or multi-residential projects.',
    image: facadeImg,
    icon: 'helmet',
  },
];

const products = [
  { id: 'sliding-gate', title: 'SLIDING GATE', image: needSlidingGateImg },
  { id: 'pedestrian-gate', title: 'PEDESTRIAN GATE', image: needPedestrianGateImg },
  { id: 'front-fence', title: 'FRONT FENCE', image: needFrontFenceImg },
  { id: 'utility-enclosures', title: 'UTILITY ENCLOSURES', image: needUtilityImg },
  { id: 'facade-screen', title: 'FACADE SCREEN', image: needFacadeImg },
  { id: 'balustrades', title: 'BALUSTRADES & HANDRAILS', image: needBalustradesImg },
  { id: 'decorative-screens', title: 'DECORATIVE SCREENS', image: needDecorativeImg },
  { id: 'sun-hoods', title: 'SUN HOODS', image: needSunHoodsImg },
  { id: 'window-shades', title: 'WINDOW SHADES', image: needWindowShadeImg },
  { id: 'entry-features', title: 'ENTRY FEATURES', image: needEntryFeatureImg },
];

const styleOptions = [
  { id: 'horizontal-slats', title: 'Horizontal Slats', description: 'Clean, modern and timeless.', image: horizontalSlatsStyleImg },
  { id: 'vertical-slats', title: 'Vertical Slats', description: 'Bold lines with modern appeal.', image: verticalSlatsStyleImg },
  { id: 'batten-style', title: 'Batten Style', description: 'Architectural and premium.', image: battenStyleImg },
  { id: 'louvre', title: 'Louvre', description: 'Screening with airflow.', image: louvreStyleImg },
  { id: 'cnc-decorative', title: 'CNC Decorative Screen', description: 'Custom designs for a unique look.', image: decorativeImg },
  { id: 'hampton', title: 'Hampton Style', description: 'Classic coastal aesthetic.', image: hamptonStyleImg },
  { id: 'flat-bar', title: 'Flat Bar Style', description: 'Sleek and contemporary.', image: flatBarStyleImg },
  { id: 'minimal-solid', title: 'Minimal / Solid Panel', description: 'Clean lines with a bold look.', image: slidingGateImg },
  { id: 'address-feature', title: 'Address Feature', description: 'Letterboxes, house numbers and more.', image: entryImg },
  { id: 'custom-design', title: 'Custom Design', description: "Have something unique in mind? Let's create it.", image: customDesignStyleImg },
];

const colours = [
  ['Monument', '#20262b'],
  ['Black Satin', '#111111'],
  ['Charcoal', '#4c4a51'],
  ['Woodland Grey', '#5a5955'],
  ['Basalt', '#8d8c89'],
  ['Surfmist', '#ebe7df'],
  ['Dune', '#cfc4b4'],
  ['Shale Grey', '#b7b8b6'],
  ['White', '#f8f8f5'],
  ['Pearl White', '#f4f1eb'],
  ['Paperbark', '#cbbca4'],
  ['Classic Cream', '#e6dcc4'],
  ['Jasper', '#6d5145'],
  ['Manor Red', '#8c3a38'],
  ['Deep Ocean', '#0c314d'],
  ['Cottage Green', '#173f37'],
];

const timberFinishes = [
  { id: 'black-wenge', title: 'Black Wenge', image: timberBlackWengeImg },
  { id: 'grey-ash', title: 'Grey Ash', image: timberGreyAshImg },
  { id: 'hinoki', title: 'Hinoki', image: timberHinokiImg },
  { id: 'merbau', title: 'Merbau', image: timberMerbauImg },
  { id: 'nordic-oak', title: 'Nordic Oak', image: timberNordicOakImg },
  { id: 'norwegian-beech', title: 'Norwegian Beech', image: timberNorwegianBeechImg },
  { id: 'queensland-walnut', title: 'Queensland Walnut', image: timberQueenslandWalnutImg },
  { id: 'spruce', title: 'Spruce', image: timberSpruceImg },
  { id: 'sycamore', title: 'Sycamore', image: timberSycamoreImg },
  { id: 'tassie-oak', title: 'Tassie Oak', image: timberTassieOakImg },
];

const inspirationFilters = [
  'All',
  'Front Entry',
  'Fencing',
  'Privacy & Screening',
  'Sun Hoods',
  'Balustrades (Aluminium)',
  'Outdoor Living',
  'Architectural Features',
];

const inspiration = [
  { id: 'ins-1', title: 'Sliding Gates', image: slidingGateImg, category: 'Front Entry' },
  { id: 'ins-2', title: 'Pedestrian Gates', image: entryImg, category: 'Front Entry' },
  { id: 'ins-3', title: 'Double Gates', image: boundaryImg, category: 'Fencing' },
  { id: 'ins-4', title: 'Front Fencing', image: frontFenceImg, category: 'Fencing' },
  { id: 'ins-5', title: 'Batten Fencing', image: facadeImg, category: 'Privacy & Screening' },
  { id: 'ins-6', title: 'Privacy Screens', image: screenImg, category: 'Privacy & Screening' },
  { id: 'ins-7', title: 'Architectural Features', image: decorativeImg, category: 'Architectural Features' },
  { id: 'ins-8', title: 'Pergolas', image: facadeImg, category: 'Outdoor Living' },
];

const defaultFormData = {
  projectType: 'home',
  products: ['sliding-gate'],
  styles: {
    'sliding-gate': {
      style: 'vertical-slats',
      finish: 'powder-coating',
      colour: 'Monument',
      customColour: '',
      woodFinish: 'black-wenge',
      customFinish: '',
    },
  },
  details: {
    dimensions: '',
    access: '',
    notes: '',
    installDescription: '',
    suppliedBy: 'Third party',
    productStage: 'On site',
    manufacturerRef: '',
    installNotes: '',
  },
  inspiration: ['ins-1', 'ins-5'],
  site: {
    fulfillmentMethod: 'Delivery',
    suburb: '',
    postcode: '',
    address: '',
    preferredDate: '',
    stage: 'Planning / exploring',
    siteDetails: '',
  },
  contact: {
    name: '',
    email: '',
    phone: '',
    notes: '',
  },
};

function CheckIcon() {
  return (
    <span className="quote-check-icon" aria-hidden="true">
      {icons.check}
    </span>
  );
}

function InlineIcon({ type }) {
  if (type === 'helmet') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 29h28v9H10z" />
        <path d="M15 29v-6a9 9 0 0 1 18 0v6" />
        <path d="M24 14v15M8 38h32" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M7 24 24 10l17 14" />
      <path d="M12 22v19h24V22" />
      <path d="M20 41V29h8v12" />
    </svg>
  );
}

function toTitle(value) {
  return pathwayLabels[value] || value;
}

function productTitle(id) {
  return products.find((item) => item.id === id)?.title || id;
}

function styleTitle(id) {
  return styleOptions.find((item) => item.id === id)?.title || 'To be selected';
}

function timberFinishTitle(id) {
  return timberFinishes.find((item) => item.id === id)?.title || id || 'To be selected';
}

function finishSummary(styleData = {}) {
  if (styleData.finish === 'timber-finish') {
    return `Timber finish - ${styleData.woodFinish === 'other' && styleData.customFinish ? styleData.customFinish : timberFinishTitle(styleData.woodFinish)}`;
  }

  return `Powder coating - ${styleData.customColour || styleData.colour || 'To be selected'}`;
}

function isBlank(value) {
  return !String(value || '').trim();
}

function isEmail(value) {
  const email = String(value || '').trim();
  return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function QuoteMultiStepForm({ selectedPathway, onChangePathway, onClose }) {
  const submissionUidRef = useRef(createSubmissionUid());
  const submitInFlightRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProduct, setActiveProduct] = useState('sliding-gate');
  const [submitState, setSubmitState] = useState({ loading: false, error: '', message: '', referenceCode: '' });
  const isFullPackage = selectedPathway === 'full-package';
  const isInstallation = selectedPathway === 'installation';
  const isSupplyOnly = selectedPathway === 'supply-only';
  const isBuilderFullPackage = isFullPackage && formData.projectType === 'builder';
  const flowSteps = isInstallation ? installationSteps : isSupplyOnly ? supplyOnlySteps : isBuilderFullPackage ? fullPackageBuilderSteps : fullPackageSteps;
  const confirmationStep = flowSteps.length + 1;
  const currentStepLabel = flowSteps[currentStep - 1];
  const selectedProducts = products.filter((product) => formData.products.includes(product.id));

  const filteredInspiration = useMemo(() => (
    activeFilter === 'All'
      ? inspiration
      : inspiration.filter((item) => item.category === activeFilter)
  ), [activeFilter]);

  const activeStyleData = formData.styles[activeProduct] || {};

  const handleProductToggle = (productId) => {
    setFormData((prev) => {
      const exists = prev.products.includes(productId);
      if (exists && prev.products.length === 1) {
        return prev;
      }

      const nextProducts = exists
        ? prev.products.filter((item) => item !== productId)
        : [...prev.products, productId];
      const nextStyles = { ...prev.styles };

      if (!exists) {
        nextStyles[productId] = {
          style: 'vertical-slats',
          finish: 'powder-coating',
          colour: 'Monument',
          customColour: '',
          woodFinish: 'black-wenge',
          customFinish: '',
        };
      }

      return { ...prev, products: nextProducts, styles: nextStyles };
    });

    setActiveProduct((prevActive) => {
      if (!formData.products.includes(productId)) {
        return productId;
      }

      if (prevActive !== productId) {
        return prevActive;
      }

      return formData.products.find((item) => item !== productId) || productId;
    });
  };

  const updateStyle = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [activeProduct]: {
          style: 'vertical-slats',
          finish: 'powder-coating',
          colour: 'Monument',
          customColour: '',
          woodFinish: 'black-wenge',
          customFinish: '',
          ...prev.styles[activeProduct],
          [key]: value,
        },
      },
    }));
  };

  const updateFinish = (finish) => {
    setFormData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [activeProduct]: {
          style: 'vertical-slats',
          ...prev.styles[activeProduct],
          finish,
          colour: finish === 'powder-coating' ? (prev.styles[activeProduct]?.colour || 'Monument') : '',
          customColour: finish === 'powder-coating' ? (prev.styles[activeProduct]?.customColour || '') : '',
          woodFinish: finish === 'timber-finish' ? (prev.styles[activeProduct]?.woodFinish || 'black-wenge') : '',
          customFinish: finish === 'timber-finish' ? (prev.styles[activeProduct]?.customFinish || '') : '',
        },
      },
    }));
  };

  const updateNested = (group, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const handleProjectTypeSelect = (projectType) => {
    setFormData((prev) => {
      if (isFullPackage && projectType === 'builder') {
        return {
          ...prev,
          projectType,
          products: [],
          styles: {},
        };
      }

      return {
        ...prev,
        projectType,
        products: prev.products.length ? prev.products : defaultFormData.products,
        styles: Object.keys(prev.styles).length ? prev.styles : defaultFormData.styles,
      };
    });
  };

  const toggleInspiration = (id) => {
    setFormData((prev) => ({
      ...prev,
      inspiration: prev.inspiration.includes(id)
        ? prev.inspiration.filter((item) => item !== id)
        : [...prev.inspiration, id],
    }));
  };

  const buildPayload = (status = 'submitted') => ({
    submissionUid: submissionUidRef.current,
    pathway: selectedPathway,
    projectType: formData.projectType,
    products: formData.products,
    styles: formData.styles,
    details: formData.details,
    inspiration: formData.inspiration,
    site: formData.site,
    contact: formData.contact,
    status,
  });

  const submitQuoteRequest = async (payload) => {
    if (submitInFlightRef.current) {
      return null;
    }

    submitInFlightRef.current = true;
    setSubmitState({ loading: true, error: '', message: '', referenceCode: '' });

    try {
      const response = await fetch(quoteApiUrl, {
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
        throw new Error(result.message || 'The quote request could not be saved.');
      }

      setSubmitState({
        loading: false,
        error: '',
        message: result.message || 'Quote request saved.',
        referenceCode: result.referenceCode || '',
      });

      return result;
    } catch (error) {
      setSubmitState({
        loading: false,
        error: error.message || 'The quote request could not be saved.',
        message: '',
        referenceCode: '',
      });

      return null;
    } finally {
      submitInFlightRef.current = false;
    }
  };

  const goNext = async () => {
    const validationError = validateStep(currentStep);

    if (validationError) {
      setSubmitState((prev) => ({ ...prev, loading: false, error: validationError, message: '', referenceCode: '' }));
      return;
    }

    if (currentStep < flowSteps.length) {
      setSubmitState((prev) => ({ ...prev, error: '' }));
      setCurrentStep(currentStep + 1);
      return;
    }

    const result = await submitQuoteRequest(buildPayload());

    if (result) {
      setCurrentStep(confirmationStep);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setSubmitState((prev) => ({ ...prev, error: '' }));
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber <= currentStep) {
      setSubmitState((prev) => ({ ...prev, error: '' }));
      setCurrentStep(stepNumber);
      return;
    }

    for (let step = currentStep; step < stepNumber; step += 1) {
      const validationError = validateStep(step);

      if (validationError) {
        setSubmitState((prev) => ({ ...prev, loading: false, error: validationError, message: '', referenceCode: '' }));
        setCurrentStep(step);
        return;
      }
    }

    setSubmitState((prev) => ({ ...prev, error: '' }));
    setCurrentStep(stepNumber);
  };

  const validateContactDetails = () => {
    if (isBlank(formData.contact.name)) {
      return 'Please enter your name.';
    }

    if (isBlank(formData.contact.email) && isBlank(formData.contact.phone)) {
      return 'Please enter an email or phone number.';
    }

    if (!isEmail(formData.contact.email)) {
      return 'Please enter a valid email address.';
    }

    return '';
  };

  const validateStep = (stepNumber) => {
    const stepLabel = flowSteps[stepNumber - 1];

    if (stepNumber === 1 && isBlank(formData.projectType)) {
      return 'Please choose a project type.';
    }

    if ((isFullPackage || isSupplyOnly) && stepLabel === 'Products' && !formData.products.length) {
      return 'Please select at least one product.';
    }

    if (isInstallation && stepLabel === 'Installation' && isBlank(formData.details.installDescription)) {
      return 'Please describe what needs installing.';
    }

    if (((isFullPackage && stepLabel === 'Site') || (isInstallation && stepLabel === 'Site')) && (isBlank(formData.site.suburb) || isBlank(formData.site.postcode))) {
      return 'Please enter the suburb and postcode.';
    }

    if (isSupplyOnly && stepLabel === 'Fulfillment') {
      if (isBlank(formData.site.fulfillmentMethod)) {
        return 'Please choose delivery, pickup, or not sure.';
      }

      if (formData.site.fulfillmentMethod === 'Delivery' && (isBlank(formData.site.suburb) || isBlank(formData.site.postcode))) {
        return 'Please enter the delivery suburb and postcode.';
      }
    }

    if (stepLabel === 'Contact') {
      return validateContactDetails();
    }

    if (stepNumber === flowSteps.length) {
      return validateContactDetails();
    }

    return '';
  };

  const submitSimpleEnquiry = (event) => {
    event.preventDefault();

    if (isBlank(formData.contact.name)) {
      setSubmitState((prev) => ({ ...prev, error: 'Please enter your name.', message: '', referenceCode: '' }));
      return;
    }

    if (isBlank(formData.contact.email) && isBlank(formData.contact.phone)) {
      setSubmitState((prev) => ({ ...prev, error: 'Please enter an email or phone number.', message: '', referenceCode: '' }));
      return;
    }

    if (!isEmail(formData.contact.email)) {
      setSubmitState((prev) => ({ ...prev, error: 'Please enter a valid email address.', message: '', referenceCode: '' }));
      return;
    }

    if (isBlank(formData.contact.notes)) {
      setSubmitState((prev) => ({ ...prev, error: 'Please tell us what you need.', message: '', referenceCode: '' }));
      return;
    }

    const payload = {
      submissionUid: submissionUidRef.current,
      pathway: selectedPathway,
      contact: formData.contact,
      details: formData.details,
      site: formData.site,
      status: 'submitted',
    };
    submitQuoteRequest(payload);
  };

  if (!isFullPackage && !isInstallation && !isSupplyOnly) {
    return (
      <div className="multistep-container simple-enquiry-container">
        <Header selectedPathway={selectedPathway} onChangePathway={onChangePathway} onClose={onClose} />
        <div className="simple-enquiry-body">
          <form className="simple-enquiry-panel" onSubmit={submitSimpleEnquiry}>
            <span className="step-kicker">QUICK ENQUIRY</span>
            <h2>{selectedPathway === 'installation' ? 'Installation details' : selectedPathway === 'supply-only' ? 'Supply only quote' : "Let's talk about your project"}</h2>
            <p>
              Leave your details and what you need. This captures the fields needed for a clean database record without making this pathway too long.
            </p>

            <div className="quote-form-grid">
              <label className="quote-field full">
                <span>Your name</span>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.contact.name}
                  onChange={(event) => updateNested('contact', 'name', event.target.value)}
                />
              </label>
              <label className="quote-field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.contact.email}
                  onChange={(event) => updateNested('contact', 'email', event.target.value)}
                />
              </label>
              <label className="quote-field">
                <span>Phone</span>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.contact.phone}
                  onChange={(event) => updateNested('contact', 'phone', event.target.value)}
                />
              </label>
              <label className="quote-field">
                <span>Suburb</span>
                <input
                  type="text"
                  placeholder="e.g. Brisbane"
                  value={formData.site.suburb}
                  onChange={(event) => updateNested('site', 'suburb', event.target.value)}
                />
              </label>
              <label className="quote-field">
                <span>Postcode</span>
                <input
                  type="text"
                  placeholder="e.g. 4000"
                  value={formData.site.postcode}
                  onChange={(event) => updateNested('site', 'postcode', event.target.value)}
                />
              </label>
              <label className="quote-field full">
                <span>What do you need?</span>
                <textarea
                  required
                  rows="5"
                  placeholder={selectedPathway === 'installation' ? 'Tell us what needs to be installed, sizes, site access and timing.' : 'Tell us the products, dimensions, finish, colour and timing you need.'}
                  value={formData.contact.notes}
                  onChange={(event) => updateNested('contact', 'notes', event.target.value)}
                />
              </label>
            </div>

            {submitState.error ? <p className="simple-status error">{submitState.error}</p> : null}
            {submitState.message ? (
              <p className="simple-status">
                {submitState.message} {submitState.referenceCode ? `Reference: ${submitState.referenceCode}` : ''}
              </p>
            ) : null}

            <div className="quote-actions">
              <button type="button" className="btn-back" onClick={onChangePathway}>
                Back
              </button>
              <button type="submit" className="btn-dark-action" disabled={submitState.loading}>
                {submitState.loading ? 'Sending...' : 'Send enquiry'} {icons.arrowRight}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="multistep-container">
      <Header selectedPathway={selectedPathway} onChangePathway={onChangePathway} onClose={onClose} />

      <div className="quote-progress">
        {flowSteps.map((label, index) => {
          const stepNumber = index + 1;
          const completed = currentStep > stepNumber;
          const active = currentStep === stepNumber;

          return (
            <button
              key={label}
              type="button"
              className={`quote-progress-step ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
              onClick={() => goToStep(stepNumber)}
            >
              <span>{completed ? icons.check : stepNumber}</span>
              <strong>{label}</strong>
            </button>
          );
        })}
      </div>

      <div className="multistep-body">
        <main className="multistep-main">
          {currentStep === 1 && (
            <StepShell number="01" title="TELL US ABOUT YOUR PROJECT" description="Choose the option that best describes your project. This helps us tailor the right products, information and next steps for you.">
              <div className="project-type-grid">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`project-type-card ${formData.projectType === type.id ? 'selected' : ''}`}
                    onClick={() => handleProjectTypeSelect(type.id)}
                  >
                    <span className="choice-dot">{formData.projectType === type.id ? icons.check : null}</span>
                    <img src={type.image} alt="" />
                    <span className="project-type-copy">
                      <InlineIcon type={type.icon} />
                      <span>
                        <strong>{type.title}</strong>
                        <small>{type.description}</small>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {(isFullPackage || isSupplyOnly) && currentStepLabel === 'Products' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="WHAT YOU NEED" description="Select the products and elements that suit your project.">
              <div className="products-grid">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className={`product-tile ${formData.products.includes(product.id) ? 'selected' : ''}`}
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <span className="choice-dot">{formData.products.includes(product.id) ? icons.check : null}</span>
                    <img src={product.image} alt="" />
                    <strong>{product.title}</strong>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {(isFullPackage || isSupplyOnly) && currentStepLabel === 'Design' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="CHOOSE YOUR STYLE" description="Select a style for each of the products you have chosen. You can choose different styles for different elements.">
              <label className="quote-field full design-product-select">
                <span>Chosen product</span>
                <select value={activeProduct} onChange={(event) => setActiveProduct(event.target.value)}>
                  {selectedProducts.map((product) => (
                    <option key={product.id} value={product.id}>{product.title}</option>
                  ))}
                </select>
              </label>

              <h3 className="section-small-title">1. Select a style</h3>
              <div className="styles-grid">
                {styleOptions.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    className={`style-card ${activeStyleData.style === style.id ? 'selected' : ''}`}
                    onClick={() => updateStyle('style', style.id)}
                  >
                    <img src={style.image} alt="" />
                    <strong>{style.title}</strong>
                    <small>{style.description}</small>
                  </button>
                ))}
              </div>

              <h3 className="section-small-title">2. Choose a finish</h3>
              <div className="finish-options">
                <button
                  type="button"
                  className={`finish-card ${activeStyleData.finish === 'powder-coating' ? 'selected' : ''}`}
                  onClick={() => updateFinish('powder-coating')}
                >
                  <span className="finish-swatch powder" />
                  <span>
                    <strong>Powder Coating</strong>
                    <small>Durable, low maintenance and a wide range of colours.</small>
                  </span>
                  {activeStyleData.finish === 'powder-coating' ? <CheckIcon /> : null}
                </button>
                <button
                  type="button"
                  className={`finish-card ${activeStyleData.finish === 'timber-finish' ? 'selected' : ''}`}
                  onClick={() => updateFinish('timber-finish')}
                >
                  <span className="finish-swatch timber" />
                  <span>
                    <strong>Timber Finish</strong>
                    <small>Natural timber look with the benefits of aluminium.</small>
                  </span>
                  {activeStyleData.finish === 'timber-finish' ? <CheckIcon /> : null}
                </button>
              </div>

              {activeStyleData.finish === 'timber-finish' ? (
                <>
                  <h3 className="section-small-title">Select a finishing</h3>
                  <div className="timber-finish-grid">
                    {timberFinishes.map((finish) => (
                      <button
                        key={finish.id}
                        type="button"
                        className={`timber-finish-option ${activeStyleData.woodFinish === finish.id ? 'selected' : ''}`}
                        onClick={() => updateStyle('woodFinish', finish.id)}
                      >
                        <img src={finish.image} alt="" />
                        <small>{finish.title}</small>
                        {activeStyleData.woodFinish === finish.id ? <CheckIcon /> : null}
                      </button>
                    ))}
                  </div>

                  <div className="custom-colour-panel">
                    <strong>Need another timber finish?</strong>
                    <div className="custom-colour-input">
                      <input
                        type="text"
                        placeholder="Enter finish name, brand, sample reference or notes"
                        value={activeStyleData.customFinish || ''}
                        onChange={(event) => updateStyle('customFinish', event.target.value)}
                      />
                      <button type="button" onClick={() => updateStyle('woodFinish', 'other')}>
                        Apply finish
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="section-small-title">Select a colour</h3>
                  <div className="colour-grid">
                    {colours.map(([name, hex]) => (
                      <button
                        key={name}
                        type="button"
                        className={`colour-option ${activeStyleData.colour === name ? 'selected' : ''}`}
                        onClick={() => updateStyle('colour', name)}
                      >
                        <span style={{ backgroundColor: hex }} />
                        <small>{name}</small>
                      </button>
                    ))}
                  </div>

                  <div className="custom-colour-panel">
                    <strong>Don't see your colour? Enter a colour code</strong>
                    <div className="custom-colour-input">
                      <input
                        type="text"
                        placeholder="e.g. Monument, Surfmist, Interpon code, Dulux code"
                        value={activeStyleData.customColour || ''}
                        onChange={(event) => updateStyle('customColour', event.target.value)}
                      />
                      <button type="button" onClick={() => updateStyle('colour', activeStyleData.customColour || activeStyleData.colour)}>
                        Apply colour
                      </button>
                    </div>
                  </div>
                </>
              )}
            </StepShell>
          )}

          {(isFullPackage || isSupplyOnly) && currentStepLabel === 'Details' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="PROJECT DETAILS" description="Tell us any dimensions, site conditions or notes that help us understand the scope.">
              <div className="quote-form-grid">
                <label className="quote-field full">
                  <span>Approximate dimensions</span>
                  <textarea
                    rows="4"
                    placeholder="e.g. Sliding gate 5m wide x 1.8m high, front fence 12m long..."
                    value={formData.details.dimensions}
                    onChange={(event) => updateNested('details', 'dimensions', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Access or site notes</span>
                  <textarea
                    rows="4"
                    placeholder="Driveway slope, narrow access, existing fencing, power availability..."
                    value={formData.details.access}
                    onChange={(event) => updateNested('details', 'access', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Anything else?</span>
                  <textarea
                    rows="3"
                    placeholder="Optional notes, preferred look, matching requirements or special requests."
                    value={formData.details.notes}
                    onChange={(event) => updateNested('details', 'notes', event.target.value)}
                  />
                </label>
              </div>
            </StepShell>
          )}

          {isInstallation && currentStepLabel === 'Installation' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="WHAT NEEDS INSTALLING?" description="Tell us about the products you have and what is ready on site.">
              <div className="quote-form-grid installation-details-grid">
                <label className="quote-field full">
                  <span>Products or work required</span>
                  <textarea
                    required
                    rows="5"
                    placeholder="For example: install a supplied sliding gate and two screening panels."
                    value={formData.details.installDescription}
                    onChange={(event) => updateNested('details', 'installDescription', event.target.value)}
                  />
                </label>

                <fieldset className="segmented-field">
                  <legend>Who supplied the products?</legend>
                  <div>
                    {['AUSALI', 'Third party', 'Not sure'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={formData.details.suppliedBy === option ? 'active' : ''}
                        onClick={() => updateNested('details', 'suppliedBy', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="segmented-field">
                  <legend>What stage are the products at?</legend>
                  <div>
                    {['Ordered', 'On site', 'Not ordered', 'Not sure'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={formData.details.productStage === option ? 'active' : ''}
                        onClick={() => updateNested('details', 'productStage', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="quote-field full">
                  <span>Manufacturer / product reference (optional)</span>
                  <input
                    type="text"
                    placeholder="Brand, model or reference"
                    value={formData.details.manufacturerRef}
                    onChange={(event) => updateNested('details', 'manufacturerRef', event.target.value)}
                  />
                </label>

                <label className="quote-field full">
                  <span>Installation notes (optional)</span>
                  <textarea
                    rows="5"
                    placeholder="Existing posts, footing details or anything we should know."
                    value={formData.details.installNotes}
                    onChange={(event) => updateNested('details', 'installNotes', event.target.value)}
                  />
                </label>
              </div>
            </StepShell>
          )}

          {((isFullPackage && currentStepLabel === 'Site') || (isInstallation && currentStepLabel === 'Site')) && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="WHERE WILL IT COME TO LIFE?" description="Tell us about the location and your preferred timing.">
              <div className="quote-form-grid">
                <label className="quote-field">
                  <span>Suburb</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brisbane"
                    value={formData.site.suburb}
                    onChange={(event) => updateNested('site', 'suburb', event.target.value)}
                  />
                </label>
                <label className="quote-field">
                  <span>Postcode</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4000"
                    value={formData.site.postcode}
                    onChange={(event) => updateNested('site', 'postcode', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Street address (optional)</span>
                  <input
                    type="text"
                    placeholder="Street and number"
                    value={formData.site.address}
                    onChange={(event) => updateNested('site', 'address', event.target.value)}
                  />
                </label>
                <label className="quote-field">
                  <span>Preferred date (optional)</span>
                  <input
                    type="date"
                    value={formData.site.preferredDate}
                    onChange={(event) => updateNested('site', 'preferredDate', event.target.value)}
                  />
                </label>
                <label className="quote-field">
                  <span>Project stage</span>
                  <select value={formData.site.stage} onChange={(event) => updateNested('site', 'stage', event.target.value)}>
                    <option>Planning / exploring</option>
                    <option>Ready to quote</option>
                    <option>Builder tender</option>
                    <option>Ready for fabrication</option>
                    <option>Installation timing required</option>
                  </select>
                </label>
                <label className="quote-field full">
                  <span>Access or site details (optional)</span>
                  <textarea
                    rows="5"
                    placeholder="Sloping driveway, narrow access, existing fencing..."
                    value={formData.site.siteDetails}
                    onChange={(event) => updateNested('site', 'siteDetails', event.target.value)}
                  />
                </label>
              </div>
            </StepShell>
          )}

          {isSupplyOnly && currentStepLabel === 'Fulfillment' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="HOW WOULD YOU LIKE TO RECEIVE IT?" description="Choose your preference. We'll confirm the arrangements with you.">
              <div className="quote-form-grid">
                <fieldset className="segmented-field full">
                  <legend>Fulfillment preference</legend>
                  <div>
                    {['Delivery', 'Pickup', 'Not sure'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={formData.site.fulfillmentMethod === option ? 'active' : ''}
                        onClick={() => updateNested('site', 'fulfillmentMethod', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="quote-field">
                  <span>Delivery suburb</span>
                  <input
                    type="text"
                    required={formData.site.fulfillmentMethod === 'Delivery'}
                    placeholder="Destination suburb"
                    value={formData.site.suburb}
                    onChange={(event) => updateNested('site', 'suburb', event.target.value)}
                  />
                </label>
                <label className="quote-field">
                  <span>Postcode</span>
                  <input
                    type="text"
                    required={formData.site.fulfillmentMethod === 'Delivery'}
                    placeholder="Postcode"
                    value={formData.site.postcode}
                    onChange={(event) => updateNested('site', 'postcode', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Delivery address (optional)</span>
                  <input
                    type="text"
                    placeholder="Street and number"
                    value={formData.site.address}
                    onChange={(event) => updateNested('site', 'address', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Preferred timing (optional)</span>
                  <input
                    type="date"
                    value={formData.site.preferredDate}
                    onChange={(event) => updateNested('site', 'preferredDate', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Delivery or collection notes (optional)</span>
                  <textarea
                    rows="5"
                    placeholder="Anything that would help us plan your supply."
                    value={formData.site.siteDetails}
                    onChange={(event) => updateNested('site', 'siteDetails', event.target.value)}
                  />
                </label>
              </div>
            </StepShell>
          )}

          {currentStepLabel === 'Contact' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="LET'S TALK ABOUT YOUR PROJECT." description="Leave your details so the AUSALI team can follow up.">
              <div className="quote-form-grid">
                <label className="quote-field full">
                  <span>Your name</span>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.contact.name}
                    onChange={(event) => updateNested('contact', 'name', event.target.value)}
                  />
                </label>
                <label className="quote-field">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.contact.email}
                    onChange={(event) => updateNested('contact', 'email', event.target.value)}
                  />
                </label>
                <label className="quote-field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.contact.phone}
                    onChange={(event) => updateNested('contact', 'phone', event.target.value)}
                  />
                </label>
                <label className="quote-field full">
                  <span>Anything else you'd like to add?</span>
                  <textarea
                    rows="5"
                    placeholder="Optional project notes"
                    value={formData.contact.notes}
                    onChange={(event) => updateNested('contact', 'notes', event.target.value)}
                  />
                </label>
              </div>
            </StepShell>
          )}

          {currentStepLabel === 'Review' && (
            <StepShell number={String(currentStep).padStart(2, '0')} title="YOUR PROJECT, ALL TOGETHER." description="Check your brief before sharing it with our team.">
              <ReviewRows formData={formData} selectedPathway={selectedPathway} />
            </StepShell>
          )}

          {currentStep === confirmationStep && (
            <div className="confirmation-panel">
              <span className="confirmation-mark">{icons.check}</span>
              <span className="step-kicker">CONFIRMATION</span>
              <h2>YOUR PROJECT STARTS HERE.</h2>
              <p>Your enquiry has been received and saved.</p>
              <strong>{submitState.referenceCode || 'AUSALI'}</strong>
              <small>Our team will review your selections and get in touch to discuss your project.</small>
              <em>{submitState.message || 'Quote request saved.'}</em>
              <button type="button" onClick={() => setCurrentStep(flowSteps.length)}>Back to project summary</button>
            </div>
          )}

          {currentStep <= flowSteps.length ? (
            <div className="step-footer">
              {currentStep > 1 ? (
                <button type="button" className="btn-back" onClick={goBack}>Back</button>
              ) : <span />}

              <div className="footer-right">
                {currentStep < flowSteps.length ? <button type="button" className="btn-save-draft">Save draft</button> : null}
                <button type="button" className="btn-dark-action" onClick={goNext} disabled={submitState.loading}>
                  {submitState.loading ? 'Saving...' : currentStep === flowSteps.length ? 'Submit project' : flowSteps[currentStep] || 'Continue'} {icons.arrowRight}
                </button>
              </div>
            </div>
          ) : null}
          {submitState.error && currentStep <= flowSteps.length ? <p className="quote-submit-error">{submitState.error}</p> : null}
        </main>

        <Sidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filteredInspiration={filteredInspiration}
          selectedInspiration={formData.inspiration}
          toggleInspiration={toggleInspiration}
          selectedPathway={selectedPathway}
          formData={formData}
        />
      </div>
    </div>
  );
}

function Header({ selectedPathway, onChangePathway, onClose }) {
  return (
    <header className="multistep-header">
      <div className="pathway-badge">
        SELECTED PATHWAY - <strong>{toTitle(selectedPathway)}</strong>
        <button type="button" className="change-btn" onClick={onChangePathway}>Change</button>
      </div>
      <button className="modal-close-icon" onClick={onClose} aria-label="Close">
        {icons.close}
      </button>
    </header>
  );
}

function StepShell({ number, title, description, children }) {
  return (
    <section className="quote-step">
      <span className="step-kicker">{number}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}

function ReviewRows({ formData, selectedPathway }) {
  const projectLabel = projectTypes.find((item) => item.id === formData.projectType)?.title || 'Home Project';
  const isInstallation = selectedPathway === 'installation';
  const isSupplyOnly = selectedPathway === 'supply-only';
  const isBuilderFullPackage = selectedPathway === 'full-package' && formData.projectType === 'builder';

  return (
    <div className="review-list">
      <section>
        <a href="#project">Edit</a>
        <h3>Project overview</h3>
        <p>{toTitle(selectedPathway)} - {projectLabel}</p>
      </section>
      {isInstallation ? (
        <section>
          <a href="#installation">Edit</a>
          <h3>Installation brief</h3>
          <div className="review-row">
            <span>Products</span>
            <strong>{formData.details.installDescription || 'To be confirmed'}</strong>
          </div>
          <div className="review-row">
            <span>Supplied by</span>
            <strong>{formData.details.suppliedBy}</strong>
          </div>
          <div className="review-row">
            <span>Product stage</span>
            <strong>{formData.details.productStage}</strong>
          </div>
        </section>
      ) : isBuilderFullPackage ? (
        <section>
          <a href="#details">Edit</a>
          <h3>Project details</h3>
          <div className="review-row">
            <span>Dimensions</span>
            <strong>{formData.details.dimensions || 'To be confirmed'}</strong>
          </div>
          <div className="review-row">
            <span>Access / site notes</span>
            <strong>{formData.details.access || 'To be confirmed'}</strong>
          </div>
          <div className="review-row">
            <span>Notes</span>
            <strong>{formData.details.notes || 'To be confirmed'}</strong>
          </div>
        </section>
      ) : (
        <section>
          <a href="#products">Edit</a>
          <h3>Your selected elements</h3>
          {formData.products.map((id) => (
            <div className="review-row" key={id}>
              <span>{productTitle(id)}</span>
              <strong>{styleTitle(formData.styles[id]?.style)} / {finishSummary(formData.styles[id])}</strong>
            </div>
          ))}
          <small>Approximate dimensions to be verified.</small>
        </section>
      )}
      <section>
        <a href={isSupplyOnly ? '#fulfillment' : '#site'}>Edit</a>
        <h3>{isSupplyOnly ? 'Fulfillment' : 'Site & timing'}</h3>
        <p>
          {isSupplyOnly
            ? `${formData.site.fulfillmentMethod || 'Not sure'} - ${formData.site.suburb || 'Destination to be confirmed'}`
            : `${formData.site.suburb || 'Location to be confirmed'} - ${formData.site.stage || 'Flexible timing'}`}
        </p>
      </section>
      <section>
        <a href="#contact">Edit</a>
        <h3>Contact</h3>
        <p>{formData.contact.name || 'Your name'} - {formData.contact.email || 'Contact details to be added'}</p>
      </section>
    </div>
  );
}

function Sidebar({ activeFilter, setActiveFilter, filteredInspiration, selectedInspiration, toggleInspiration, selectedPathway, formData }) {
  const showProductSummary = !(selectedPathway === 'full-package' && formData.projectType === 'builder');

  return (
    <aside className="multistep-sidebar">
      <div className="sidebar-inspiration">
        <h4>FIND INSPIRATION</h4>
        <p>Explore styles, products and projects we can create.</p>
        <div className="sidebar-filters">
          {inspirationFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="inspiration-grid">
          {filteredInspiration.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`inspire-card ${selectedInspiration.includes(item.id) ? 'selected' : ''}`}
              onClick={() => toggleInspiration(item.id)}
            >
              <img src={item.image} alt="" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="project-sidebar-summary">
        <span>YOUR PROJECT</span>
        <h5>COMING TOGETHER.</h5>
        <dl>
          <div>
            <dt>Service</dt>
            <dd>{toTitle(selectedPathway)}</dd>
          </div>
          <div>
            <dt>Project</dt>
            <dd>{formData.projectType === 'builder' ? 'Builder / Architect' : 'Home'}</dd>
          </div>
          {showProductSummary && formData.products.slice(0, 4).map((id) => (
            <div key={id}>
              <dt>{productTitle(id).toLowerCase()}</dt>
              <dd>{styleTitle(formData.styles[id]?.style)}</dd>
            </div>
          ))}
        </dl>
        <p>Your selections give us a starting point. We will review the details with you.</p>
      </div>
    </aside>
  );
}

export default QuoteMultiStepForm;
