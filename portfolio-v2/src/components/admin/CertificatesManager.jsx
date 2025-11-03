import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../services/firestore";
import { uploadCertificate } from "../../services/cloudinaryUpload";
import "../../styles/components/admin/CRUDManager.css";

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    imageUrl: "",
    credentialUrl: "",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await getAllDocuments("certificates");
      setCertificates(data);
    } catch (error) {
      toast.error("Failed to fetch certificates");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadCertificate(file);
      setFormData({ ...formData, imageUrl });
      toast.success("Certificate image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload certificate image");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateDocument("certificates", editingId, formData);
        toast.success("Certificate updated successfully");
      } else {
        await addDocument("certificates", formData);
        toast.success("Certificate added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchCertificates();
    } catch (error) {
      toast.error("Failed to save certificate");
      console.log(error);
    }
  };

  const handleEdit = (certificate) => {
    setEditingId(certificate.id);
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      imageUrl: certificate.imageUrl || "",
      credentialUrl: certificate.credentialUrl || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        await deleteDocument("certificates", id);
        toast.success("Certificate deleted successfully");
        fetchCertificates();
      } catch (error) {
        toast.error("Failed to delete certificate");
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      date: "",
      imageUrl: "",
      credentialUrl: "",
    });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Certificates</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Certificate
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="empty-state">
          <i className="bx bxs-award"></i>
          <p>No certificates yet. Add your first one!</p>
        </div>
      ) : (
        <div className="items-grid">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="item-card">
              {certificate.imageUrl && (
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  className="item-image"
                />
              )}
              <div className="item-header">
                <h3>{certificate.title}</h3>
                <div className="item-actions">
                  <button onClick={() => handleEdit(certificate)}>
                    <i className="bx bx-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(certificate.id)}>
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
              <p className="item-issuer">{certificate.issuer}</p>
              <p className="item-date">{certificate.date}</p>
              {certificate.credentialUrl && (
                <div className="item-links">
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bx bx-link-external"></i>
                    View Credential
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Edit Certificate" : "Add Certificate"}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Certificate Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. AWS Certified Solutions Architect"
                  required
                />
              </div>

              <div className="form-group">
                <label>Issuer *</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) =>
                    setFormData({ ...formData, issuer: e.target.value })
                  }
                  placeholder="e.g. Amazon Web Services"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="e.g. January 2024 or 2024"
                  required
                />
              </div>

              <div className="form-group">
                <label>Certificate Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <p
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--main-color)",
                      marginTop: "0.5rem",
                    }}
                  >
                    Uploading...
                  </p>
                )}
                {formData.imageUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <img
                      src={formData.imageUrl}
                      alt="Certificate preview"
                      style={{
                        width: "100%",
                        maxHeight: "20rem",
                        objectFit: "cover",
                        borderRadius: "0.8rem",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Credential URL</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, credentialUrl: e.target.value })
                  }
                  placeholder="https://credential-url.com"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={uploading}>
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesManager;
