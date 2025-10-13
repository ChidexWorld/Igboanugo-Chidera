import { useState } from 'react';
import {
  uploadProfilePicture,
  uploadProjectImage,
  uploadBlogImage,
  uploadCertificate
} from '../services/storage';

/**
 * Custom hook for file uploads to Firebase Storage
 * @param {string} uploadType - Type of upload: 'profile', 'project', 'blog', 'certificate'
 * @returns {Object} { upload, uploading, progress, error, downloadURL }
 */
export const useStorage = (uploadType) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const upload = async (file, additionalData = {}) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      let url;

      switch (uploadType) {
        case 'profile':
          url = await uploadProfilePicture(file);
          break;
        case 'project':
          url = await uploadProjectImage(file, additionalData.projectId);
          break;
        case 'blog':
          url = await uploadBlogImage(file, additionalData.blogId);
          break;
        case 'certificate':
          url = await uploadCertificate(file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      setDownloadURL(url);
      setProgress(100);
      return url;
    } catch (err) {
      setError(err.message || 'Upload failed');
      console.error('Upload error:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error, downloadURL };
};

export default useStorage;
