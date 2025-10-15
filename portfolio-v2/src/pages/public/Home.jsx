import React from 'react';
import Header from '../../components/public/Header';
import HomeSection from '../../components/public/HomeSection';
import ServicesSection from '../../components/public/ServicesSection';
import ResumeSection from '../../components/public/ResumeSection';
import PortfolioSection from '../../components/public/PortfolioSection';
import ContactSection from '../../components/public/ContactSection';
import Loader from '../../components/common/Loader';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import '../../styles/pages/public/Home.css';

const Home = () => {
  const { data, isLoading, isError, error } = usePortfolioData();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error?.message || 'Failed to load portfolio data. Please try again later.'}</p>
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
