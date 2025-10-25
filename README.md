<# 🎵 Flux Music - Full-Stack Music Streaming App

A modern, full-stack music streaming web application built with React, Node.js, Express, and MongoDB. Experience seamless music playback with user authentication, playlists, and an intuitive interface inspired by modern streaming platforms.

![Flux Music Logo](src/assets/FluxMusic_logo.png)

## ✨ Features

### Frontend
- 🎶 **Interactive Music Player** - Play, pause, next, previous, shuffle, loop
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices  
- 🎨 **Dynamic Backgrounds** - Album-specific gradient backgrounds
- 🏠 **Home Dashboard** - Browse featured charts and trending playlists
- 💿 **Album Detail Pages** - View album information and track listings
- 🔍 **Search Functionality** - Search songs by name, artist, or album
- 🎵 **Global Audio Context** - State management for music player
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

### Backend
- � **User Authentication** - JWT-based secure authentication
- 👤 **User Profiles** - Personalized user accounts
- 📝 **Playlist Management** - Create, edit, delete playlists
- ❤️ **Liked Songs** - Save favorite tracks
- 📊 **Play Count Tracking** - Track song popularity
- 🔒 **Protected Routes** - Secure API endpoints
- 🗄️ **MongoDB Database** - Persistent data storage

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19.x with JSX
- **Styling**: Tailwind CSS 4.x
- **Build Tool**: Vite 7.x  
- **Routing**: React Router DOM 7.x
- **State Management**: React Context API
- **Audio**: HTML5 Audio API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose 8.x
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Security**: CORS, dotenv
- **Dev Tools**: Nodemon for hot reload

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (installed locally or MongoDB Atlas account)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Karthikch07/Flux-Music.git
   cd Flux-Music
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   copy .env.example .env    # Windows
   # OR
   cp .env.example .env      # Mac/Linux
   
   # Edit .env with your MongoDB URI and JWT secret
   # Then seed the database
   npm run seed
   
   # Start backend server
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd ..  # Back to project root
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

📘 **For detailed setup instructions, see [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)**

## 📁 Project Structure

```
flux-music/
├── backend/                 # Node.js/Express Backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── playlist.controller.js
│   │   │   ├── song.controller.js
│   │   │   └── user.controller.js
│   │   ├── models/         # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Playlist.js
│   │   │   └── Song.js
│   │   ├── routes/         # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── playlist.routes.js
│   │   │   ├── song.routes.js
│   │   │   └── user.routes.js
│   │   ├── middleware/     # Auth middleware
│   │   │   └── auth.js
│   │   ├── scripts/        # Utility scripts
│   │   │   └── seed.js
│   │   └── server.js       # Main server file
│   ├── .env               # Environment variables
│   └── package.json
├── src/                    # React Frontend
│   ├── assets/            # Images, icons, and audio files
│   ├── components/        # React components
│   │   ├── Display.jsx
│   │   ├── DisplayHome.jsx
│   │   ├── DisplayAlbum.jsx
│   │   ├── Search.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Player.jsx
│   │   ├── AlbumItem.jsx
│   │   └── SongItem.jsx
│   ├── context/           # React Context
│   │   └── PlayerContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── FULLSTACK_SETUP.md     # Detailed setup guide
├── QUICK_REFERENCE.md     # Quick commands reference
├── BACKEND_COMPLETE.md    # Backend documentation
├── package.json
└── vite.config.js
```

## 🎮 Usage

### Frontend
1. **Browse Music**: Explore featured charts and trending playlists on the home page
2. **Search**: Click search icon to find songs by name, artist, or album
3. **View Albums**: Click on any album to see detailed track listings
4. **Play Music**: Click songs to play, use bottom player controls
5. **Player Controls**: Play, pause, next, previous, shuffle, loop

### Backend API
Visit http://localhost:5000/api/health to check server status

