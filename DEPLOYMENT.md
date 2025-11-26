# GlucoNova Deployment Guide

## Production Deployment Strategy

This document outlines the complete CI/CD and deployment process for GlucoNova diabetes management platform.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- Git repository access
- Deployment platform account (Railway, Render, Vercel, or Heroku)

## Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=<generate-secure-random-string>
PORT=8080
SESSION_SECRET=<generate-secure-random-string>
```

### Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Platforms

### Option 1: Railway (Recommended)

Railway provides seamless Node.js deployment with PostgreSQL support.

#### Steps:

1. **Connect Repository**
   ```bash
   # Push changes to main branch
   git push origin main
   ```

2. **Create Railway Project**
   - Go to railway.app
   - Click "New Project"
   - Select "GitHub Repo"
   - Authorize and select CommunityRecommender repo

3. **Configure PostgreSQL**
   - Add PostgreSQL plugin
   - Copy DATABASE_URL to environment

4. **Set Environment Variables**
   - NODE_ENV=production
   - JWT_SECRET=<generated-string>
   - SESSION_SECRET=<generated-string>
   - PORT=8080

5. **Deploy**
   - Railway auto-deploys on git push
   - Monitor deployment in Railway dashboard
   - Check logs for errors

#### Railway Configuration (railway.json)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Option 2: Render

#### Steps:

1. **Create Web Service**
   - Go to render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure Build & Deploy**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
   - Node Version: 18

3. **Add Environment Variables**
   - NODE_ENV=production
   - DATABASE_URL=<postgresql-url>
   - JWT_SECRET=<generated-string>
   - SESSION_SECRET=<generated-string>

4. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Connect to web service
   - Update DATABASE_URL

### Option 3: Heroku (Legacy)

#### Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   heroku create gluconova-prod
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=<generated-string>
   heroku config:set SESSION_SECRET=<generated-string>
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Build successful with no errors
- [ ] TypeScript compilation (0 errors)
- [ ] Bundle size acceptable
- [ ] Git status clean
- [ ] All recent changes committed
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Security secrets generated
- [ ] CORS settings configured
- [ ] SSL/TLS certificates ready

## Build Process

```bash
# Install dependencies
npm install

# Run type checking
npm run check

# Build application
npm run build

# Output structure:
# dist/
# ├── public/          # Static assets
# │   ├── assets/      # Bundled JS/CSS
# │   └── index.html   # HTML entry
# └── index.js         # Node server
```

## Testing

### Pre-Production Testing

```bash
# Local development
npm run dev

# Preview production build
npm run preview

# Type checking
npm run check

# Build verification
npm run build
```

### Staging Environment

1. Deploy to staging with production configuration
2. Run smoke tests
3. Verify all features:
   - User authentication
   - AI Food Log with regional language support
   - Meal timing toggle (12 languages)
   - Language switcher
   - Database operations
   - File uploads
   - Real-time messaging

## Database Management

### Initial Setup

```bash
# Push schema to production database
npm run db:push

# Run migrations (if any)
npm run db:migrate
```

### Ongoing Maintenance

1. **Backups**: Enable automated daily backups
2. **Monitoring**: Set up database alerts
3. **Migrations**: Test on staging before production

## Post-Deployment

### Verification Steps

1. **Health Check**
   ```bash
   curl https://your-domain.com/health
   ```

2. **API Endpoints**
   - Test authentication endpoints
   - Verify AI Food Log functionality
   - Check meal recognition (regional languages)
   - Validate language switching

3. **Frontend**
   - Check home page loads
   - Verify styling/assets load
   - Test responsive design
   - Validate language switching

4. **Database**
   - Verify connection active
   - Check user data accessible
   - Monitor performance

### Monitoring

1. **Application Logs**
   - Monitor error logs
   - Check for warnings
   - Watch performance metrics

2. **Performance**
   - Monitor response times
   - Track database queries
   - Check memory usage
   - Monitor CPU utilization

3. **Security**
   - Verify HTTPS enabled
   - Check authentication working
   - Validate input sanitization

## Rollback Procedure

If issues occur:

```bash
# For Railway/Render
1. Go to deployment dashboard
2. Select previous successful deployment
3. Click "Redeploy"

# For Heroku
heroku releases
heroku rollback v<previous-version>
```

## Performance Optimization

### Frontend
- Assets already optimized with Vite
- CSS minified with Tailwind
- JavaScript bundled and minified

### Backend
- Connection pooling configured
- Query optimization via Drizzle ORM
- Static file serving optimized

### Database
- Indexes on frequently queried columns
- Query logging for optimization
- Regular maintenance

## Security Considerations

1. **Environment Variables**
   - Never commit secrets
   - Use platform's secret management
   - Rotate secrets regularly

2. **Database**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - JWT tokens for authentication
   - CORS properly configured
   - Rate limiting enabled

4. **HTTPS**
   - Required for all connections
   - Auto-renewing certificates
   - Secure headers configured

## Scaling

### Horizontal Scaling
- Use managed database service
- Load balancer (platform-provided)
- Stateless backend design

### Vertical Scaling
- Upgrade compute resources
- Increase database tier
- Monitor resource usage

## Troubleshooting

### Build Failures

```bash
# Check Node/npm versions
node --version
npm --version

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Database Connection Issues

```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Check connection from local
psql $DATABASE_URL -c "SELECT 1"
```

### Performance Issues

1. Check database query performance
2. Monitor server resource usage
3. Review application logs
4. Check network latency

## Support & Documentation

- Project Repository: https://github.com/Hani-sm/glucoNova
- Issue Tracker: GitHub Issues
- Documentation: README.md
- Contact: Project maintainers

## Recent Enhancements (Deployed in This Release)

### Regional Language Food Recognition
- 70+ food name mappings across 5 Indian languages
- Smart normalization algorithm
- Support for Telugu, Kannada, Tamil, Hindi, Marathi

### Multilingual UI
- 12-language support for meal timing toggle
- Enhanced language switcher with dropdown
- Dynamic translations based on selection

### Combined Dishes
- 6 new nutritional entries for popular meals
- Complete carb/protein/fat breakdowns
- Glycemic index for diabetes management

## Deployment Checklist

- [x] All code changes committed
- [x] Build verification successful
- [x] TypeScript errors: 0
- [x] Bundle size optimized
- [x] Database schema ready
- [x] Environment variables template created
- [x] Deployment platforms configured
- [x] Pre-deployment tests defined
- [x] Rollback procedures documented
- [x] Monitoring plan established

---

Last Updated: 2025-11-25
Version: 2.0.0
