# Flux Music Backend API

Backend server for Flux Music streaming application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication**: JWT-based user authentication with bcrypt password hashing
- **User Management**: User profiles, liked songs, playlists
- **Playlist Management**: Create, read, update, delete playlists
- **Song Management**: CRUD operations for songs, play count tracking
- **Search**: Search songs by name, artist, or album
- **Protected Routes**: Secure API endpoints with JWT middleware

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (installed locally or MongoDB Atlas account)
- npm or yarn

## 🛠️ Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flux-music
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
```

## 🏃‍♂️ Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Song Routes (`/api/songs`)
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get single song
- `GET /api/songs/search?q=query` - Search songs
- `POST /api/songs/:id/play` - Increment play count
- `POST /api/songs` - Create song (Protected)
- `PUT /api/songs/:id` - Update song (Protected)
- `DELETE /api/songs/:id` - Delete song (Protected)

### Playlist Routes (`/api/playlists`) - All Protected
- `GET /api/playlists` - Get user's playlists
- `GET /api/playlists/:id` - Get single playlist
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### User Routes (`/api/users`) - All Protected
- `POST /api/users/like/:songId` - Like/Unlike song
- `GET /api/users/liked-songs` - Get liked songs

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📦 Database Models

### User
- username (unique)
- email (unique)
- password (hashed)
- playlists (array of ObjectIds)
- likedSongs (array of ObjectIds)
- isPremium (boolean)
- profileImage (string)

### Song
- name
- desc
- album
- artist
- image
- file
- duration
- plays
- uploadedBy

### Playlist
- name
- description
- user (ObjectId ref)
- songs (array of ObjectIds)
- coverImage
- isPublic

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Protected routes middleware
- Input validation

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/flux-music |
| JWT_SECRET | Secret key for JWT | Required |
| FRONTEND_URL | Frontend application URL | http://localhost:5173 |

## 🚨 Error Handling

The API uses consistent error response format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

## 📄 License

MIT
