# 🚀 Flux Music - Quick Reference

## Start Development

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
**Server:** http://localhost:5000
**Health:** http://localhost:5000/api/health

### Terminal 2 - Frontend
```bash
npm run dev
```
**App:** http://localhost:5173

## Common Commands

### Backend
```bash
npm run dev      # Start server with auto-reload
npm run seed     # Reset database with sample data
node test-api.js # Test all endpoints
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
```

### Database
```bash
mongosh                              # Open MongoDB shell
mongosh --eval "show dbs"            # List databases
mongosh flux-music --eval "show collections"  # Show collections
```

## API Endpoints

### Public
- `GET /api/health` - Server status
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/songs` - Get all songs
- `GET /api/songs/search?q=query` - Search

### Protected (Requires JWT Token)
- `GET /api/auth/profile` - User profile
- `POST /api/playlists` - Create playlist
- `GET /api/playlists` - Get user playlists
- `POST /api/users/like/:songId` - Like song

## Environment

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flux-music
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

## Testing with PowerShell

### Register
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
```

### Get Profile (Protected)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Get -Headers $headers
```

## Project Structure

```
flux-music/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, etc.
│   │   └── server.js     # Entry point
│   └── package.json
├── src/                  # React frontend
│   ├── components/
│   ├── context/
│   └── assets/
└── package.json
```

## Troubleshooting

### MongoDB not running
```bash
# Check status
mongosh --version

# Windows: Start service
net start MongoDB
```

### Port in use
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Reset everything
```bash
# Backend
cd backend
npm run seed

# Frontend - clear cache
npm run dev -- --force
```

## Documentation

- 📘 Complete Setup: `FULLSTACK_SETUP.md`
- 📗 Backend Docs: `backend/README.md`
- 📙 Completion Status: `BACKEND_COMPLETE.md`

## Status Check

✅ MongoDB running: `mongosh --version`
✅ Backend running: Visit http://localhost:5000/api/health
✅ Frontend running: Visit http://localhost:5173
✅ Database seeded: `npm run seed` in backend folder

---

**Quick Start:** Open 2 terminals → Run backend → Run frontend → Open browser!
