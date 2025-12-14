# Deploying AI Avatar ChatBot on Render

This guide will walk you through deploying your AI Avatar ChatBot application on Render.

## Prerequisites

1. A GitHub account
2. A Render account (sign up at https://render.com)
3. Your code pushed to GitHub

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy on Render

### Option A: Using Render Dashboard (Recommended)

1. **Log in to Render**
   - Go to https://render.com
   - Sign in or create an account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Repository**
   - Connect your GitHub account if not already connected
   - Select your repository: `halyapabba2014-creator/AI_Avatar_ChatBot`

4. **Configure Service**
   - **Name**: `ai-avatar-chatbot` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically:
     - Install dependencies
     - Build your application
     - Deploy it

6. **Get Your URL**
   - Once deployed, you'll get a URL like: `https://ai-avatar-chatbot.onrender.com`
   - Your app is now live!

### Option B: Using Static Site (Alternative - Simpler)

If you prefer a simpler static site deployment:

1. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"

2. **Connect Repository**
   - Select your repository

3. **Configure**
   - **Name**: `ai-avatar-chatbot`
   - **Build Command**: Leave empty
   - **Publish Directory**: `.` (current directory)

4. **Deploy**
   - Click "Create Static Site"

**Note**: Static Site option is simpler but the Node.js server option gives you more control and better performance.

## Step 3: Environment Variables (Optional)

If you need to set environment variables (like API keys):

1. Go to your service on Render
2. Click "Environment" tab
3. Add environment variables:
   - `NODE_ENV=production`
   - Add any other variables you need

**Important**: For security, don't hardcode API keys in your code. Use environment variables instead.

## Step 4: Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Follow Render's DNS instructions

## Troubleshooting

### Build Fails
- Check that `package.json` exists
- Verify `server.js` is in the root directory
- Check build logs in Render dashboard

### App Not Loading
- Check the service logs in Render dashboard
- Verify all files are in the repository
- Make sure `index.html` is in the root

### API Errors
- Check browser console for CORS errors
- Verify API keys are correct
- Check that external APIs allow requests from your Render domain

## Updating Your App

Every time you push to GitHub:
1. Render automatically detects the push
2. Rebuilds and redeploys your app
3. Your changes go live automatically!

## Render Free Tier Limits

- **Free tier includes**:
  - 750 hours/month (enough for 24/7 operation)
  - Automatic SSL certificates
  - Custom domains
  - Auto-deploy from GitHub

- **Limitations**:
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down may be slow (cold start)
  - Consider upgrading for production use

## Support

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- Render Community: https://community.render.com

---

Your app should now be live on Render! 🎉

