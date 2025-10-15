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
import ContactMessagesManager from '../../components/admin/ContactMessagesManager';
import '../../styles/pages/admin/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
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
          <Route path="messages" element={<ContactMessagesManager />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
