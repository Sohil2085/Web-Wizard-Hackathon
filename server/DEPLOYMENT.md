# Backend Deployment Guide for Render

This guide will help you deploy your backend application to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A MongoDB Atlas account (for production database)
3. Your backend code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Environment Variables

The application now automatically detects the environment and configures CORS accordingly. However, you can still set these environment variables for custom configuration:

### Required Environment Variables:

1. **MONGODB_URI**: Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net`
   - Get this from your MongoDB Atlas dashboard

2. **ACCESS_TOKEN_SECRET**: A secure random string for JWT access tokens
   - Generate a strong random string (at least 32 characters)
   - Example: `your-super-secure-access-token-secret-here`

3. **REFRESH_TOKEN_SECRET**: A secure random string for JWT refresh tokens
   - Generate a different strong random string (at least 32 characters)
   - Example: `your-super-secure-refresh-token-secret-here`

4. **FRONTEND_URL**: Your frontend application URL (Optional - auto-detected)
   - If deploying frontend to Vercel: `https://your-frontend-app.vercel.app`
   - If deploying frontend to Netlify: `https://your-frontend-app.netlify.app`
   - If deploying frontend to Render: `https://your-frontend-app.onrender.com`
   - If using a custom domain: `https://yourdomain.com`

### Optional Environment Variables:

- **PORT**: Usually set automatically by Render (default: 10000)
- **NODE_ENV**: Set to `production` (already configured in render.yaml)

## Automatic Environment Detection

The application now includes automatic environment detection:

### Backend Features:
- **Auto CORS Configuration**: Automatically allows common development and production origins
- **Environment Logging**: Logs environment information for debugging
- **Smart Origin Detection**: Supports localhost, Vercel, Netlify, and Render deployments

### Frontend Features:
- **Auto API URL Detection**: Automatically uses localhost for development, production URL for deployment
- **Environment Logging**: Logs environment information in development mode
- **Smart URL Resolution**: Detects deployment platform and uses appropriate backend URL

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to a Git repository
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect the `render.yaml` file
5. Review the configuration and click "Apply"

### Option B: Manual Setup

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `web-wizard-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

4. Add environment variables in the "Environment" section
5. Click "Create Web Service"

## Step 3: Configure Environment Variables

In your Render service dashboard:

1. Go to "Environment" tab
2. Add each environment variable:
   - Click "Add Environment Variable"
   - Enter the key and value
   - Mark sensitive variables (like secrets) as "Secret"

## Step 4: Deploy and Test

1. Render will automatically build and deploy your application
2. Monitor the deployment logs for any errors
3. Once deployed, test the health endpoint: `https://your-app.onrender.com/health`
4. Test your API endpoints to ensure they're working correctly

## Step 5: Update Frontend Configuration

Update your frontend's API configuration to point to your deployed backend:

```javascript
// In your frontend api.js or similar file
const API_BASE_URL = 'https://your-backend-app.onrender.com/api/v1';
```

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Database Connection Issues**: Verify your MongoDB URI is correct
3. **CORS Errors**: 
   - Ensure `FRONTEND_URL` is set correctly in your backend environment variables
   - The backend now supports multiple origins (localhost for development + production URL)
   - Check that your frontend URL matches exactly (including https/http and trailing slashes)
4. **Health Check Failures**: Verify the `/health` endpoint is accessible

### Logs:

- Check deployment logs in Render dashboard
- Use `render logs` CLI command if you have Render CLI installed

## Security Notes

- Never commit `.env` files to your repository
- Use strong, unique secrets for JWT tokens
- Ensure your MongoDB Atlas database has proper security settings
- Consider using Render's automatic HTTPS (enabled by default)

## Scaling

- Free tier has limitations (sleeps after inactivity)
- Consider upgrading to paid plans for production use
- Monitor your application performance in Render dashboard

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
