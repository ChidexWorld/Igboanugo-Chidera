import React, { useState } from 'react';
import { DEFAULT_PROJECTS } from '../../utils/constants';
import '../../styles/components/public/PortfolioSection.css';

const PortfolioSection = ({ projects = [] }) => {
  const mergedProjects = [...DEFAULT_PROJECTS, ...projects.filter(proj => !proj.isDefault)];

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    if (mergedProjects[activeProjectIndex]?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? mergedProjects[activeProjectIndex].images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (mergedProjects[activeProjectIndex]?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === mergedProjects[activeProjectIndex].images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleProjectChange = (index) => {
    setActiveProjectIndex(index);
    setCurrentImageIndex(0);
  };

  const activeProject = mergedProjects[activeProjectIndex];

  return (
    <section id="portfolio">
      <h1 className="heading">
        My <span>Portfolio</span>
      </h1>

      <div className="portfolio_container">
        <div className="portfolio_box">
          <div className="portfolio_detail active">
            <p className="numb">
              {String(activeProjectIndex + 1).padStart(2, "0")}
            </p>
            <h3>{activeProject.title}</h3>
            <p>{activeProject.description}</p>
            <p className="tech">
              {activeProject.technologies?.join(", ") || "N/A"}
            </p>

            <div className="live_github">
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bx-link-external"></i>
                  <span>Live Demo</span>
                </a>
              )}
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-github"></i>
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          <div className="project_indicators">
            {mergedProjects.map((_, index) => (
              <button
                key={index}
                className={`project_indicator ${
                  index === activeProjectIndex ? "active" : ""
                }`}
                onClick={() => handleProjectChange(index)}
                aria-label={`View project ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        <div className="portfolio_box">
          {(() => {
            const imagesToShow =
              activeProject.images && activeProject.images.length > 0
                ? activeProject.images
                : ["/images/defaultimage.jpeg"];

            return (
              <>
                <div className="portfolio_carousel">
                  <div
                    className="img_slide"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {imagesToShow.map((image, index) => (
                      <div key={index} className="img_item">
                        <img
                          src={image}
                          alt={`${activeProject.title} - ${index + 1}`}
                          onError={(e) =>
                            (e.target.src = "/images/defaultimage.jpeg")
                          } // fallback if broken
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="navigation">
                  <button
                    className="arrow_left"
                    onClick={handlePrevImage}
                    disabled={imagesToShow.length <= 1}
                  >
                    <i className="bx bx-chevron-left"></i>
                  </button>
                  <button
                    className="arrow_right"
                    onClick={handleNextImage}
                    disabled={imagesToShow.length <= 1}
                  >
                    <i className="bx bx-chevron-right"></i>
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
