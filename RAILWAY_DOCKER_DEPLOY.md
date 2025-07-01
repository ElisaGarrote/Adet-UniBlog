# Railway Deployment Guide (Dockerfile Only)

## ✅ Files Ready for Deployment:

### Backend:
- ✅ `Dockerfile` - Django backend container
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ `requirements.txt` - Python dependencies

### Frontend:
- ✅ `Dockerfile` - React frontend with Caddy server
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ `package.json` - Node.js dependencies

## 🚀 Railway Manual Setup (No railway.json):

### Backend Service Setup:
1. **Create New Service** in Railway dashboard
2. **Connect GitHub Repository**: `ElisaGarrote/Adet-UniBlog`
3. **Settings → Source:**
   - Root Directory: `backend`
   - Branch: `deploy2` (or your main branch)
4. **Settings → Deploy:**
   - Build Command: (leave empty - auto-detect Dockerfile)
   - Start Command: `python manage.py migrate && python manage.py collectstatic --noinput && gunicorn --bind 0.0.0.0:$PORT backend.wsgi:application`
5. **Settings → Variables** (set these environment variables):
   ```
   SECRET_KEY=django-insecure-m8k2p9x#v7q*w$h6n&z@t3u5r8j!c4a7f9g1s2d6k8l0m3p5
   DEBUG=False
   PGDATABASE=railway
   PGUSER=postgres
   PGPASSWORD=OHNVtyBcJzLKGBcuBiLtvGRcuUnYzEWM
   PGHOST=interchange.proxy.rlwy.net
   PGPORT=40799
   EMAIL_HOST_USER=adet.uniblog@gmail.com
   EMAIL_HOST_PASSWORD=fqppocxkdmpwdudb
   FRONTEND_RESET_URL=https://adet-uniblog-production.up.railway.app/setnewpassword
   ```

### Frontend Service Setup:
1. **Create New Service** in Railway dashboard
2. **Connect GitHub Repository**: `ElisaGarrote/Adet-UniBlog`
3. **Settings → Source:**
   - Root Directory: `frontend`
   - Branch: `deploy2` (or your main branch)
4. **Settings → Deploy:**
   - Build Command: (leave empty - auto-detect Dockerfile)
   - Start Command: `caddy run --config Caddyfile --adapter caddyfile`
5. **Settings → Variables:**
   ```
   VITE_API_URL=https://valiant-creativity-production.up.railway.app
   ```

## 🔧 Troubleshooting Tips:

### If Dockerfile Not Found:
1. Make sure Root Directory is set correctly (`backend` or `frontend`)
2. Check that Dockerfile exists in the correct folder
3. Try triggering a new deployment after pushing changes

### If Build Fails:
1. Check the deployment logs in Railway dashboard
2. Verify all environment variables are set
3. Make sure requirements.txt and package.json are up to date

### If Database Connection Fails:
1. Verify database environment variables match your Railway PostgreSQL service
2. Check that the database service is running
3. Test connection from Railway logs

## 📝 Important Notes:

- **No railway.json files** - Using Dockerfile auto-detection only
- **Environment variables must be set** in Railway dashboard, not in .env files
- **Static files** will be collected during container startup
- **Database migrations** run automatically on container startup
- **CORS** is configured for your production domains

## 🌐 Your URLs:
- **Backend**: https://valiant-creativity-production.up.railway.app
- **Frontend**: https://adet-uniblog-production.up.railway.app
- **Database**: Already deployed and configured
