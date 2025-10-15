import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import '../../styles/components/admin/CRUDManager.css';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    category: 'frontend'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getAllDocuments('skills');
      setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateDocument('skills', editingId, formData);
        toast.success('Skill updated successfully');
      } else {
        await addDocument('skills', formData);
        toast.success('Skill added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchSkills();
    } catch (error) {
      toast.error('Failed to save skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      icon: skill.icon,
      category: skill.category
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteDocument('skills', id);
        toast.success('Skill deleted successfully');
        fetchSkills();
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      category: 'frontend'
    });
    setEditingId(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'frontend':
        return '#ff1493';
      case 'backend':
        return '#00ff00';
      case 'tools':
        return '#00bfff';
      default:
        return '#ff1493';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Skills</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-code-block"></i>
          <p>No skills yet. Add your first one!</p>
        </div>
      ) : (
        <div className="items-grid">
          {skills.map((skill) => (
            <div key={skill.id} className="item-card">
              <div className="item-header">
                <h3>{skill.name}</h3>
                <div className="item-actions">
                  <button onClick={() => handleEdit(skill)}>
                    <i className="bx bx-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(skill.id)}>
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
              <i
                className={`${skill.icon} item-icon`}
                style={{ color: getCategoryColor(skill.category) }}
              ></i>
              <p className="item-category" style={{ color: getCategoryColor(skill.category) }}>
                {skill.category.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Skill' : 'Add Skill'}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. React"
                  required
                />
              </div>

              <div className="form-group">
                <label>Icon Class *</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="e.g. bxl-react (from boxicons)"
                  required
                />
                <small style={{ fontSize: '1.3rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem', display: 'block' }}>
                  Visit <a href="https://boxicons.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--main-color)' }}>boxicons.com</a> for icon classes
                </small>
              </div>

              {formData.icon && (
                <div className="form-group">
                  <label>Icon Preview</label>
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <i
                      className={`${formData.icon}`}
                      style={{
                        fontSize: '6rem',
                        color: getCategoryColor(formData.category)
                      }}
                    ></i>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="tools">Tools</option>
                </select>
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

export default SkillsManager;
