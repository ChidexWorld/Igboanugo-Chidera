import React from 'react';
import { SERVICES } from '../../utils/constants';
import '../../styles/components/public/ServicesSection.css';

const ServicesSection = () => {
  return (
    <section id="services">
      <h1 className="heading">
        My <span>Services</span>
      </h1>

      <div className="services_container">
        {SERVICES.map((service, index) => (
          <div key={index} className="services_box">
            <div className="icon">
              <i className={`bx ${service.icon}`}></i>
              <a href="#contact">
                <i className="bx bx-link-external"></i>
              </a>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
