import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Header from '../../components/public/Header';
import Loader from '../../components/common/Loader';
import '../../styles/pages/public/BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const blogsRef = collection(db, 'blogs');
        const q = query(
          blogsRef,
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setBlogs(blogsData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="blog-list-page">
      <Header />
      <main className="blog-list-container">
        <div className="blog-list-header">
          <Link to="/" className="back-link">
            <i className="bx bx-arrow-back"></i>
            Back to Home
          </Link>
          <h1 className="heading">
            My <span>Blog</span>
          </h1>
          <p className="blog-list-description">
            Thoughts, tutorials, and insights about web development, design, and technology.
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {!error && blogs.length === 0 && (
          <div className="no-blogs">
            <i className="bx bx-book-open"></i>
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        )}

        {!error && blogs.length > 0 && (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="blog-card"
              >
                <div className="blog-card-image">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} />
                  ) : (
                    <div className="blog-card-placeholder">
                      <i className="bx bx-image-alt"></i>
                    </div>
                  )}
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-date">
                    <i className="bx bx-calendar"></i>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <h3 className="blog-card-title">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                  )}
                  <div className="blog-card-footer">
                    <span className="read-more">
                      Read More <i className="bx bx-right-arrow-alt"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogList;
