# Railway Deployment Guide for UniBlog

## Prerequisites
- Railway account
- GitHub repository with your code
- PostgreSQL database already deployed on Railway

## Environment Variables

### Backend Service (valiant-creativity-production.up.railway.app)

Set these environment variables in your Railway backend service:

```
SECRET_KEY=your-secret-key-here-make-it-long-and-random
DEBUG=False
PGDATABASE=railway
PGUSER=postgres
PGPASSWORD=OHNVtyBcJzLKGBcuBiLtvGRcuUnYzEWM
PGHOST=interchange.proxy.rlwy.net
PGPORT=40799
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_RESET_URL=https://adet-uniblog-production.up.railway.app/setnewpassword
CORS_ALLOW_ALL_ORIGINS=False
```

### Frontend Service (adet-uniblog-production.up.railway.app)

Set this environment variable in your Railway frontend service:

```
VITE_API_URL=https://valiant-creativity-production.up.railway.app
```

## Deployment Steps

### 1. Backend Deployment
1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Select the `backend` folder as the root directory
4. Railway will automatically detect the Dockerfile
5. Set the environment variables listed above
6. Deploy the service

### 2. Frontend Deployment
1. Create a new service in Railway
2. Connect the same GitHub repository
3. Select the `frontend` folder as the root directory
4. Railway will automatically detect the Dockerfile
5. Set the VITE_API_URL environment variable
6. Deploy the service

### 3. Database Setup
Since your PostgreSQL database is already deployed, make sure the backend can connect to it with the credentials provided.

## Important Notes

### CORS Configuration
The backend is configured to allow requests from:
- https://adet-uniblog-production.up.railway.app (production frontend)
- http://localhost:5173 (local development)

### Static Files
The backend is configured to serve static files from `/static/` URL path and collect them in the `staticfiles` directory.

### Media Files
Media files are configured to be served from `/media/` URL path. In production, you might want to use a cloud storage service like AWS S3 or Cloudinary.

### Email Configuration
Make sure to set up your Gmail app password for the email functionality (password reset).

### Security
- Never commit your `.env` file with actual secrets
- Use strong, unique SECRET_KEY in production
- Set DEBUG=False in production

## Testing the Deployment

1. Check if the backend is working by visiting: `https://valiant-creativity-production.up.railway.app/admin/`
2. Check if the frontend is working by visiting: `https://adet-uniblog-production.up.railway.app`
3. Test the API endpoints to ensure frontend-backend communication works

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure the frontend URL is added to CORS_ALLOWED_ORIGINS
2. **Database connection errors**: Verify the database environment variables
3. **Static files not loading**: Run `python manage.py collectstatic` during deployment
4. **Environment variables not working**: Make sure they're set in the Railway dashboard

### Logs:
Check the deployment logs in Railway dashboard for any error messages during build or runtime.