#### Authentication
```bash
# Register
POST /api/auth/register
{
  "username": "user",
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Playlists (Protected)
```bash
# Create playlist
POST /api/playlists
Authorization: Bearer YOUR_JWT_TOKEN
{
  "name": "My Playlist",
  "description": "My favorite songs"
}
```

📚 **See [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md) for full API documentation**

## 🎨 Components Overview

### Frontend Components
- **Display**: Main content area with routing and dynamic backgrounds
- **Sidebar**: Navigation menu with home, search, and playlist options
- **Player**: Bottom music player with shuffle, loop, and playback controls
- **Navbar**: Top navigation with back/forward buttons
- **Search**: Search page with live filtering
- **Album/Song Items**: Reusable cards for displaying music content

### Backend Architecture
- **Controllers**: Handle business logic for auth, playlists, songs, users
- **Models**: MongoDB schemas with Mongoose
- **Routes**: RESTful API endpoints
- **Middleware**: JWT authentication and authorization
- **Config**: Database connection and environment setup

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start server with auto-reload (nodemon)
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## 🌟 Key Features Implemented

### Frontend Features
- ✅ Music player with play/pause/next/previous
- ✅ Shuffle and loop modes
- ✅ Search functionality with live filtering
- ✅ Dynamic routing (home, albums, search)
- ✅ Time tracking and progress display
- ✅ Responsive grid layouts
- ✅ Album-specific gradient backgrounds
- ✅ Global state management with Context API

### Backend Features
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Playlist CRUD operations
- ✅ Song management
- ✅ Like/unlike songs
- ✅ Play count tracking
- ✅ Search API endpoint
- ✅ Database seeding script
- ✅ MongoDB integration

## 🎯 Future Enhancements

- [ ] Frontend authentication UI (login/register forms)
- [ ] Connect frontend to backend APIs
- [ ] Real-time playlist updates
- [ ] User profile pages
- [ ] Upload song functionality
- [ ] Music visualization
- [ ] Social features (follow users, share playlists)
- [ ] Dark/light theme toggle
- [ ] Mobile app (React Native)
- [ ] Admin dashboard

## 📱 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update profile (Protected)

### Songs (`/api/songs`)
- `GET /` - Get all songs
- `GET /:id` - Get single song
- `GET /search?q=query` - Search songs
- `POST /:id/play` - Increment play count
- `POST /` - Create song (Protected)
- `PUT /:id` - Update song (Protected)
- `DELETE /:id` - Delete song (Protected)

### Playlists (`/api/playlists`) - All Protected
- `GET /` - Get user playlists
- `GET /:id` - Get single playlist
- `POST /` - Create playlist
- `PUT /:id` - Update playlist
- `DELETE /:id` - Delete playlist
- `POST /:id/songs` - Add song to playlist
- `DELETE /:id/songs/:songId` - Remove song from playlist

### Users (`/api/users`) - All Protected
- `POST /like/:songId` - Like/unlike song
- `GET /liked-songs` - Get liked songs

## 📚 Documentation

- 📘 **[FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)** - Complete setup guide for both frontend and backend
- 📗 **[backend/README.md](backend/README.md)** - Backend-specific documentation
- 📙 **[BACKEND_COMPLETE.md](BACKEND_COMPLETE.md)** - Backend completion status and architecture
- 📝 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference for development

## 📱 Screenshots

*Add screenshots of your app here showing the home page, album view, and player interface*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Karthik** - [GitHub Profile](https://github.com/Karthikch07)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the fast build tool
- All contributors who help improve this project

---

⭐ **Star this repository if you found it helpful!**

🐛 **Found a bug?** [Open an issue](https://github.com/Karthikch07/Flux-Music/issues)

💡 **Have a feature request?** [Start a discussion](https://github.com/Karthikch07/Flux-Music/discussions)EAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Flux-Music
>>>>>>> 780bb1b333f7dabc8edf137853b587d17782ece3
