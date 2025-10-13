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
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        <Link to="/" className="view-site-btn">
          <i className="bx bx-globe"></i>
          <span>View Site</span>
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          <i className="bx bx-log-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
