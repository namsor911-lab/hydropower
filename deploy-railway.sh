#!/bin/bash

# Railway.app Deployment Script
# Requires: Railway CLI installed (npm i -g @railway/cli)
# Usage: bash deploy-railway.sh

set -e

echo "🚀 Starting Railway.app Deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Build environment file
echo "📝 Setting up environment..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env 2>/dev/null || echo "JWT_SECRET=your-secret-key" > backend/.env
    echo "⚠️  Created .env file - update with your secrets"
fi

# Authenticate with Railway
echo "🔐 Authenticating with Railway..."
railway login || echo "Already authenticated with Railway"

# Create project if needed
echo "📦 Setting up Railway project..."
railway link || railway up --setup

# Set environment variables
echo "🔑 Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
railway variables set CORS_ORIGIN=$(railway domain 2>/dev/null || echo "http://localhost:3000")

# Deploy
echo "🚀 Deploying to Railway..."
railway up --detach

# Get URL
sleep 5
DEPLOY_URL=$(railway domain 2>/dev/null || echo "Check Railway dashboard for URL")

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://$DEPLOY_URL"
echo ""
echo "📚 Next steps:"
echo "1. Update your frontend API calls to use: https://$DEPLOY_URL"
echo "2. Test at: https://$DEPLOY_URL/login.html"
echo "3. Login with: admin@namsor.local / admin123"
echo ""
echo "💡 To view logs: railway logs"
echo "📊 To manage: railway open"
