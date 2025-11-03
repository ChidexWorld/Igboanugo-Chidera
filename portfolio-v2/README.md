# Portfolio V2 - React + Firebase + Cloudinary

A modern, dynamic portfolio website built with **React**, **Firebase**, and **Cloudinary**, featuring a full-featured **admin panel** and secure backend contact system.

---

## Features

### Public Features

* Fully **responsive** and modern design
* Dynamic content served from **Firebase**
* Smooth **animated sections**
* **Blog system** with CRUD support
* **Contact form** handled via secure backend API
* **Profile picture history** with Cloudinary uploads
* Fast load times with **lazy loading** and **code splitting**

### Admin Features

* **Secure authentication** via Firebase
* Full **CRUD operations** for:

  * Experiences
  * Education
  * Skills
  * Projects
  * Certificates
  * Blogs
  * Profile pictures (with history, uploaded to Cloudinary)
  * Social links
* Real-time updates via Firebase
* **Image uploads** to Cloudinary or Firebase Storage
* Admin dashboard for easy management

---

## Tech Stack

* **Frontend:** React 19, Vite 7
* **Backend:** Node.js + Express (for contact form)
* **Database:** Firebase Firestore
* **Storage:** Cloudinary + Firebase Storage
* **Routing:** React Router DOM 7
* **Styling:** Custom CSS
* **Icons:** Boxicons
* **Notifications:** React Toastify

---

## Project Structure

```
portfolio-v2/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable components
│   │   ├── admin/       # Admin panel components
│   │   ├── public/      # Public-facing components
│   │   └── common/      # Shared components
│   ├── context/         # React Context (Auth)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   ├── services/        # Firebase & Cloudinary services
│   └── utils/           # Helper functions and constants
├── backend/             # Express backend for contact form
│   └── index.js
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
└── .env.example         # Environment variables template
```

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repo-url>
cd portfolio-v2
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Create **Firestore Database**
4. Enable **Storage** (optional for additional images)
5. Copy your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 3. Cloudinary Setup (for Profile Pictures)

1. Create a Cloudinary account: [https://cloudinary.com/](https://cloudinary.com/)
2. Get your **Cloud Name, API Key, and API Secret**
3. Add to `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> Admin panel uploads profile pictures directly to Cloudinary using the upload preset.

---

### 4. Backend Setup (Contact Form)

1. Create a simple **Express server**:

```js
// backend/index.js
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Message from ${name}`,
      text: message
    });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

app.listen(process.env.PORT || 5000, () => console.log('Server running...'));
```

2. Add backend environment variables in `.env`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
PORT=5000
```

3. Run backend server:

```bash
cd backend
npm install
node index.js
```

> The contact form on your frontend should now POST to `http://localhost:5000/api/contact`.

---

### 5. Admin User

In Firebase Console > Authentication > Add User:

* Email: [your-admin@example.com](mailto:your-admin@example.com)
* Password: YourSecurePassword123!

---

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## Deployment

* **Frontend**: Firebase Hosting, Vercel, or Netlify
* **Backend**: Vercel, Render, or Railway
* **Cloudinary**: Host images in the cloud

---

## Performance & Security

* **Lazy loading** for routes
* **Code splitting** for faster bundles
* Firebase authentication and **security rules**
* Cloudinary **secure uploads** with presets
* Backend **contact API** hides email credentials
* Profile pictures **cannot be deleted** (history feature)

---

## Contributing

1. Fork the repository
2. Set up Firebase, Cloudinary, and backend
3. Update `constants.js` with your info
4. Customize styles and content

---

## License

MIT License

---

## Contact

* **Name:** Igboanugo Chidera Goodness
* **Email:** [chiderastanley272@gmail.com](mailto:chiderastanley272@gmail.com)
* **GitHub:** [ChidexWorld](https://github.com/ChidexWorld/)
* **LinkedIn:** [chidexstanley](https://www.linkedin.com/in/chidexstanley/)

---

## Acknowledgments

* React, Firebase, Node.js, Cloudinary
* Boxicons & Google Fonts (Poppins)

---

✅ This update ensures **dynamic image uploads** via Cloudinary and a **secure backend contact system**, making Portfolio V2 fully dynamic and professional.
