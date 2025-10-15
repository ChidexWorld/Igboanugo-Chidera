import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/public/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'services', 'resume', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation from other pages with hash
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`active ${isScrolled ? 'scrolled' : ''}`}>
      {location.pathname === '/' ? (
        <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          CHIDEX WORLD
        </a>
      ) : (
        <Link to="/" className="logo">
          CHIDEX WORLD
        </Link>
      )}

      <nav className={isMenuOpen ? 'active' : ''}>
        {location.pathname === '/' ? (
          <>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            >
              Home
            </a>
            <a
              href="#services"
              className={activeSection === 'services' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}
            >
              Services
            </a>
            <a
              href="#resume"
              className={activeSection === 'resume' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('resume'); }}
            >
              Resume
            </a>
            <a
              href="#portfolio"
              className={activeSection === 'portfolio' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('portfolio'); }}
            >
              Portfolio
            </a>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
            >
              Contact
            </a>
          </>
        ) : (
          <>
            <Link to="/#home" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/#services" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/#resume" onClick={() => setIsMenuOpen(false)}>Resume</Link>
            <Link to="/#portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
            <Link to="/#contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </>
        )}
        <Link
          to="/blogs"
          className={location.pathname.startsWith('/blog') ? 'active' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          Blog
        </Link>
      </nav>

      <div id="menu-icon" className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`} onClick={toggleMenu}></div>
    </header>
  );
};

export default Header;
