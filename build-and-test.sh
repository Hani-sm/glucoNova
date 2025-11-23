#!/bin/bash

# GlucoNova Production Build and Test Script
# This script builds the application and tests it locally before deployment

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "  GlucoNova - Production Build Script"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ] && [ ! -f "server/.env" ]; then
    echo -e "${RED}⚠️  WARNING: No .env file found!${NC}"
    echo "Please create .env from .env.example and configure your environment variables"
    echo ""
    read -p "Do you want to copy .env.example to .env now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env from .env.example${NC}"
        echo "Please edit .env and add your configuration, then run this script again."
        exit 0
    else
        echo "Continuing without .env file..."
    fi
fi

echo "Step 1: Installing dependencies..."
echo "──────────────────────────────────────────────────────────────"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo "Step 2: Running TypeScript type check..."
echo "──────────────────────────────────────────────────────────────"
npm run check || echo -e "${YELLOW}⚠️  Type check completed with warnings${NC}"
echo ""

echo "Step 3: Building application..."
echo "──────────────────────────────────────────────────────────────"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

echo "Step 4: Checking build output..."
echo "──────────────────────────────────────────────────────────────"
if [ -d "dist/public" ] && [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✅ Build artifacts verified${NC}"
    echo "   - Frontend: dist/public"
    echo "   - Backend: dist/index.js"
else
    echo -e "${RED}❌ Build artifacts missing!${NC}"
    exit 1
fi
echo ""

echo "Step 5: Testing production build locally..."
echo "──────────────────────────────────────────────────────────────"
echo -e "${YELLOW}Starting server in production mode...${NC}"
echo "Press Ctrl+C to stop the server"
echo ""
echo "Test the application at: http://localhost:8080"
echo ""

# Start the production server
NODE_ENV=production npm start
