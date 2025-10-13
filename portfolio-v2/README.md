# Portfolio V2 - React + Firebase

A modern, dynamic portfolio website built with React and Firebase, featuring a comprehensive admin panel for content management.

## Features

### Public Features
- Modern, responsive design
- Dynamic content from Firebase
- Animated sections
- Blog system
- Contact form
- Profile picture history
- Fast loading with lazy loading and code splitting

### Admin Features
- Secure authentication
- Full CRUD operations for:
  - Experiences
  - Education
  - Skills
  - Projects
  - Certificates
  - Blogs
  - Profile pictures (with history)
  - Social links
- Real-time updates
- Image upload to Firebase Storage

## Tech Stack

- **Frontend**: React 19, Vite 7
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router DOM 7
- **Styling**: Custom CSS
- **Icons**: Boxicons
- **Notifications**: React Toastify

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
│   ├── services/        # Firebase services
│   └── utils/           # Helper functions and constants
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
└── .env.example         # Environment variables template
```

## Setup Instructions

### 1. Clone and Install

```bash
cd portfolio-v2
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage
5. Copy your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

### 4. Create Admin User

In Firebase Console > Authentication > Add User:
- Email: your-admin@example.com
- Password: YourSecurePassword123!

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## Admin Panel Access

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Access the dashboard at `/admin/dashboard`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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

1. Build the project: `npm run build`
2. Upload the `dist/` folder or connect GitHub repo

## Environment Variables

Required environment variables (see `.env.example`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Security

- Firebase Authentication for admin access
- Firestore security rules protect data
- Storage rules prevent unauthorized uploads
- Profile pictures cannot be deleted (history feature)
- Environment variables for sensitive data

## Performance Optimizations

- Lazy loading for routes
- Code splitting
- Image optimization
- Firebase caching
- Memoization for expensive operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a personal portfolio project. If you'd like to use it as a template:

1. Fork the repository
2. Create your Firebase project
3. Update constants.js with your information
4. Customize styles and content

## License

MIT License - feel free to use this as a template for your own portfolio!

## Contact

- **Name**: Igboanugo Chidera Goodness
- **Email**: chiderastanley272@gmail.com
- **GitHub**: [ChidexWorld](https://github.com/ChidexWorld/)
- **LinkedIn**: [chidexstanley](https://www.linkedin.com/in/chidexstanley/)

## Acknowledgments

- Built with React and Firebase
- Icons from Boxicons
- Font from Google Fonts (Poppins)

---

For detailed implementation instructions, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

For project structure details, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
