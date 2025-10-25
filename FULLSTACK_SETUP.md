# 🎵 Flux Music - Full-Stack Setup Guide

Complete guide to set up and run the Flux Music full-stack application (React + Node.js + MongoDB).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (for local development) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

## 🗂️ Project Structure

```
flux-music/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Authentication middleware
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API routes
│   │   ├── scripts/     # Utility scripts (seed data)
│   │   └── server.js    # Main server file
│   ├── .env             # Environment variables (create this)
│   ├── .env.example     # Environment template
│   └── package.json     # Backend dependencies
├── src/                 # React frontend
│   ├── components/
│   ├── context/
│   ├── assets/
│   └── ...
├── package.json         # Frontend dependencies
└── README.md           # This file
```

## 🚀 Quick Start

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer with default settings
3. MongoDB will auto-start as a Windows service on port 27017

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Verify MongoDB is running:**
```bash
mongosh
```
(You should see MongoDB shell prompt. Type `exit` to quit)

### Step 2: Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

4. **Edit `.env` file with your configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flux-music
JWT_SECRET=your_super_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:5173
```

5. **Seed the database (optional but recommended):**
```bash
npm run seed
```
This will populate your database with sample songs.

6. **Start the backend server:**
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📦 Database: flux-music
🎵 Flux Music API server running on port 5000
```

### Step 3: Frontend Setup

1. **Open a new terminal** (keep backend running in the other terminal)

2. **Navigate to project root:**
```bash
cd ..
```
(You should be in the `flux-music` folder, not `backend`)

3. **Install frontend dependencies:**
```bash
npm install
```

4. **Start the frontend development server:**
```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Application

1. **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser
2. **Backend API:** Backend runs on [http://localhost:5000](http://localhost:5000)
3. **Health Check:** Visit [http://localhost:5000/api/health](http://localhost:5000/api/health)

## 🧪 Testing the Full Stack

### 1. Test Backend API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Save the `token` from the response - you'll need it for protected routes!

### 2. Test Frontend Features

- ✅ **Play music** - Click on any song
- ✅ **Search** - Click search icon or navigate to `/search`
- ✅ **Create playlist** - Click "Create Playlist" in sidebar (requires backend integration)
- ✅ **Like songs** - Click heart icon (requires backend integration)
- ✅ **User authentication** - Register/Login (requires frontend integration)

## 🔗 Connecting Frontend to Backend

To fully integrate the frontend with the backend, you'll need to:

### 1. Install axios in frontend:
```bash
npm install axios
```

### 2. Create an API service file:

Create `src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

### 3. Use API in components:

```javascript
import api from './services/api';

// Register user
const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.data.token);
    return response.data;
};

// Create playlist
const createPlaylist = async (playlistData) => {
    const response = await api.post('/playlists', playlistData);
    return response.data;
};
```

## 📚 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get single song
- `GET /api/songs/search?q=query` - Search songs

### Playlists (All Protected)
- `GET /api/playlists` - Get user's playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Users (All Protected)
- `POST /api/users/like/:songId` - Like/Unlike song
- `GET /api/users/liked-songs` - Get liked songs

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: connect ECONNREFUSED`
- **Solution:** Ensure MongoDB is running. Check with `mongosh` command.

**Windows:** Start MongoDB service:
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

### Port Already in Use

**Error:** `Port 5000 is already in use`
- **Solution:** Kill the process or change PORT in `.env`:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Solution:** Ensure backend CORS is configured for `http://localhost:5173`
- Check `FRONTEND_URL` in `.env` matches your frontend URL

### Frontend Not Loading

1. Clear browser cache
2. Check console for errors (F12)
3. Verify `npm run dev` is running without errors
4. Try a different browser

## 📝 Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start production server
npm run seed     # Seed database with sample data
```

## 🚀 Production Deployment

### Backend (Vercel/Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy!

### Frontend (Vercel/Netlify)
1. Run `npm run build`
2. Deploy `dist` folder
3. Set API base URL to production backend

## 🎯 Next Steps

Now that your full-stack app is running:

1. **Implement authentication UI** - Create login/register forms in React
2. **Connect playlist creation** - Link frontend buttons to backend API
3. **Add liked songs feature** - Implement heart icon functionality
4. **User profiles** - Display user info and playlists
5. **File upload** - Add ability to upload songs (use multer)
6. **Search integration** - Connect search to backend API

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [JWT Best Practices](https://jwt.io/introduction)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT

---

**Happy Coding! 🎵✨**
