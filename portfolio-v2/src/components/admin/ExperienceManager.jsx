import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import '../../styles/components/admin/CRUDManager.css';

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

      {experiences.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-briefcase"></i>
          <p>No experiences yet. Add your first one!</p>
        </div>
      ) : (
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
      )}

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
                <label>Time Period *</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="e.g. January 2022 - December 2023"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Full Stack Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. Tech Company Inc."
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
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
