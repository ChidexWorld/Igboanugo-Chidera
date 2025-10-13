# Getting Started with Portfolio V2

## Quick Start (5 Steps)

### 1. Install Dependencies

If you have network issues, try running:
```bash
cd portfolio-v2
npm install --legacy-peer-deps
```

Or install specific packages:
```bash
npm install firebase react-router-dom react-toastify boxicons
```

### 2. Setup Firebase

**Create a Firebase Project:**
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Name it "portfolio-v2"
4. Enable/disable Google Analytics (your choice)

**Enable Authentication:**
1. Go to Build > Authentication
2. Click "Get Started"
3. Enable "Email/Password"
4. Go to "Users" tab
5. Click "Add User"
6. Add your admin email and password

**Setup Firestore:**
1. Go to Build > Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your location
5. Click "Enable"

**Setup Storage:**
1. Go to Build > Storage
2. Click "Get Started"
3. Choose "Start in production mode"
4. Click "Done"

**Get Your Config:**
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the Web icon `</>`
4. Register your app
5. Copy the `firebaseConfig` object
6. Create `.env` file in portfolio-v2/:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=portfolio-v2.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=portfolio-v2
   VITE_FIREBASE_STORAGE_BUCKET=portfolio-v2.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123:web:abc
   ```

### 3. Deploy Firebase Rules

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project
# - Select your portfolio-v2 project
# - Use default files or point to firestore.rules and storage.rules

# Deploy the rules
firebase deploy --only firestore:rules,storage:rules
```

### 4. Copy Your Assets

```bash
# From your project root
cp -r assets/images/* portfolio-v2/src/assets/images/
cp -r assets/cv/* portfolio-v2/public/
```

### 5. Run the Project

```bash
cd portfolio-v2
npm run dev
```

Visit: http://localhost:5173

## What's Already Built

✅ **Core Setup:**
- React + Vite project structure
- Firebase configuration files
- Authentication context
- Firestore and Storage services
- Routing with React Router
- Loading states and error handling

✅ **Admin Features:**
- Login page (src/pages/admin/Login.jsx)
- Protected routes
- Authentication flow

✅ **Firebase Security:**
- Firestore rules (firestore.rules)
- Storage rules (storage.rules)
- Profile pictures cannot be deleted (history feature)

✅ **Constants & Data:**
- Personal information (src/utils/constants.js)
- Services offered
- Default social links
- Default education entries

✅ **Documentation:**
- README.md - Overview and setup
- PROJECT_STRUCTURE.md - Detailed architecture
- IMPLEMENTATION_GUIDE.md - Step-by-step component creation
- This file - Quick start guide

## What You Need to Build

### Admin Components (src/components/admin/):
1. Dashboard.jsx - Overview of all content
2. Sidebar.jsx - Navigation (template provided in IMPLEMENTATION_GUIDE.md)
3. ExperienceManager.jsx - CRUD for experiences (template provided)
4. EducationManager.jsx - CRUD for education
5. SkillsManager.jsx - CRUD for skills
6. ProjectsManager.jsx - CRUD for projects
7. CertificatesManager.jsx - CRUD for certificates
8. BlogsManager.jsx - CRUD for blogs
9. ProfilePictureManager.jsx - Upload & view history
10. SocialLinksManager.jsx - Manage social links

### Public Components (src/components/public/):
1. Header.jsx - Navigation header
2. HomeSection.jsx - Hero section with profile
3. ServicesSection.jsx - Services offered
4. ResumeSection.jsx - Experience, Education, Skills, About
5. PortfolioSection.jsx - Projects showcase
6. ContactSection.jsx - Contact form

### Pages (src/pages/):
1. public/Home.jsx - Main public page (template provided)
2. public/BlogList.jsx - List all blogs
3. public/BlogDetail.jsx - Single blog view
4. admin/AdminDashboard.jsx - Admin layout (template provided)

### Styling (src/assets/css/ or component CSS files):
- Copy your original styles from V1
- Create component-specific CSS files
- Adapt the styles for React components

## Testing Your Setup

### 1. Test Authentication:
```bash
# Navigate to login page
http://localhost:5173/admin/login

# Try logging in with your admin credentials
```

