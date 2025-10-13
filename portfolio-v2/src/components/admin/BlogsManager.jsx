import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import { uploadBlogImage } from '../../services/storage';
import './CRUDManager.css';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getAllDocuments('blogs');
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let coverImageUrl = formData.coverImage;

      // Upload image if a new one is selected
      if (imageFile) {
        // Generate blogId for new blogs or use existing id for updates
        const blogId = editingId || `blog_${Date.now()}`;
        coverImageUrl = await uploadBlogImage(imageFile, blogId);
      }

      const blogData = {
        ...formData,
        coverImage: coverImageUrl,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDocument('blogs', editingId, blogData);
        toast.success('Blog updated successfully');
      } else {
        blogData.createdAt = new Date().toISOString();
        await addDocument('blogs', blogData);
        toast.success('Blog added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to save blog');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      coverImage: blog.coverImage,
      published: blog.published
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDocument('blogs', id);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
      published: false
    });
    setImageFile(null);
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Manage Blogs</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="bx bx-plus"></i>
          Add Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-edit"></i>
          <p>No blogs yet. Create your first one!</p>
        </div>
      ) : (
        <div className="items-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="item-card">
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="item-image"
                />
              )}
              <div className="item-header">
                <h3>
                  {blog.title}
                  {blog.published ? (
                    <span className="published-badge">Published</span>
                  ) : (
                    <span className="draft-badge">Draft</span>
                  )}
                </h3>
                <div className="item-actions">
                  <button onClick={() => handleEdit(blog)}>
                    <i className="bx bx-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(blog.id)}>
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
              <p className="item-category">Slug: {blog.slug}</p>
              <p className="item-excerpt">{blog.excerpt}</p>
              <p className="item-content-preview">{blog.content}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Blog' : 'Add Blog'}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. My First Blog Post"
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug (Auto-generated) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="my-first-blog-post"
                  required
                />
              </div>

              <div className="form-group">
                <label>Excerpt *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="A brief summary of your blog post..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your blog content here..."
                  rows="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.coverImage && !imageFile && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={formData.coverImage}
                      alt="Current cover"
                      style={{
                        width: '100%',
                        maxHeight: '20rem',
                        objectFit: 'cover',
                        borderRadius: '0.8rem'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                />
                <label htmlFor="published">Published</label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsManager;
