import React, { useState, useEffect } from 'react';
import Header from '../../components/public/Header';
import HomeSection from '../../components/public/HomeSection';
import ServicesSection from '../../components/public/ServicesSection';
import ResumeSection from '../../components/public/ResumeSection';
import PortfolioSection from '../../components/public/PortfolioSection';
import ContactSection from '../../components/public/ContactSection';
import Loader from '../../components/common/Loader';
import {
  getExperiences,
  getEducation,
  getSkills,
  getProjects,
  getSocialLinks,
  getProfilePictures
} from '../../services/firestore';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    socialLinks: [],
    profilePictures: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          experiences,
          education,
          skills,
          projects,
          socialLinks,
          profilePictures
        ] = await Promise.all([
          getExperiences(),
          getEducation(),
          getSkills(),
          getProjects(),
          getSocialLinks(),
          getProfilePictures()
        ]);

        setData({
          experiences,
          education,
          skills,
          projects,
          socialLinks,
          profilePictures
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header />
      <main>
        <HomeSection
          profilePictures={data.profilePictures}
          socialLinks={data.socialLinks}
        />
        <ServicesSection />
        <ResumeSection
          experiences={data.experiences}
          education={data.education}
          skills={data.skills}
        />
        <PortfolioSection projects={data.projects} />
        <ContactSection />
      </main>
    </div>
  );
};

export default Home;
