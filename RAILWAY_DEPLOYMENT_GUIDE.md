# 🚀 Railway Deployment Guide - Media Files Fix

## Current Issue
Images are not displaying in production because:
1. Railway uses ephemeral filesystem (files disappear on redeploy)
2. Need to set up persistent storage with Railway Volume
3. Ensure media URLs are correctly configured

## Step-by-Step Solution

### 1. Set Up Railway Volume for Media Persistence

#### Option A: Via Railway Dashboard (Recommended)
1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to the **"Variables"** tab
4. Click **"New Variable"** and add:
   - Key: `RAILWAY_VOLUME_MOUNT_PATH`
   - Value: `/app/media`
5. Go to the **"Settings"** tab
6. Scroll down to **"Volumes"**
7. Click **"Add Volume"**
8. Set:
   - **Volume Name**: `uniblog-media`
   - **Mount Path**: `/app/media`
   - **Size**: 1GB (or as needed)
9. Click **"Add Volume"**

#### Option B: Via Railway CLI
```bash
# Install Railway CLI if not already installed
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Add volume
railway volume create uniblog-media --mount-path /app/media --size 1
```

### 2. Redeploy Backend with Latest Changes
```bash
# Make sure all changes are committed
git add .
git commit -m "Add media debug endpoint and fix media serving"
git push origin main
```

### 3. Upload Existing Images to Production

After the volume is set up and deployed, you'll need to upload your existing images. You can:

#### Option A: Upload via Django Admin
1. Go to your production admin panel: `https://valiant-creativity-production.up.railway.app/admin/`
2. Navigate to Blogs -> Blogs
3. Edit each blog post and re-upload the images

#### Option B: Use the debug endpoint to check status
1. Visit: `https://valiant-creativity-production.up.railway.app/debug/media/`
2. This will show you what files are currently in the media directory

### 4. Test Media Serving

Run the test script:
```bash
python test_media.py
```

Or manually test:
- Visit: `https://valiant-creativity-production.up.railway.app/debug/media/`
- Try accessing an image directly: `https://valiant-creativity-production.up.railway.app/media/blog_images/ad.jpg`

### 5. Environment Variables Check

Ensure these are set in Railway backend environment:
```
BACKEND_HOST=https://valiant-creativity-production.up.railway.app
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=your-db-url
CORS_ALLOW_ALL_ORIGINS=True
```

### 6. Frontend Environment Check

Ensure frontend `.env` has:
```
VITE_API_URL="https://valiant-creativity-production.up.railway.app"
```

## 🔧 Troubleshooting

### If Images Still Don't Show:

1. **Check Volume Mount**:
   ```bash
   # SSH into your Railway container (if possible) and check:
   ls -la /app/media
   ```

2. **Check Django Media Settings**:
   - Visit: `https://valiant-creativity-production.up.railway.app/debug/media/`
   - Should show `media_root: /app/media` and list of files

3. **Check File Permissions**:
   - Ensure the volume mount has proper write permissions
   - Check Railway deployment logs for permission errors

4. **Verify Image URLs in API**:
   - Visit: `https://valiant-creativity-production.up.railway.app/blogs/blogs/`
   - Check that image URLs start with your backend domain

5. **Check Frontend Network Tab**:
   - Open browser dev tools
   - Check if image requests are getting 404 or other errors
   - Verify URLs point to backend domain

## 🎯 Alternative: Cloud Storage (Long-term solution)

For production applications, consider using:
- **AWS S3** with `django-storages`
- **Cloudinary** for image optimization
- **Railway's built-in storage** (when available)

This eliminates the need for persistent volumes and provides better performance.

## 📋 Quick Commands

```bash
# Test backend health
curl https://valiant-creativity-production.up.railway.app/health/

# Test media debug
curl https://valiant-creativity-production.up.railway.app/debug/media/

# Test sample image
curl -I https://valiant-creativity-production.up.railway.app/media/blog_images/ad.jpg
```

## ✅ Success Indicators

You'll know it's working when:
1. Debug endpoint shows your uploaded files
2. Direct image URLs return 200 status
3. Images display correctly in your frontend
4. Images persist after redeployment
