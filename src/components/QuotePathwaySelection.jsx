import { useState } from 'react';
import { icons } from './icons';
import houseIcon from '../../house-svgrepo-com.svg';
import toolsIcon from '../../tools-svgrepo-com.svg';
import truckIcon from '../../truck-svgrepo-com (1).svg';

const pathwayOptions = [
  {
    id: 'full-package',
    title: 'FULL PACKAGE',
    description: 'Design, fabrication and installation.',
    icon: houseIcon,
  },
  {
    id: 'supply-only',
    title: 'SUPPLY ONLY',
    description: 'Custom fabrication, ready for installation.',
    icon: truckIcon,
  },
  {
    id: 'installation',
    title: 'INSTALLATION',
    description: 'Installation of your supplied products.',
    icon: toolsIcon,
  },
];

function QuotePathwaySelection({ onSelectPathway, onTalkToTeam, onClose }) {
  const [selectedPathway, setSelectedPathway] = useState('full-package');

  return (
    <div className="pathway-selection-container">
      <button
        className="modal-close-btn pathway-close"
        onClick={onClose}
        aria-label="Close quote dialog"
      >
        {icons.close}
      </button>

      <div className="pathway-header">
        <span>START YOUR PROJECT</span>
        <h3>HOW CAN WE HELP?</h3>
        <p>Choose the pathway that best describes what you need.</p>
      </div>

      <div className="pathway-options" role="radiogroup" aria-label="Quote pathway">
        {pathwayOptions.map((pathway) => (
          <button
            key={pathway.id}
            type="button"
            className={`pathway-card ${selectedPathway === pathway.id ? 'selected' : ''}`}
            onClick={() => setSelectedPathway(pathway.id)}
            role="radio"
            aria-checked={selectedPathway === pathway.id}
          >
            <span className="pathway-sketch" aria-hidden="true">
              <img src={pathway.icon} alt="" />
            </span>
            <span className="pathway-info">
              <strong>{pathway.title}</strong>
              <small>{pathway.description}</small>
            </span>
            <span className="pathway-radio" aria-hidden="true">
              {selectedPathway === pathway.id ? icons.check : null}
            </span>
          </button>
        ))}
      </div>

      <div className="pathway-footer">
        <button
          type="button"
          className="btn-start-project"
          onClick={() => onSelectPathway(selectedPathway)}
        >
          Start my project {icons.arrowRight}
        </button>
        <button type="button" className="btn-not-sure" onClick={onTalkToTeam}>
          I'm not sure - talk to our team
        </button>
      </div>
    </div>
  );
}

export default QuotePathwaySelection;
