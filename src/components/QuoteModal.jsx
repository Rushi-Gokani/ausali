import { useState, useEffect } from 'react';
import QuotePathwaySelection from './QuotePathwaySelection';
import QuoteMultiStepForm from './QuoteMultiStepForm';
import '../QuoteModal.css';

function QuoteModal({ open, onClose }) {
  const [phase, setPhase] = useState('pathway-selection'); // 'pathway-selection' or 'multi-step-form'
  const [selectedPathway, setSelectedPathway] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPhase('pathway-selection');
        setSelectedPathway('');
      }, 300); // Wait for transition
    }
  }, [open]);

  if (!open) return null;

  const handleSelectPathway = (pathwayId) => {
    setSelectedPathway(pathwayId);
    setPhase('multi-step-form');
  };

  const handleChangePathway = () => {
    setPhase('pathway-selection');
  };

  return (
    <div className={`modal-backdrop ${phase === 'multi-step-form' ? 'full-screen-backdrop' : ''}`} onClick={onClose}>
      <div 
        className={`modal-wrapper ${phase === 'multi-step-form' ? 'multi-step-wrapper' : 'pathway-wrapper'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {phase === 'pathway-selection' ? (
          <QuotePathwaySelection 
            onSelectPathway={handleSelectPathway} 
            onTalkToTeam={() => handleSelectPathway('talk-to-team')}
            onClose={onClose} 
          />
        ) : (
          <QuoteMultiStepForm 
            selectedPathway={selectedPathway} 
            onChangePathway={handleChangePathway}
            onClose={onClose} 
          />
        )}
      </div>
    </div>
  );
}

export default QuoteModal;
