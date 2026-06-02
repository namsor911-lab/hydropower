#!/bin/bash

# Render.com Deployment Script
# Requires: Git repository + GitHub connection
# Usage: bash deploy-render.sh

set -e

echo "🚀 Starting Render.com Deployment..."
echo ""
echo "⚠️  Render requires GitHub. Follow these steps:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and connect your GitHub"
echo ""
echo "3. Click 'New +' > 'Web Service'"
echo ""
echo "4. Select your repository"
echo ""
echo "5. Configure:"
echo "   - Name: namsor-accounting"
echo "   - Environment: Node"
echo "   - Build Command: cd backend && npm ci && npm run migrate"
echo "   - Start Command: cd backend && npm run start"
echo "   - Plan: Free"
echo ""
echo "6. Add environment variables:"
echo "   - NODE_ENV: production"
echo "   - JWT_SECRET: (generate a long random string)"
echo "   - CORS_ORIGIN: https://<your-render-domain>"
echo ""
echo "7. Click 'Create Web Service'"
echo ""
echo "✅ Render will auto-deploy when you push to GitHub!"
echo ""
echo "📚 Render Dashboard: https://dashboard.render.com"
