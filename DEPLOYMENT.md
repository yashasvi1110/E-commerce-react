# Deployment Guide for Render

## Prerequisites
- GitHub account with your code pushed
- Render account (free at render.com)

## Step 1: Deploy Backend

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `fruitables-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your-super-secret-jwt-key-change-this-in-production`
   - `CORS_ORIGIN`: `https://your-frontend-app-name.onrender.com` (we'll update this after frontend deployment)
   - `DB_HOST`: `localhost` (for now, we'll use mock data)
   - `DB_USER`: `root`
   - `DB_PASSWORD`: (leave empty for now)
   - `DB_NAME`: `fruitables_db`

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the URL (e.g., `https://fruitables-backend.onrender.com`)

## Step 2: Deploy Frontend

1. In Render dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the frontend service:
   - **Name**: `fruitables-frontend` (or your preferred name)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-app-name.onrender.com` (use the URL from step 1)

5. Click "Create Static Site"
6. Wait for deployment to complete

## Step 3: Update CORS Origin

1. Go back to your backend service in Render
2. Go to "Environment" tab
3. Update `CORS_ORIGIN` to your frontend URL: `https://your-frontend-app-name.onrender.com`
4. Click "Save Changes"
5. The service will automatically redeploy

## Step 4: Test Your Application

1. Visit your frontend URL
2. Test the signup/login functionality
3. Test adding items to cart
4. Test the checkout process

## Troubleshooting

### If you get CORS errors:
- Make sure `CORS_ORIGIN` in backend matches your frontend URL exactly
- Check that the backend URL in frontend environment variables is correct

### If authentication doesn't work:
- Check that JWT_SECRET is set in backend environment variables
- Verify the API endpoints are working by visiting `https://your-backend-url/api/health`

### If build fails:
- Check that all dependencies are in package.json
- Verify Node.js version compatibility

## Database Setup (Optional)

For production, you can:
1. Use a cloud database like PlanetScale, Railway, or AWS RDS
2. Update the database environment variables in your backend service
3. Uncomment the database initialization code in server.js

## Custom Domain (Optional)

1. In your Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain and follow the DNS configuration instructions 