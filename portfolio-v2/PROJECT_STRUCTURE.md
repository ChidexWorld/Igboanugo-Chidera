# Portfolio V2 - React + Firebase

## Project Structure

```
portfolio-v2/
├── public/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   └── images/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── public/          # Public-facing components
│   │   │   ├── HomeSection.jsx
│   │   │   ├── ServicesSection.jsx
│   │   │   ├── ResumeSection.jsx
│   │   │   ├── PortfolioSection.jsx
│   │   │   └── ContactSection.jsx
│   │   └── admin/           # Admin panel components
│   │       ├── Dashboard.jsx
│   │       ├── Sidebar.jsx
│   │       ├── ExperienceManager.jsx
│   │       ├── EducationManager.jsx
│   │       ├── SkillsManager.jsx
│   │       ├── ProjectsManager.jsx
│   │       ├── CertificatesManager.jsx
│   │       ├── BlogsManager.jsx
│   │       ├── ProfilePictureManager.jsx
│   │       └── SocialLinksManager.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useFirestore.js
│   │   └── useStorage.js
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── BlogList.jsx
│   │   │   └── BlogDetail.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       └── AdminDashboard.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── firestore.js
│   │   └── cloudinaryUpload.js
│   │   utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── .gitignore
├── firestore.rules
├── storage.rules
├── package.json
└── vite.config.js
```

## Firebase Collections Structure

### 1. `experiences`
```javascript
{
  id: auto-generated,
  year: "October 2021 - December 2021",
  title: "Computer Teacher",
  company: "The Light Of God Int'l School, Onitsha",
  description: "...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. `education`
```javascript
{
  id: auto-generated,
  year: "October 2021 - August 2025",
  degree: "BSc. Computer Science",
  institution: "Nnamdi Azikiwe University (UNIZIK)",
  description: "...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. `skills`
```javascript
{
  id: auto-generated,
  name: "React.js",
  icon: "bxl-react", // Boxicons class
  category: "frontend", // frontend, backend, tools
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. `projects`
```javascript
{
  id: auto-generated,
  number: "01",
  title: "CHRISTMAS",
  description: "...",
  technologies: ["REACT", "TAILWINDCSS"],
  liveUrl: "https://...",
  githubUrl: "https://...",
  imageUrl: "...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. `certificates`
```javascript
{
  id: auto-generated,
  title: "Full Stack Web Developer",
  issuer: "Innovation Growth Hub",
  date: "November 2024",
  imageUrl: "...",
  credentialUrl: "...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 6. `blogs`
```javascript
{
  id: auto-generated,
  title: "Blog Title",
  slug: "blog-title",
  content: "...", // Rich text or Markdown
  excerpt: "Short description...",
  coverImage: "...",
  author: "Chidex World",
  published: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7. `socialLinks`
```javascript
{
  id: auto-generated,
  name: "GitHub",
  url: "https://github.com/ChidexWorld/",
  icon: "bxl-github",
  order: 1,
  isDefault: true, // true for original links
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 8. `profilePictures`
```javascript
{
  id: auto-generated,
  url: "...",
  fileName: "...",
  uploadedAt: "...",
  path: "...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 9. `contactSubmissions`
```javascript
{
  id: auto-generated,
  name: "...",
  email: "...",
  phone: "...",
  subject: "...",
  message: "...",
  read: false,
  createdAt: timestamp
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd portfolio-v2
npm install
```

### 2. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Storage
5. Copy your Firebase config
6. Create `.env` file from `.env.example` and add your config

### 3. Deploy Firebase Rules
```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 4. Create Admin User
```bash
# Go to Firebase Console > Authentication > Add User
# Email: your-email@example.com
# Password: your-secure-password
```

### 5. Run Development Server
```bash
npm run dev
```

## Features

### Public Pages
- ✅ Home page with animated header
- ✅ Services section
- ✅ Resume section (Experience, Education, Skills, About)
- ✅ Portfolio section with projects
- ✅ Contact form
- ✅ Blog listing and detail pages
- ✅ Responsive design
- ✅ Fast loading with lazy loading

### Admin Panel
- ✅ Secure login
- ✅ Dashboard overview
- ✅ CRUD for Experiences
- ✅ CRUD for Education
- ✅ CRUD for Skills
- ✅ CRUD for Projects
- ✅ CRUD for Certificates
- ✅ CRUD for Blogs (with rich text editor)
- ✅ Profile picture management with history
- ✅ Social links management
- ✅ View contact form submissions

## Constant Data

The following data is constant and defined in `src/utils/constants.js`:
- Personal information (Name, Email, Phone, etc.)
- Default social links (GitHub, LinkedIn, Discord, WhatsApp)
- Services offered
- About me text

Admins can ADD to these but the original data remains as a baseline.

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder or connect GitHub repo
```

## Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Technologies Used

- React 19
- Vite 7
- Firebase 11 (Auth, Firestore, Storage)
- React Router DOM 7
- React Toastify
- Boxicons

## Design Principles

1. **Maintain Original Design**: Keep the visual style from V1
2. **Improve Performance**: Code splitting, lazy loading, optimized images
3. **Responsive**: Mobile-first approach
4. **Accessible**: Semantic HTML, ARIA labels
5. **SEO-Friendly**: Meta tags, structured data
6. **Secure**: Firebase rules, admin-only access

## Notes

- Profile pictures are NEVER deleted, only new ones are added (history feature)
- Default social links and education entries are constant
- Admin can add more entries but originals remain
- All public data is cached for better performance
- Contact form submissions are stored in Firestore
