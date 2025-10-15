import React, { useState } from 'react';
import { RESUME_SECTIONS, DEFAULT_EDUCATION, DEFAULT_EXPERIENCE, DEFAULT_SKILLS, PERSONAL_INFO, WHY_HIRE_ME } from '../../utils/constants';
import '../../styles/components/public/ResumeSection.css';

const ResumeSection = ({ experiences = [], education = [], skills = [] }) => {
  const [activeTab, setActiveTab] = useState('experience');

  const mergedExperiences = [...DEFAULT_EXPERIENCE, ...experiences.filter(exp => !exp.isDefault)]
    .sort((a, b) => new Date(b.period.split(' - ')[0]) - new Date(a.period.split(' - ')[0]));

  const mergedEducation = [...DEFAULT_EDUCATION, ...education.filter(edu => !edu.isDefault)]
    .sort((a, b) => new Date(b.year.split(' - ')[0]) - new Date(a.year.split(' - ')[0]));

  const mergedSkills = [...DEFAULT_SKILLS, ...skills.filter(skill => !skill.isDefault)];

  const tabs = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About Me' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'experience':
        return (
          <div className="resume_detail active experience">
            <h2 className="heading">{RESUME_SECTIONS.experience.title}</h2>
            <p className="desc">{RESUME_SECTIONS.experience.description}</p>
            <div className="resume_list">
              {mergedExperiences.map((exp, index) => (
                <div key={index} className="resume_item">
                  <p className="year">{exp.period}</p>
                  <h3>{exp.position}</h3>
                  <p className="company">{exp.company}</p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="resume_detail active education">
            <h2 className="heading">{RESUME_SECTIONS.education.title}</h2>
            <p className="desc">{RESUME_SECTIONS.education.description}</p>
            <div className="resume_list">
              {mergedEducation.map((edu, index) => (
                <div key={index} className="resume_item">
                  <p className="year">{edu.year}</p>
                  <h3>{edu.degree}</h3>
                  <p className="company">{edu.institution}</p>
                  <p>{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="resume_detail active skills">
            <h2 className="heading">{RESUME_SECTIONS.skills.title}</h2>
            <p className="desc">{RESUME_SECTIONS.skills.description}</p>
            <div className="resume_list">
              {mergedSkills.map((skill, index) => (
                <div key={index} className="resume_item">
                  <i className={skill.icon}></i>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="resume_detail active about">
            <h2 className="heading">{RESUME_SECTIONS.about.title}</h2>
            <p className="desc">{WHY_HIRE_ME}</p>
            <div className="resume_list">
              <div className="resume_item">
                <p>Name: <span>{PERSONAL_INFO.name}</span></p>
              </div>
              <div className="resume_item">
                <p>Email: <span>{PERSONAL_INFO.email}</span></p>
              </div>
              <div className="resume_item">
                <p>Phone: <span>{PERSONAL_INFO.phone}</span></p>
              </div>
              <div className="resume_item">
                <p>Address: <span>{PERSONAL_INFO.address}</span></p>
              </div>
              <div className="resume_item">
                <p>Nationality: <span>{PERSONAL_INFO.nationality}</span></p>
              </div>
              <div className="resume_item">
                <p>Date of Birth: <span>{PERSONAL_INFO.dob}</span></p>
              </div>
              <div className="resume_item">
                <p>Gender: <span>{PERSONAL_INFO.gender}</span></p>
              </div>
              <div className="resume_item">
                <p>Status: <span>{PERSONAL_INFO.status}</span></p>
              </div>
              <div className="resume_item">
                <p>Experience: <span>{PERSONAL_INFO.experience}</span></p>
              </div>
              <div className="resume_item">
                <p>Languages: <span>{PERSONAL_INFO.languages}</span></p>
              </div>
              <div className="resume_item">
                <p>Freelance: <span>{PERSONAL_INFO.freelanceAvailable ? 'Available' : 'Not Available'}</span></p>
              </div>
              <div className="resume_item">
                <p>Full-Time: <span>{PERSONAL_INFO.fullTimeAvailable ? 'Available' : 'Not Available'}</span></p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="resume">
      <h1 className="heading">
        My <span>Resume</span>
      </h1>

      <div className="resume_container">
        <div className="resume_box">
          <h2>Why Hire Me?</h2>
          <p className="desc">{WHY_HIRE_ME}</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`resume_btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="resume_box">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
