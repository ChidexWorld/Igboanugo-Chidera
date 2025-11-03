

# Cloudinary Image Upload Setup for BlogsManager

This project allows uploading blog cover images to **Cloudinary** and linking them to your blog posts in Firestore. This setup replaces local or Firebase storage with Cloudinary’s cloud-based image hosting.

---

## Features

* Upload blog cover images directly to Cloudinary.
* Auto-link uploaded images to blog posts.
* Images are stored securely in Cloudinary and served via CDN.
* Supports adding and editing blog posts with images.

---

## Prerequisites

* Node.js installed
* A React project (BlogsManager component)
* Firebase Firestore for blog data
* A Cloudinary account

---

## 1️⃣ Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up.
2. Go to **Dashboard** → **Account Details**.
3. Note down your:

   * **Cloud Name**
   * **API Key**
   * **API Secret** (not needed for unsigned uploads)
4. Create an **Upload Preset**:

   * Go to **Settings → Upload → Upload Presets**
   * Click **Add Upload Preset**
   * Enable **Unsigned Uploads**
   * Save the preset name (e.g., `blog_upload`)

---

## 2️⃣ Set Environment Variables

Create a `.env` file in your project root (or use `Vite`):

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=blog_upload
```

> Replace `your_cloud_name` and `blog_upload` with your actual Cloudinary values.

---

## 3️⃣ Cloudinary Upload Function

Create `services/cloudinary.js`:

```javascript
export const uploadToCloudinary = async (file, resourceType = "image") => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");

  const data = await response.json();
  return data.secure_url; // Cloud-hosted URL
};
```

---

## 4️⃣ Integrate in BlogsManager

1. Import the Cloudinary function:

```javascript
import { uploadToCloudinary } from '../../services/cloudinary';
```

2. Update your `handleSubmit` function:

```javascript
let coverImageUrl = formData.coverImage;

if (imageFile) {
  coverImageUrl = await uploadToCloudinary(imageFile);
}

const blogData = {
  ...formData,
  coverImage: coverImageUrl,
  updatedAt: new Date().toISOString(),
};
```

3. Save `blogData` to Firestore with `addDocument` or `updateDocument`.

---

## 5️⃣ Display Images in Blog

When rendering blogs, use the Cloudinary URL:

```jsx
<img src={blog.coverImage} alt={blog.title} />
```

* No local storage required.
* Cloudinary serves images via CDN for fast loading.

---

## 6️⃣ Notes

* Images are automatically hosted in Cloudinary under your account.
* You can customize upload presets for resizing, formats, or transformations.
* Cloudinary free tier includes 25,000 image transformations and 25 GB bandwidth per month.

---

## References

* [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
* [Cloudinary Unsigned Uploads](https://cloudinary.com/documentation/upload_images#unsigned_upload)


