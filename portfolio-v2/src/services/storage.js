import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase';
import { addDocument } from './firestore';

export const uploadProfilePicture = async (file) => {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `profile-pictures/${timestamp}-${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save to Firestore for history
    await addDocument('profilePictures', {
      url: downloadURL,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      path: snapshot.ref.fullPath
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export const uploadProjectImage = async (file, projectId) => {
  try {
    const storageRef = ref(storage, `projects/${projectId}/${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading project image:', error);
    throw error;
  }
};

export const uploadBlogImage = async (file, blogId) => {
  try {
    const storageRef = ref(storage, `blogs/${blogId}/${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

export const uploadCertificate = async (file) => {
  try {
    const storageRef = ref(storage, `certificates/${Date.now()}-${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading certificate:', error);
    throw error;
  }
};

export const getProfilePictureHistory = async () => {
  try {
    const listRef = ref(storage, 'profile-pictures');
    const result = await listAll(listRef);

    const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
    const urls = await Promise.all(urlPromises);

    return urls;
  } catch (error) {
    console.error('Error getting profile picture history:', error);
    throw error;
  }
};
