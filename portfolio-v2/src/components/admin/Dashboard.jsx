import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getExperiences,
  getEducation,
  getSkills,
  getProjects,
  getCertificates,
  getBlogs,
  getSocialLinks,
  getProfilePictures
} from '../../services/firestore';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    experiences: 0,
    education: 0,
    skills: 0,
    projects: 0,
    certificates: 0,
    blogs: 0,
    socialLinks: 0,
    profilePictures: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        experiences,
        education,
        skills,
        projects,
        certificates,
        blogs,
        socialLinks,
        profilePictures
      ] = await Promise.all([
        getExperiences(),
        getEducation(),
        getSkills(),
        getProjects(),
        getCertificates(),
        getBlogs(),
        getSocialLinks(),
        getProfilePictures()
      ]);

      setStats({
        experiences: experiences.length,
        education: education.length,
        skills: skills.length,
        projects: projects.length,
        certificates: certificates.length,
        blogs: blogs.length,
        socialLinks: socialLinks.length,
        profilePictures: profilePictures.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Experiences',
      count: stats.experiences,
      icon: 'bx-briefcase',
      color: '#ff1493',
      path: '/admin/experiences'
    },
    {
      title: 'Education',
      count: stats.education,
      icon: 'bx-book',
      color: '#00d4ff',
      path: '/admin/education'
    },
    {
      title: 'Skills',
      count: stats.skills,
      icon: 'bx-code-alt',
      color: '#ffa500',
      path: '/admin/skills'
    },
    {
      title: 'Projects',
      count: stats.projects,
      icon: 'bx-folder',
      color: '#7fff00',
      path: '/admin/projects'
    },
    {
      title: 'Certificates',
      count: stats.certificates,
      icon: 'bx-award',
      color: '#ff6347',
      path: '/admin/certificates'
    },
    {
      title: 'Blogs',
      count: stats.blogs,
      icon: 'bx-edit',
      color: '#9370db',
      path: '/admin/blogs'
    },
    {
      title: 'Social Links',
      count: stats.socialLinks,
      icon: 'bx-link',
      color: '#20b2aa',
      path: '/admin/social-links'
    },
    {
      title: 'Profile Pictures',
      count: stats.profilePictures,
      icon: 'bx-image',
      color: '#ff69b4',
      path: '/admin/profile-picture'
    }
  ];

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Portfolio V2 Admin Panel</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div
            key={card.title}
            className="stat-card"
            onClick={() => navigate(card.path)}
            style={{ borderTop: `0.4rem solid ${card.color}` }}
          >
            <div className="stat-icon" style={{ color: card.color }}>
              <i className={`bx ${card.icon}`}></i>
            </div>
            <div className="stat-info">
              <h3>{card.count}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button onClick={() => navigate('/admin/experiences')} className="action-btn">
            <i className="bx bx-plus"></i>
            Add Experience
          </button>
          <button onClick={() => navigate('/admin/projects')} className="action-btn">
            <i className="bx bx-plus"></i>
            Add Project
          </button>
          <button onClick={() => navigate('/admin/blogs')} className="action-btn">
            <i className="bx bx-plus"></i>
            Create Blog
          </button>
          <button onClick={() => navigate('/')} className="action-btn view-site">
            <i className="bx bx-globe"></i>
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
