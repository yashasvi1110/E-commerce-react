# Deploying to Render - Complete Guide

This guide will help you deploy your entire e-commerce app (frontend + backend) to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free at render.com)
3. Your code pushed to a GitHub repository

## Repository Structure

Ensure your repository looks like this:
```
your-repo/
├── src/                    # Frontend React code
├── backend/                # Backend Node.js code
├── package.json           # Frontend dependencies
├── backend/package.json   # Backend dependencies
├── render.yaml            # Render configuration
├── build.sh               # Build script (optional)
└── README.md
```

## Step 1: Deploy Backend First

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
   - `JWT_SECRET`: Generate a secure random string (e.g., `my-super-secret-jwt-key-2024`)
   - `PORT`: `5000`
   - `CORS_ORIGIN`: Leave empty for now (we'll update after frontend deployment)

6. Click "Create Web Service"
7. Wait for deployment to complete and note the URL (e.g., `https://ecommerce-backend.onrender.com`)

## Step 2: Deploy Frontend

1. In Render, click "New +" and select "Static Site"
2. Connect the same GitHub repository
3. Configure the frontend service:
   - **Name**: `ecommerce-frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://ecommerce-backend.onrender.com` (use your backend URL)
   - `NODE_VERSION`: `18`

5. Click "Create Static Site"
6. Wait for deployment to complete

## Step 3: Update Backend CORS

1. Go back to your backend service in Render
2. Go to "Environment" tab
3. Update the `CORS_ORIGIN` variable to your frontend URL:
   - `CORS_ORIGIN`: `https://ecommerce-frontend.onrender.com`
4. Click "Save Changes"
5. The service will automatically redeploy

## Step 4: Test Your Deployment

1. Visit your frontend URL: `https://ecommerce-frontend.onrender.com`
2. Test the following features:
   - Browsing products
   - Adding items to cart
   - User registration/login
   - Placing orders
   - Order history
   - Subscription model

## Alternative: Use render.yaml for Automated Deployment

If you want to deploy both services at once using the `render.yaml` file:

1. In Render, click "New +" and select "Blueprint"
2. Connect your GitHub repository
3. Render will automatically detect the `render.yaml` file
4. Click "Apply" to deploy both services simultaneously

## Environment Variables Reference

### Backend Variables:
- `NODE_ENV`: `production`
- `JWT_SECRET`: Secure random string for JWT tokens
- `PORT`: `5000` (Render will override this)
- `CORS_ORIGIN`: Your frontend URL

### Frontend Variables:
- `REACT_APP_API_URL`: Your backend URL
- `NODE_VERSION`: `18` (recommended)

## Troubleshooting

### Common Issues:

1. **Build Failures - "react-scripts: not found"**:
   - **Solution**: Use `npm ci` instead of `npm install` in build command
   - **Alternative**: Ensure `react-scripts` is in dependencies (not devDependencies)
   - **Check**: Verify package.json has correct dependencies

2. **Node.js Version Issues**:
   - **Solution**: Set `NODE_VERSION` environment variable to `18`
   - **Check**: Ensure your package.json has `engines` field specified

3. **API Connection Issues**:
   - **Verify**: The `REACT_APP_API_URL` environment variable is set correctly
   - **Check**: That the backend is running and accessible
   - **Ensure**: CORS is properly configured

4. **Environment Variables**:
   - **Make sure**: All required environment variables are set in Render
   - **Check**: That variable names match exactly (case-sensitive)

5. **Frontend Routing Issues**:
   - **Ensure**: The `netlify.toml` file is present for proper routing
   - **Check**: That all routes are working correctly

### Build Command Troubleshooting:

If you encounter build issues, try these build commands in order:

1. **Recommended**: `npm ci && npm run build`
2. **Alternative 1**: `npm install && npm run build`
3. **Alternative 2**: `yarn install && yarn build` (if using yarn)

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

# Clean install (recommended for production)
npm ci
npm run build
```

## Performance Optimization

1. **Enable Caching**: Render automatically caches static assets
2. **CDN**: Render provides global CDN for faster loading
3. **Auto-scaling**: Free tier includes basic auto-scaling

## Monitoring

1. **Logs**: Check deployment and runtime logs in Render dashboard
2. **Metrics**: Monitor performance and usage in the dashboard
3. **Alerts**: Set up notifications for deployment status

## Support

If you encounter issues:
1. Check Render's deployment logs
2. Verify all environment variables are set
3. Test locally first
4. Check the Render documentation: https://render.com/docs
5. Contact Render support if needed

## Cost

- **Free Tier**: Both services are free with some limitations
- **Paid Plans**: Available for higher performance and features
- **Bandwidth**: Free tier includes generous bandwidth limits 