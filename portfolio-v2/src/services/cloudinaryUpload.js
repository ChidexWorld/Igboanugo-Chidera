// services/storage.js
import { toast } from "react-toastify";
import { addDocument, getAllDocuments } from "./firestore";

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder in Cloudinary
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadToCloudinary = async (file, folder = "") => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (folder) formData.append("folder", folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, { method: "POST", body: formData });

    if (!response.ok) throw new Error("Cloudinary upload failed");

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    toast.error("Failed to upload file");
    throw error;
  }
};

// ===== Profile Picture =====
export const uploadProfilePicture = async (file) => {
  const downloadURL = await uploadToCloudinary(file, "profile-pictures");

  // Save metadata to Firestore for history
  await addDocument("profilePictures", {
    url: downloadURL,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  });

  return downloadURL;
};

// ===== Project Image =====
export const uploadProjectImage = async (file, projectId) => {
  return uploadToCloudinary(file, `projects/${projectId}`);
};

// ===== Blog Image =====
export const uploadBlogImage = async (file, blogId) => {
  return uploadToCloudinary(file, `blogs/${blogId}`);
};

// ===== Certificate =====
export const uploadCertificate = async (file) => {
  return uploadToCloudinary(file, "certificates");
};

// ===== Profile Picture History (from Firestore) =====
export const getProfilePictureHistory = async () => {
  try {
    const data = await getAllDocuments("profilePictures");
    return data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  } catch (error) {
    console.error("Error fetching profile picture history:", error);
    throw error;
  }
};
