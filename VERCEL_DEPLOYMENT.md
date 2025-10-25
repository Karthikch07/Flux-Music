# Deploying Flux Music to Vercel

## Backend Deployment (Required First)

The backend needs to be deployed separately since Vercel is optimized for frontend applications.

### Option 1: Deploy Backend to Render (Recommended - Free)

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables:
   ```
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-secret-key>
   PORT=5000
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://flux-music-api.onrender.com`)

### Option 2: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Deploy and copy your backend URL

## Frontend Deployment to Vercel

1. Go to your Vercel dashboard
2. Go to your project settings → Environment Variables
3. Add this variable:
   ```
   VITE_API_BASE_URL=<your-backend-url>/api
   ```
   Example: `VITE_API_BASE_URL=https://flux-music-api.onrender.com/api`

4. Redeploy your Vercel project

## MongoDB Setup (If not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist all IPs (0.0.0.0/0) for production or specific IPs

## Testing

After deployment:
1. Visit your Vercel URL
2. Try to register a new account
3. Login with your credentials
4. Test the music player functionality

## Troubleshooting

- **Network Error**: Check that VITE_API_BASE_URL is set correctly in Vercel
- **CORS Error**: Ensure backend CORS allows your Vercel domain
- **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