### 2. Test Firebase Connection:
```javascript
// In browser console after logging in:
console.log(auth.currentUser); // Should show your user
```

### 3. Test Firestore:
```javascript
// Add a test experience
// Should appear immediately if Firestore is working
```

## Common Issues & Solutions

### Issue: "Firebase config not found"
**Solution:** Make sure .env file exists and has all required variables

### Issue: "Module not found: firebase"
**Solution:** Run `npm install firebase`

### Issue: "Permission denied" in Firestore
**Solution:** Deploy firestore.rules: `firebase deploy --only firestore:rules`

### Issue: "Can't upload images"
**Solution:** Deploy storage.rules: `firebase deploy --only storage:rules`

### Issue: npm install hangs/fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try with legacy peer deps
npm install --legacy-peer-deps

# Or use yarn
npm install -g yarn
yarn install
```

## Development Workflow

1. **Start development:**
   ```bash
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Preview production build:**
   ```bash
   npm run preview
   ```

4. **Deploy to Firebase Hosting:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## File Structure Reference

```
portfolio-v2/
├── src/
│   ├── App.jsx ✅              # Main app with routing
│   ├── main.jsx ✅             # Entry point
│   ├── index.css ✅            # Global styles
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Loader.jsx ✅
│   │   │   ├── Loader.css ✅
│   │   │   └── ProtectedRoute.jsx ✅
│   │   │
│   │   ├── admin/               # ⚠️ TODO
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ExperienceManager.jsx
│   │   │   ├── EducationManager.jsx
│   │   │   ├── SkillsManager.jsx
│   │   │   ├── ProjectsManager.jsx
│   │   │   ├── CertificatesManager.jsx
│   │   │   ├── BlogsManager.jsx
│   │   │   ├── ProfilePictureManager.jsx
│   │   │   └── SocialLinksManager.jsx
│   │   │
│   │   └── public/              # ⚠️ TODO
│   │       ├── Header.jsx
│   │       ├── HomeSection.jsx
│   │       ├── ServicesSection.jsx
│   │       ├── ResumeSection.jsx
│   │       ├── PortfolioSection.jsx
│   │       └── ContactSection.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx ✅
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Login.jsx ✅
│   │   │   ├── Login.css ✅
│   │   │   └── AdminDashboard.jsx  # ⚠️ TODO
│   │   │
│   │   └── public/              # ⚠️ TODO
│   │       ├── Home.jsx
│   │       ├── BlogList.jsx
│   │       └── BlogDetail.jsx
│   │
│   ├── services/
│   │   ├── firebase.js ✅
│   │   ├── firestore.js ✅
│   │   └── storage.js ✅
│   │
│   └── utils/
│       └── constants.js ✅
│
├── firestore.rules ✅
├── storage.rules ✅
├── .env.example ✅
├── .env                       # ⚠️ You need to create this
├── package.json ✅
├── README.md ✅
├── PROJECT_STRUCTURE.md ✅
├── IMPLEMENTATION_GUIDE.md ✅
└── GETTING_STARTED.md ✅ (this file)
```

Legend:
- ✅ = Already created and ready to use
- ⚠️ TODO = You need to create these files

## Next Steps

1. **Complete the setup** by following steps 1-5 above
2. **Test the login** at `/admin/login`
3. **Create admin components** using the templates in IMPLEMENTATION_GUIDE.md
4. **Create public components** by adapting your V1 code
5. **Style everything** using your original CSS
6. **Test all CRUD operations**
7. **Deploy** to Firebase Hosting or Vercel

## Need Help?

- Check IMPLEMENTATION_GUIDE.md for detailed component examples
- Check PROJECT_STRUCTURE.md for Firebase collection structures
- Check the original portfolio (../) for styling reference
- Firebase docs: https://firebase.google.com/docs
- React Router docs: https://reactrouter.com/

## Tips

1. Start with ONE manager component (e.g., ExperienceManager)
2. Test it thoroughly before moving to the next
3. Reuse the same pattern for all other managers
4. Copy your V1 styles section by section
5. Test on mobile devices regularly
6. Use React DevTools for debugging

Good luck building your Portfolio V2! 🚀
