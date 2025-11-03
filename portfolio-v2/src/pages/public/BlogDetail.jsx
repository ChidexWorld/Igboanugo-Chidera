import React, { useState, useEffect } from 'react';
import { useParams,  Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Header from '../../components/public/Header';
import Loader from '../../components/common/Loader';
import '../../styles/pages/public/BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  // const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Blog post not found');
          return;
        }

        const blogDoc = querySnapshot.docs[0];
        const blogData = {
          id: blogDoc.id,
          ...blogDoc.data()
        };

        // Check if blog is published
        if (!blogData.published) {
          setError('This blog post is not available');
          return;
        }

        setBlog(blogData);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

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

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <Header />
        <main className="blog-detail-container">
          <div className="blog-not-found">
            <i className="bx bx-error-circle"></i>
            <h2>404 - Blog Not Found</h2>
            <p>{error || 'The blog post you are looking for does not exist.'}</p>
            <div className="blog-not-found-actions">
              <Link to="/blogs" className="btn">
                Browse All Blogs
              </Link>
              <Link to="/" className="btn-outline">
                Go to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <Header />
      <main className="blog-detail-container">
        <div className="blog-detail-header">
          <Link to="/blogs" className="back-link">
            <i className="bx bx-arrow-back"></i>
            Back to Blogs
          </Link>
        </div>

        <article className="blog-detail-content">
          {blog.coverImage && (
            <div className="blog-cover-image">
              <img src={blog.coverImage} alt={blog.title} />
            </div>
          )}

          <div className="blog-meta">
            <div className="blog-date">
              <i className="bx bx-calendar"></i>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <div className="blog-updated">
                <i className="bx bx-edit"></i>
                <span>Updated: {formatDate(blog.updatedAt)}</span>
              </div>
            )}
          </div>

          <h1 className="blog-title">{blog.title}</h1>

          {blog.excerpt && (
            <p className="blog-excerpt">{blog.excerpt}</p>
          )}

          <div
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="blog-footer">
            <Link to="/blogs" className="btn">
              <i className="bx bx-book-open"></i>
              Read More Blogs
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
