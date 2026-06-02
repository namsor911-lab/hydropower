#!/bin/bash

# Vercel Deployment Script (Frontend Only + Serverless API)
# Requires: Vercel CLI installed (npm i -g vercel)
# Usage: bash deploy-vercel.sh

set -e

echo "🚀 Starting Vercel Deployment..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

echo "🔐 Logging in to Vercel..."
vercel login

echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your frontend is live on Vercel!"
echo ""
echo "📝 Now deploy your backend:"
echo "1. Use Railway.app or Render.com for backend (SQLite won't work well on Vercel serverless)"
echo "2. Update frontend API calls to point to your backend URL"
echo ""
echo "💡 Or use Railway for both frontend AND backend (recommended)"
