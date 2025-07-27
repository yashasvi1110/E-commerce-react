# Deploying to Render

This guide will help you deploy your e-commerce app to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free at render.com)
3. Your code pushed to a GitHub repository

## Step 1: Prepare Your Repository

1. Make sure all your changes are committed and pushed to GitHub
2. Ensure your repository structure looks like this:
   ```
   your-repo/
   ├── src/                    # Frontend React code
   ├── backend/                # Backend Node.js code
   ├── package.json           # Frontend dependencies
   ├── backend/package.json   # Backend dependencies
   ├── render.yaml            # Render configuration
   └── README.md
   ```

## Step 2: Deploy Backend First

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `ecommerce-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: `5000`
   - `CORS_ORIGIN`: Leave empty for now (we'll update after frontend deployment)

6. Click "Create Web Service"
7. Wait for deployment to complete and note the URL (e.g., `https://ecommerce-backend.onrender.com`)

## Step 3: Deploy Frontend

1. In Render, click "New +" and select "Static Site"
2. Connect the same GitHub repository
3. Configure the frontend service:
   - **Name**: `ecommerce-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://ecommerce-backend.onrender.com` (use your backend URL)

5. Click "Create Static Site"
6. Wait for deployment to complete

## Step 4: Update Backend CORS

1. Go back to your backend service in Render
2. Go to "Environment" tab
3. Update the `CORS_ORIGIN` variable to your frontend URL:
   - `CORS_ORIGIN`: `https://ecommerce-frontend.onrender.com`
4. Click "Save Changes"
5. The service will automatically redeploy

## Step 5: Test Your Deployment

1. Visit your frontend URL: `https://ecommerce-frontend.onrender.com`
2. Test the following features:
   - Browsing products
   - Adding items to cart
   - User registration/login
   - Placing orders
   - Order history

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check the build logs in Render
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**:
   - Verify the `REACT_APP_API_URL` environment variable is set correctly
   - Check that the backend is running and accessible
   - Ensure CORS is properly configured

3. **Environment Variables**:
   - Make sure all required environment variables are set in Render
   - Check that variable names match exactly (case-sensitive)

### Useful Commands:

```bash
# Test backend locally
cd backend
npm install
npm start

# Test frontend locally
npm install
npm start

# Build frontend locally
npm run build
```

## Environment Variables Reference

### Backend Variables:
- `NODE_ENV`: `production`
- `JWT_SECRET`: Secure random string for JWT tokens
- `PORT`: `5000` (Render will override this)
- `CORS_ORIGIN`: Your frontend URL

### Frontend Variables:
- `REACT_APP_API_URL`: Your backend URL

## Support

If you encounter issues:
1. Check Render's deployment logs
2. Verify all environment variables are set
3. Test locally first
4. Check the Render documentation: https://render.com/docs 