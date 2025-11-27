# GlucoNova Deployment Guide

## Prerequisites

Before deploying, ensure you have:
1. A Railway account (railway.app)
2. Railway CLI installed (`npm install -g @railway/cli`)
3. This project's codebase

## Deployment Steps

### 1. Login to Railway
```bash
railway login
```

### 2. Create a New Project
```bash
railway init
```
When prompted, give your project a name like "GlucoNova".

### 3. Provision a PostgreSQL Database
In the Railway dashboard:
1. Go to your project
2. Click "+ New" 
3. Select "Database"
4. Choose "PostgreSQL"

Railway will automatically set the `DATABASE_URL` environment variable.

### 4. Set Required Environment Variables
In the Railway dashboard:
1. Go to your project
2. Click on your service
3. Go to the "Variables" tab
4. Add these variables:
   - `JWT_SECRET` - Generate a secure random string
   - `SESSION_SECRET` - Generate a secure random string

You can generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Deploy the Application
From your project directory:
```bash
railway up
```

This command will:
1. Build the Docker image using the Dockerfile
2. Deploy the application to Railway
3. Automatically connect to the PostgreSQL database

## Configuration Details

### Health Check
The application includes a health check endpoint at `/health` which Railway uses to monitor the application status.

### Environment Variables
Railway automatically provides:
- `PORT` - Dynamic port assignment
- `DATABASE_URL` - Connection string for PostgreSQL

You must manually set:
- `JWT_SECRET` - For authentication tokens
- `SESSION_SECRET` - For session management

### Port Configuration
The application listens on the port specified by the `PORT` environment variable, which Railway sets dynamically.

## Troubleshooting

### Build Issues
If you encounter build issues:
1. Ensure all dependencies are properly listed in package.json
2. Check that the Dockerfile paths are correct
3. Verify the build scripts in package.json

### Database Connection Issues
If the application can't connect to the database:
1. Verify the PostgreSQL database is provisioned
2. Check that `DATABASE_URL` is set correctly (Railway sets this automatically)
3. Ensure the database isn't blocked by network restrictions

### Health Check Failures
If the health check fails:
1. Verify the `/health` endpoint is accessible
2. Check the application logs for errors
3. Ensure the PORT environment variable is being used correctly

## Scaling

Railway automatically scales your application based on traffic. For manual scaling:
1. Go to your project in the Railway dashboard
2. Click on your service
3. Go to the "Settings" tab
4. Adjust the "Instance Size" and "Instances Count"

## Monitoring

Railway provides built-in monitoring:
1. Go to your project in the Railway dashboard
2. Click on your service
3. View logs, metrics, and alerts in the respective tabs

For custom monitoring, you can integrate with services like:
- Sentry for error tracking
- New Relic for performance monitoring