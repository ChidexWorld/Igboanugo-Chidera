import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import '../../styles/components/admin/CRUDManager.css';

const EducationManager = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    degree: '',
    institution: '',
    description: ''
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const data = await getAllDocuments('education');
      setEducations(data);
    } catch (error) {
      toast.error('Failed to fetch education entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateDocument('education', editingId, formData);
        toast.success('Education updated successfully');
      } else {
        await addDocument('education', formData);
        toast.success('Education added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchEducations();
    } catch (error) {
      toast.error('Failed to save education');
    }
  };

  const handleEdit = (education) => {
    setEditingId(education.id);
    setFormData({
      year: education.year,
      degree: education.degree,
      institution: education.institution,
      description: education.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteDocument('education', id);
        toast.success('Education deleted successfully');
        fetchEducations();
      } catch (error) {
        toast.error('Failed to delete education');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      year: '',
      degree: '',
      institution: '',
      description: ''
    });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Education</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="empty-state">
          <i className="bx bxs-graduation"></i>
          <p>No education entries yet. Add your first one!</p>
        </div>
      ) : (
        <div className="items-grid">
          {educations.map((education) => (
            <div key={education.id} className="item-card">
              <div className="item-header">
                <h3>
                  {education.degree}
                  {education.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                </h3>
                <div className="item-actions">
                  <button onClick={() => handleEdit(education)}>
                    <i className="bx bx-edit"></i>
                  </button>
                  {!education.isDefault && (
                    <button onClick={() => handleDelete(education.id)}>
                      <i className="bx bx-trash"></i>
                    </button>
                  )}
                </div>
              </div>
              <p className="item-institution">{education.institution}</p>
              <p className="item-year">{education.year}</p>
              <p className="item-description">{education.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Education' : 'Add Education'}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Year/Period *</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="e.g. 2018 - 2022"
                  required
                />
              </div>

              <div className="form-group">
                <label>Degree/Certificate *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>Institution *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  placeholder="e.g. University of Technology"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your education, achievements, or relevant coursework..."
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

export default EducationManager;
