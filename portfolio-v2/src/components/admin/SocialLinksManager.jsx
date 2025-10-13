import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import './CRUDManager.css';

const SocialLinksManager = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    order: 0
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const data = await getAllDocuments('socialLinks');
      // Sort by order
      const sorted = data.sort((a, b) => a.order - b.order);
      setSocialLinks(sorted);
    } catch (error) {
      toast.error('Failed to fetch social links');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const linkData = {
        ...formData,
        order: Number(formData.order)
      };

      if (editingId) {
        await updateDocument('socialLinks', editingId, linkData);
        toast.success('Social link updated successfully');
      } else {
        await addDocument('socialLinks', linkData);
        toast.success('Social link added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchSocialLinks();
    } catch (error) {
      toast.error('Failed to save social link');
    }
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setFormData({
      name: link.name,
      url: link.url,
      icon: link.icon,
      order: link.order
    });
    setShowModal(true);
  };

  const handleDelete = async (id, isDefault) => {
    if (isDefault) {
      toast.error('Cannot delete default social links');
      return;
    }

    if (window.confirm('Are you sure you want to delete this social link?')) {
      try {
        await deleteDocument('socialLinks', id);
        toast.success('Social link deleted successfully');
        fetchSocialLinks();
      } catch (error) {
        toast.error('Failed to delete social link');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      icon: '',
      order: 0
    });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Social Links</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Social Link
        </button>
      </div>

      {socialLinks.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-link"></i>
          <p>No social links yet. Add your first one!</p>
        </div>
      ) : (
        <div className="items-grid">
          {socialLinks.map((link) => (
            <div key={link.id} className="item-card">
              <div className="item-header">
                <h3>
                  {link.name}
                  {link.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                </h3>
                <div className="item-actions">
                  <button onClick={() => handleEdit(link)}>
                    <i className="bx bx-edit"></i>
                  </button>
                  {!link.isDefault && (
                    <button onClick={() => handleDelete(link.id, link.isDefault)}>
                      <i className="bx bx-trash"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Icon Preview */}
              <i
                className={`${link.icon} item-icon`}
                style={{ fontSize: '4rem', margin: '1.5rem 0' }}
              ></i>

              <p className="item-category">Icon: {link.icon}</p>
              <p className="item-description" style={{
                wordBreak: 'break-all',
                WebkitLineClamp: '2'
              }}>
                {link.url}
              </p>
              <p style={{
                fontSize: '1.3rem',
                color: 'var(--main-color)',
                marginTop: '1rem'
              }}>
                Order: {link.order}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Social Link' : 'Add Social Link'}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. GitHub"
                  required
                />
              </div>

              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://github.com/username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Boxicon Class *</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="e.g. bxl-github"
                  required
                />
                <p style={{
                  fontSize: '1.3rem',
                  color: 'var(--white-color)',
                  opacity: 0.6,
                  marginTop: '0.5rem'
                }}>
                  Find icons at: <a
                    href="https://boxicons.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--main-color)' }}
                  >
                    boxicons.com
                  </a>
                </p>
              </div>

              {/* Icon Preview */}
              {formData.icon && (
                <div className="form-group">
                  <label>Icon Preview</label>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'var(--bg-color)',
                    borderRadius: '0.8rem'
                  }}>
                    <i
                      className={formData.icon}
                      style={{
                        fontSize: '6rem',
                        color: 'var(--main-color)'
                      }}
                    ></i>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Order *</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: e.target.value})}
                  placeholder="0"
                  required
                  min="0"
                />
                <p style={{
                  fontSize: '1.3rem',
                  color: 'var(--white-color)',
                  opacity: 0.6,
                  marginTop: '0.5rem'
                }}>
                  Lower numbers appear first
                </p>
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

export default SocialLinksManager;
