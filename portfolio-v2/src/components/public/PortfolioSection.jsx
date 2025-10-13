import React, { useState } from 'react';
import './PortfolioSection.css';

const PortfolioSection = ({ projects = [] }) => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    if (projects[activeProjectIndex]?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? projects[activeProjectIndex].images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (projects[activeProjectIndex]?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === projects[activeProjectIndex].images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleProjectChange = (index) => {
    setActiveProjectIndex(index);
    setCurrentImageIndex(0);
  };

  if (projects.length === 0) {
    return (
      <section id="portfolio">
        <h1 className="heading">
          My <span>Portfolio</span>
        </h1>
        <div className="portfolio_container">
          <p style={{ fontSize: '1.6rem', textAlign: 'center', gridColumn: '1/-1' }}>
            No projects added yet.
          </p>
        </div>
      </section>
    );
  }

  const activeProject = projects[activeProjectIndex];

  return (
    <section id="portfolio">
      <h1 className="heading">
        My <span>Portfolio</span>
      </h1>

      <div className="portfolio_container">
        <div className="portfolio_box">
          <div className={`portfolio_detail ${activeProjectIndex === 0 ? 'active' : ''}`}>
            <p className="numb">{String(activeProjectIndex + 1).padStart(2, '0')}</p>
            <h3>{activeProject.title}</h3>
            <p>{activeProject.description}</p>
            <p className="tech">{activeProject.technologies?.join(', ') || 'N/A'}</p>

            <div className="live_github">
              {activeProject.liveUrl && (
                <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer">
                  <i className="bx bx-link-external"></i>
                  <span>Live Demo</span>
                </a>
              )}
              {activeProject.githubUrl && (
                <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer">
                  <i className="bx bxl-github"></i>
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          <div className="project_indicators">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`project_indicator ${index === activeProjectIndex ? 'active' : ''}`}
                onClick={() => handleProjectChange(index)}
                aria-label={`View project ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        <div className="portfolio_box">
          {activeProject.images && activeProject.images.length > 0 ? (
            <>
              <div className="portfolio_carousel">
                <div
                  className="img_slide"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`
                  }}
                >
                  {activeProject.images.map((image, index) => (
                    <div key={index} className="img_item">
                      <img src={image} alt={`${activeProject.title} - ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="navigation">
                <button
                  className={`arrow_left ${currentImageIndex === 0 ? 'disabled' : ''}`}
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                >
                  <i className="bx bx-chevron-left"></i>
                </button>
                <button
                  className={`arrow_right ${
                    currentImageIndex === activeProject.images.length - 1 ? 'disabled' : ''
                  }`}
                  onClick={handleNextImage}
                  disabled={currentImageIndex === activeProject.images.length - 1}
                >
                  <i className="bx bx-chevron-right"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="portfolio_carousel">
              <div className="img_slide">
                <div className="img_item">
                  <img src="/placeholder-project.png" alt={activeProject.title} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
