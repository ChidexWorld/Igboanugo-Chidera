import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllDocuments } from '../../services/firestore';
import { uploadProfilePicture } from '../../services/storage';
import './CRUDManager.css';

const ProfilePictureManager = () => {
  const [profilePictures, setProfilePictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProfilePictures();
  }, []);

  const fetchProfilePictures = async () => {
    try {
      const data = await getAllDocuments('profilePictures');
      // Sort by uploadedAt descending (newest first)
      const sorted = data.sort((a, b) =>
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setProfilePictures(sorted);
    } catch (error) {
      toast.error('Failed to fetch profile pictures');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image to upload');
      return;
    }

    setUploading(true);
    try {
      await uploadProfilePicture(imageFile);
      toast.success('Profile picture uploaded successfully');
      setImageFile(null);
      setPreviewUrl(null);
      fetchProfilePictures();

      // Reset file input
      document.getElementById('profile-pic-input').value = '';
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Profile Picture Manager</h2>
      </div>

      {/* Upload Form */}
      <div className="item-card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '2rem', color: 'var(--white-color)' }}>
          Upload New Profile Picture
        </h3>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Select Image *</label>
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {previewUrl && (
            <div className="form-group">
              <label>Preview</label>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  maxWidth: '30rem',
                  height: '30rem',
                  objectFit: 'cover',
                  borderRadius: '1rem',
                  border: '0.2rem solid var(--main-color)'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="add-btn"
            disabled={uploading}
            style={{ marginTop: '1.5rem' }}
          >
            <i className="bx bx-upload"></i>
            {uploading ? 'Uploading...' : 'Upload Picture'}
          </button>
        </form>
      </div>

      {/* Profile Pictures History */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '2.5rem', color: 'var(--white-color)', marginBottom: '2rem' }}>
          Profile Picture History
        </h3>
        <p style={{ fontSize: '1.4rem', color: 'var(--white-color)', opacity: 0.7, marginBottom: '2rem' }}>
          All uploaded profile pictures are stored here for history. The most recent is marked as current.
        </p>
      </div>

      {profilePictures.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-image"></i>
          <p>No profile pictures yet. Upload your first one!</p>
        </div>
      ) : (
        <div className="profile-history-grid">
          {profilePictures.map((picture, index) => (
            <div key={picture.id} className="profile-pic-card">
              <img src={picture.url} alt={`Profile ${index + 1}`} />
              <div className="profile-pic-overlay">
                <p>
                  {index === 0 && (
                    <span className="current-badge">Current</span>
                  )}
                </p>
                <p>{formatDate(picture.uploadedAt)}</p>
                <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>
                  {picture.fileName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureManager;
