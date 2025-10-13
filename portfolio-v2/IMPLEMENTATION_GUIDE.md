# Portfolio V2 - Complete Implementation Guide

## Table of Contents
1. [Project Setup](#project-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Remaining Components to Create](#remaining-components-to-create)
4. [Admin Dashboard Implementation](#admin-dashboard-implementation)
5. [Public Pages Implementation](#public-pages-implementation)
6. [Styling Guide](#styling-guide)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Project Setup

### 1. Install Dependencies

```bash
cd portfolio-v2
npm install
```

### 2. Copy your assets
```bash
# Copy images from your V1 portfolio
cp -r ../assets/images/* src/assets/images/
```

## Firebase Configuration

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project named "portfolio-v2"
3. Enable Google Analytics (optional)

### Step 2: Enable Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Add your admin email

### Step 3: Create Firestore Database
1. Go to Firestore Database
2. Create database in production mode
3. Deploy the firestore.rules file:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 4: Enable Storage
1. Go to Storage
2. Get Started
3. Deploy storage.rules:
   ```bash
   firebase deploy --only storage:rules
   ```

### Step 5: Get Firebase Config
1. Go to Project Settings > General
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Copy the firebaseConfig object
5. Create `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Step 6: Create Admin User
```bash
# In Firebase Console > Authentication > Add User
Email: your-admin@example.com
Password: YourSecurePassword123!
```

## Remaining Components to Create

### 1. Admin Dashboard (`src/pages/admin/AdminDashboard.jsx`)

```jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Dashboard from '../../components/admin/Dashboard';
import ExperienceManager from '../../components/admin/ExperienceManager';
import EducationManager from '../../components/admin/EducationManager';
import SkillsManager from '../../components/admin/SkillsManager';
import ProjectsManager from '../../components/admin/ProjectsManager';
import CertificatesManager from '../../components/admin/CertificatesManager';
import BlogsManager from '../../components/admin/BlogsManager';
import ProfilePictureManager from '../../components/admin/ProfilePictureManager';
import SocialLinksManager from '../../components/admin/SocialLinksManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="experiences" element={<ExperienceManager />} />
          <Route path="education" element={<EducationManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="certificates" element={<CertificatesManager />} />
          <Route path="blogs" element={<BlogsManager />} />
          <Route path="profile-picture" element={<ProfilePictureManager />} />
          <Route path="social-links" element={<SocialLinksManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### 2. Sidebar Component (`src/components/admin/Sidebar.jsx`)

```jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', icon: 'bx-home', label: 'Dashboard' },
    { path: '/admin/experiences', icon: 'bx-briefcase', label: 'Experiences' },
    { path: '/admin/education', icon: 'bx-book', label: 'Education' },
    { path: '/admin/skills', icon: 'bx-code-alt', label: 'Skills' },
    { path: '/admin/projects', icon: 'bx-folder', label: 'Projects' },
    { path: '/admin/certificates', icon: 'bx-award', label: 'Certificates' },
    { path: '/admin/blogs', icon: 'bx-edit', label: 'Blogs' },
    { path: '/admin/profile-picture', icon: 'bx-image', label: 'Profile Picture' },
    { path: '/admin/social-links', icon: 'bx-link', label: 'Social Links' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>Portfolio V2</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={`bx ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="bx bx-log-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
```

### 3. CRUD Manager Template

For each manager (Experience, Education, Skills, etc.), use this template:

```jsx
// src/components/admin/ExperienceManager.jsx (example)
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import './CRUDManager.css';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    company: '',
    description: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await getAllDocuments('experiences');
      setExperiences(data);
    } catch (error) {
      toast.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateDocument('experiences', editingId, formData);
        toast.success('Experience updated successfully');
      } else {
        await addDocument('experiences', formData);
        toast.success('Experience added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchExperiences();
    } catch (error) {
      toast.error('Failed to save experience');
    }
  };

  const handleEdit = (experience) => {
    setEditingId(experience.id);
    setFormData({
      year: experience.year,
      title: experience.title,
      company: experience.company,
      description: experience.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteDocument('experiences', id);
        toast.success('Experience deleted successfully');
        fetchExperiences();
      } catch (error) {
        toast.error('Failed to delete experience');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      year: '',
      title: '',
      company: '',
      description: ''
    });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Experiences</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Experience
        </button>
      </div>

      <div className="items-grid">
        {experiences.map((experience) => (
          <div key={experience.id} className="item-card">
            <div className="item-header">
              <h3>{experience.title}</h3>
              <div className="item-actions">
                <button onClick={() => handleEdit(experience)}>
                  <i className="bx bx-edit"></i>
                </button>
                <button onClick={() => handleDelete(experience.id)}>
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            </div>
            <p className="item-company">{experience.company}</p>
            <p className="item-year">{experience.year}</p>
            <p className="item-description">{experience.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Time Period</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="e.g. January 2022 - December 2023"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Full Stack Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. Tech Company Inc."
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your role and responsibilities..."
                  rows="5"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
```

### 4. Public Home Page (`src/pages/public/Home.jsx`)

```jsx
import { useEffect, useState } from 'react';
import Header from '../../components/public/Header';
import HomeSection from '../../components/public/HomeSection';
import ServicesSection from '../../components/public/ServicesSection';
import ResumeSection from '../../components/public/ResumeSection';
import PortfolioSection from '../../components/public/PortfolioSection';
import ContactSection from '../../components/public/ContactSection';
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
  const [data, setData] = useState({
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    socialLinks: [],
    profilePictures: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [experiences, education, skills, projects, socialLinks, profilePictures] = await Promise.all([
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header />
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
    </>
  );
};

export default Home;
```

## Quick Start Commands

```bash
# Install dependencies
npm install

# Create .env file with your Firebase config
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Notes

- All manager components follow the same pattern (CRUD operations)
- Reuse the template above for Education, Skills, Projects, Certificates, and Blogs
- Profile Picture Manager should show history and allow upload (no delete)
- Social Links Manager should mark default links as non-deletable
- Copy your original styles from V1 and adapt them for React components
- Use the constants.js file for static data

## Next Steps

1. Create remaining admin manager components
2. Create public page components (HomeSection, ServicesSection, etc.)
3. Style components using your original CSS
4. Test all CRUD operations
5. Deploy to Firebase Hosting or Vercel
