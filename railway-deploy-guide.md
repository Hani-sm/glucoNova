# Deploying GlucoNova to Railway

## Prerequisites
1. Railway account (railway.app)
2. Railway CLI installed (`npm install -g @railway/cli`)

## Deployment Steps

### 1. Login to Railway
```bash
railway login
```

### 2. Create a New Project
```bash
railway init
```
Choose a name for your project (e.g., "GlucoNova")

### 3. Provision a PostgreSQL Database
In the Railway dashboard:
1. Go to your project
2. Click "+ New" 
3. Select "Database"
4. Choose "PostgreSQL"

Railway will automatically set the DATABASE_URL environment variable.

### 4. Set Environment Variables
In the Railway dashboard:
1. Go to your project
2. Click on your service
3. Go to the "Variables" tab
4. Add the following variables:
   - JWT_SECRET (generate a secure random string)
   - SESSION_SECRET (generate a secure random string)

### 5. Deploy the Application
```bash
railway up
```

This will:
1. Build the Docker image using the Dockerfile
2. Deploy the application to Railway
3. Automatically connect to the PostgreSQL database

## Configuration Files

### railway.json
This file tells Railway how to build and deploy the application:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "runtime": "nodejs",
    "static": false
  }
}
```

### Health Check Endpoint
The application includes a health check endpoint at `/health` which Railway uses to monitor the application status.

## Environment Variables
Railway automatically provides:
- PORT (dynamic port assignment)
- DATABASE_URL (connection string for PostgreSQL)

You need to manually set:
- JWT_SECRET (for authentication)
- SESSION_SECRET (for session management)

## Notes
1. The application listens on the port specified by the PORT environment variable
2. In production, the frontend is served statically from the dist/public directory
3. The Dockerfile handles both building and running the application
4. CORS is configured to work with Railway's dynamic URLs