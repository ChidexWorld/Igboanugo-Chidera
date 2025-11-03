import React from 'react';
import { ROLES, BIO, DEFAULT_SOCIAL_LINKS, PERSONAL_INFO } from '../../utils/constants';
import '../../styles/components/public/HomeSection.css';

const HomeSection = ({ profilePictures = [], socialLinks = [] }) => {
  const mergedSocialLinks = [...DEFAULT_SOCIAL_LINKS, ...socialLinks.filter(link => !link.isDefault)]
    .sort((a, b) => a.order - b.order);

  const newestProfilePicture = profilePictures.length > 0
    ? profilePictures[profilePictures.length - 1]
    : null;

  return (
    <section id="home" className="active">
      <div className="home">
        <div className="home_details">
        <h1>{PERSONAL_INFO.displayName}</h1>
        <h2>
          And I'm{' '}
          {ROLES.map((role, index) => (
            <span
              key={index}
              data-text={role}
              style={{ '--i': index }}
            >
              {role}
            </span>
          ))}
        </h2>
        <p>{BIO.description}</p>

        <div className="btn_sci">
          <a href="/assets/cv/IgboanugoChideraGoodness.pdf" className="btn" download>
            Download CV
          </a>

          <div className="sci">
            {mergedSocialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
              >
                <i className={`bx ${link.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="home_img">
        <div className="img_box">
          <div className="img_item">
            {newestProfilePicture ? (
              <img src={newestProfilePicture.url} alt={PERSONAL_INFO.displayName} />
            ) : (
              <img src="/assets/images/FB_IMG_1733362352755.png" alt={PERSONAL_INFO.displayName} />
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HomeSection;
