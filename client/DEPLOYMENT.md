# Frontend Deployment Guide

This guide will help you deploy your React frontend application to various hosting platforms.

## Prerequisites

1. Your backend deployed and running (e.g., on Render)
2. Your frontend code pushed to a Git repository
3. A hosting platform account (Vercel, Netlify, or Render)

## Environment Variables

Before deploying, you need to set up environment variables for your frontend:

### Required Environment Variables:

1. **VITE_API_BASE_URL**: Your deployed backend API URL
   - For local development: `http://localhost:8000/api/v1`
   - For production: `https://your-backend-app.onrender.com/api/v1`

### Optional Environment Variables:

- **VITE_APP_NAME**: Your application name (default: "Web Wizard")
- **VITE_APP_VERSION**: Your application version (default: "1.0.0")

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Sign up/Login to Vercel**: Go to https://vercel.com
2. **Import Project**: Click "New Project" and import your Git repository
3. **Configure Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_BASE_URL` with your backend URL
5. **Deploy**: Click "Deploy"

### Option 2: Deploy to Netlify

1. **Sign up/Login to Netlify**: Go to https://netlify.com
2. **Import Project**: Click "New site from Git"
3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add `VITE_API_BASE_URL` with your backend URL
5. **Deploy**: Click "Deploy site"

### Option 3: Deploy to Render

1. **Sign up/Login to Render**: Go to https://render.com
2. **Create Static Site**: Click "New +" → "Static Site"
3. **Connect Repository**: Link your Git repository
4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. **Set Environment Variables**:
   - Add `VITE_API_BASE_URL` with your backend URL
6. **Deploy**: Click "Create Static Site"

## Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create Environment File**:
   Create a `.env.local` file in the client directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Production Build

To test your production build locally:

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Preview the Build**:
   ```bash
   npm run preview
   ```

## Important Notes

### CORS Configuration

Make sure your backend CORS is configured to allow your frontend domain:

```javascript
// In your backend app.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    // ... other CORS options
  })
);
```

Set `FRONTEND_URL` in your backend environment variables to your deployed frontend URL.

### Environment Variables

- All environment variables in Vite must be prefixed with `VITE_`
- Environment variables are embedded at build time
- Never commit `.env.local` files to your repository

### Build Optimization

The Vite configuration includes:
- Code splitting for better performance
- Terser minification
- Manual chunks for vendor libraries
- Optimized build output

## Troubleshooting

### Common Issues:

1. **API Connection Errors**: 
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check CORS configuration on backend
   - Ensure backend is deployed and accessible

2. **Build Failures**:
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check build logs for specific errors

3. **Environment Variables Not Working**:
   - Ensure variables are prefixed with `VITE_`
   - Rebuild the application after changing variables
   - Check variable names are correct

### Performance Tips:

1. **Enable Gzip Compression**: Most hosting platforms enable this automatically
2. **Use CDN**: Consider using a CDN for static assets
3. **Optimize Images**: Compress images before adding to the project
4. **Monitor Bundle Size**: Use `npm run build` to check bundle sizes

## Security Considerations

1. **Environment Variables**: Never expose sensitive data in frontend environment variables
2. **API Keys**: Keep API keys on the backend only
3. **HTTPS**: Always use HTTPS in production
4. **Content Security Policy**: Consider implementing CSP headers

## Support

- Vite Documentation: https://vitejs.dev/guide/
- Vercel Documentation: https://vercel.com/docs
- Netlify Documentation: https://docs.netlify.com/
- Render Documentation: https://render.com/docs
