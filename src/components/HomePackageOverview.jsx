import { useState } from 'react';
import homePackageSketch from '../assets/home-package-sketch.jpg';
import { icons } from './icons';
import './HomePackageOverview.css';

const packageItems = [
  { id: 'sliding-gate', num: '01', name: 'SLIDING GATE', desc: 'Precision motorized & manual architectural aluminium sliding gates.', x: 44, y: 72 },
  { id: 'pedestrian-gate', num: '02', name: 'PEDESTRIAN GATE', desc: 'Matching keyed or smart lock pedestrian side access gates.', x: 30, y: 70 },
  { id: 'front-fence', num: '03', name: 'FRONT FENCE', desc: 'Continuous horizontal or vertical aluminium slat boundary fencing.', x: 18, y: 72 },
  { id: 'entry-arbour', num: '04', name: 'ENTRY ARBOUR', desc: 'Architectural entry portal structures connecting gate to facade.', x: 50, y: 52 },
  { id: 'facade-screening', num: '05', name: 'FAÇADE SCREENING', desc: 'Upper-level vertical decorative aluminium battens and screening.', x: 44, y: 28 },
  { id: 'window-sunhoods', num: '06', name: 'WINDOW SUNHOODS', desc: 'Engineered aluminium window shading hoods and angled louvres.', x: 63, y: 27 },
  { id: 'privacy-screening', num: '07', name: 'PRIVACY SCREENING', desc: 'Perimeter privacy screening providing airflow and total seclusion.', x: 74, y: 70 },
  { id: 'bin-enclosure', num: '08', name: 'BIN ENCLOSURE', desc: 'Concealed custom waste enclosure matching house slat profile.', x: 56, y: 66 },
  { id: 'ac-unit-screening', num: '09', name: 'AC UNIT SCREENING', desc: 'Acoustic & ventilation-safe architectural condenser covers.', x: 49, y: 65 },
  { id: 'balustrades', num: '10', name: 'BALUSTRADES', desc: 'Structural glass & aluminium balcony and void balustrading.', x: 68, y: 35 }
];

function HomePackageOverview({ onPlanPackage }) {
  const [activeHotspot, setActiveHotspot] = useState(null);

  return (
    <section className="home-package-overview">
      <div className="container overview-container">
        <div className="overview-layout-grid">
          
          <div className="overview-left-col">
            <span className="overview-sub-title">THE AUSALI HOME PACKAGE</span>
            <h2 className="overview-main-heading">
              ONE MATERIAL.<br />
              ONE ARCHITECTURAL<br />
              LANGUAGE.
            </h2>
            
            <div className="overview-accent-bar"></div>
            
            <p className="overview-intro-text">
              A coordinated suite of aluminium elements,<br />
              designed as one architectural language across your home.
            </p>
            
            <button className="btn-plan-package" onClick={onPlanPackage}>
              <span>PLAN YOUR HOME PACKAGE</span>
              <span className="btn-arrow-right">{icons.arrowRight}</span>
            </button>
          </div>

          <div className="overview-right-col">
            <div 
              className="sketch-display-card"
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <div className="sketch-image-wrapper">
                <img
                  src={homePackageSketch}
                  alt="The AUSALI Home Package architectural system diagram with 10 integrated elements"
                  className="sketch-img"
                />

                {packageItems.map((item) => {
                  const isActive = activeHotspot === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`hotspot-pin hotspot-${item.id} ${isActive ? 'active-pin' : ''}`}
                      style={{ left: `${item.x}%`, top: `${item.y}%` }}
                      onMouseEnter={() => setActiveHotspot(item.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === item.id ? null : item.id);
                      }}
                      aria-label={`View ${item.name}`}
                    >
                      <span className="pin-pulse"></span>
                      <span className="pin-circle">{item.num}</span>
                      {isActive && (
                        <div className="pin-tooltip desktop-tooltip">
                          <span className="tooltip-num">{item.num}</span>
                          <span className="tooltip-name">{item.name}</span>
                          <span className="tooltip-desc">{item.desc}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {activeHotspot && (
                <div className="active-element-banner">
                  {(() => {
                    const current = packageItems.find(p => p.id === activeHotspot) || packageItems[0];
                    return (
                      <div className="active-banner-content">
                        <div className="active-banner-header">
                          <span className="active-banner-num">{current.num}</span>
                          <span className="active-banner-title">{current.name}</span>
                        </div>
                        <p className="active-banner-desc">{current.desc}</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default HomePackageOverview;
