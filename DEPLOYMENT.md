# Flux Music - Deployment Guide

## Important: Backend Setup Required

This application requires a backend API to function. The frontend alone cannot work without the backend.

### Option 1: Deploy Backend Separately (Recommended for Vercel)

1. **Deploy Backend to a Node.js hosting service** (Heroku, Railway, Render, etc.)
   - The backend folder contains a complete Node.js/Express API
   - Requires MongoDB database (use MongoDB Atlas for cloud hosting)
   
2. **Set Environment Variables in Vercel:**
   - `VITE_API_URL` = Your deployed backend URL (e.g., `https://your-backend.herokuapp.com/api`)

### Option 2: Run Locally Only

If deploying to Vercel for frontend only:
- The app will show network errors because there's no backend
- Backend requires MongoDB which Vercel doesn't support natively

### Local Development

1. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running locally
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend runs on http://localhost:5000

3. **Start Frontend:**
   ```bash
   npm install
   npm run dev
   ```
   Frontend runs on http://localhost:5173

### Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api  # For local development
# or
VITE_API_URL=https://your-backend-url.com/api  # For production
```

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/flux-music  # For local
# or
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/flux-music  # For production
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Current Deployment Status

- ✅ Frontend builds successfully
- ❌ Backend requires separate deployment
- ❌ MongoDB connection needed

To fix "Network Error" on Vercel, you must:
1. Deploy the backend separately
2. Configure VITE_API_URL environment variable in Vercel to point to your backend

---

**Note:** This is a full-stack application. Deploying only the frontend will result in network errors.
