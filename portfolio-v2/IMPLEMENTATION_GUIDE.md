# Portfolio V2 - Complete Implementation Guide 

## Table of Contents

1. [Project Setup](#project-setup)
2. [Firebase & Cloudinary Configuration](#firebase--cloudinary-configuration)
3. [Remaining Components to Create](#remaining-components-to-create)
4. [Admin Dashboard Implementation](#admin-dashboard-implementation)
5. [Public Pages Implementation](#public-pages-implementation)
6. [Styling Guide](#styling-guide)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Project Setup

### 1. Install Dependencies

```bash
cd portfolio-v2
npm install
```

### 2. Copy your assets

```bash
# Copy images from your V1 portfolio
cp -r ../assets/images/* src/assets/images/
```

---

## Firebase & Cloudinary Configuration

### Step 1: Create Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Create a new project named "portfolio-v2"
3. Enable Google Analytics (optional)

### Step 2: Enable Authentication

1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Add your admin email

### Step 3: Create Firestore Database

1. Go to Firestore Database
2. Create database in production mode
3. Deploy the firestore.rules file:

   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 4: Cloudinary Setup (Replacing Firebase Storage)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Create an **unsigned upload preset**
3. Copy your **Cloud Name, API Key, API Secret**
4. Create a service file: `src/services/cloudinary.js` to handle uploads
5. Replace all image uploads in Projects, Certificates, and Profile Pictures with Cloudinary calls

### Step 5: Environment Variables

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

VITE_BACKEND_EMAIL_API_URL=https://your-backend.com/send-email
```

> **Note:** EmailJS is replaced by your own backend email API. Contact form in `ContactSection` should post to `VITE_BACKEND_EMAIL_API_URL`.

### Step 6: Create Admin User

```bash
# In Firebase Console > Authentication > Add User
Email: your-admin@example.com
Password: YourSecurePassword123!
```

---

## Remaining Components to Create

### 1. Admin Dashboard (`src/pages/admin/AdminDashboard.jsx`)

* Same structure as before
* Routes to all manager components

### 2. Sidebar Component (`src/components/admin/Sidebar.jsx`)

* Unchanged

### 3. CRUD Manager Template

* Same template for Experience, Education, Skills, Blogs
* **Update Projects, Certificates, Profile Picture managers to use Cloudinary**
* Example service usage:

```js
// src/services/cloudinary.js
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
    { method: 'POST', body: formData }
  );
  const data = await response.json();
  return data.secure_url;
};
```

### 4. Public Home Page (`src/pages/public/Home.jsx`)

* Fetches all data from Firestore
* Images now load from Cloudinary URLs
* Contact form posts to backend email API

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Create .env file with Firebase and Cloudinary config
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## Notes

* Projects, Certificates, Profile Pictures now **use Cloudinary** for storage and delivery
* Contact form uses **backend email API** instead of EmailJS
* All other CRUD operations remain the same
* Default items (Education, Social Links) are protected
* `constants.js` still holds static info (Services, Bio, Socials)

---

## Next Steps

1. Create remaining admin manager components with Cloudinary integration
2. Update public page components to fetch Cloudinary URLs
3. Test uploads, profile picture history, contact form emails
4. Style components using your original CSS
5. Deploy to Firebase Hosting or Vercel

