import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import { uploadProjectImage } from '../../services/cloudinaryUpload';
import '../../styles/components/admin/CRUDManager.css';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    images: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllDocuments('projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return;
      }
    }

    setUploading(true);
    try {
      const projectId = editingId || `project-${Date.now()}`;
      const uploadPromises = files.map(file => uploadProjectImage(file, projectId));
      const imageUrls = await Promise.all(uploadPromises);

      setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
            console.log(error);

    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
    toast.info('Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert technologies string to array
    const projectData = {
      ...formData,
      number: parseInt(formData.number),
      technologies: formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)
    };

    try {
      if (editingId) {
        await updateDocument('projects', editingId, projectData);
        toast.success('Project updated successfully');
      } else {
        await addDocument('projects', projectData);
        toast.success('Project added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
            console.log(error);

    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      number: project.number.toString(),
      title: project.title,
      description: project.description,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : project.technologies,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      images: project.images || (project.imageUrl ? [project.imageUrl] : [])
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDocument('projects', id);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
              console.log(error);

      }
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      images: []
    });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Projects</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-folder"></i>
          <p>No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="items-grid">
          {projects.map((project) => (
            <div key={project.id} className="item-card">
              {(project.images && project.images.length > 0) ? (
                <img src={project.images[0]} alt={project.title} className="item-image" />
              ) : project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="item-image" />
              ) : null}
              <div className="item-header">
                <h3>
                  {project.number}. {project.title}
                </h3>
                <div className="item-actions">
                  <button onClick={() => handleEdit(project)}>
                    <i className="bx bx-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(project.id)}>
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
              <p className="item-description">{project.description}</p>
              {project.technologies && (
                <div className="item-tech">
                  {(Array.isArray(project.technologies) ? project.technologies : [project.technologies]).map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              )}
              <div className="item-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <i className="bx bx-link-external"></i>
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-github"></i>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Number *</label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                  placeholder="e.g. 1"
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. E-commerce Platform"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project..."
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Technologies * (comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="e.g. React, Node.js, MongoDB"
                  required
                />
              </div>

              <div className="form-group">
                <label>Project Images (Multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p style={{ fontSize: '1.4rem', color: 'var(--main-color)', marginTop: '0.5rem' }}>Uploading...</p>}
                {formData.images && formData.images.length > 0 && (
                  <div style={{
                    marginTop: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '1rem'
                  }}>
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={imageUrl}
                          alt={`Project preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '0.8rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'var(--main-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '2.5rem',
                            height: '2.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.6rem'
                          }}
                        >
                          <i className="bx bx-x"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={uploading}>
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

export default ProjectsManager;
