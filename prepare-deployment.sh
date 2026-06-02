#!/bin/bash

# Pre-Deployment Checklist Script
# Prepares your project for deployment
# Usage: bash prepare-deployment.sh

set -e

echo ""
echo "🚀 PRE-DEPLOYMENT CHECKLIST"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="${GREEN}✓${NC}"
cross_mark="${RED}✗${NC}"

# Check 1: Git initialized
echo "1. Checking Git repository..."
if [ -d .git ]; then
    echo -e "   $check_mark Git repository found"
else
    echo -e "   $cross_mark Git not initialized"
    echo "   Run: git init"
    exit 1
fi

# Check 2: Code committed
echo "2. Checking for uncommitted changes..."
if [ -z "$(git status --porcelain)" ]; then
    echo -e "   $check_mark All changes committed"
else
    echo -e "   $cross_mark Uncommitted changes detected"
    echo "   Run: git add . && git commit -m 'Ready for deployment'"
    exit 1
fi

# Check 3: Remote configured
echo "3. Checking GitHub remote..."
if git remote -v | grep -q origin; then
    REMOTE=$(git remote get-url origin)
    echo -e "   $check_mark Remote configured: $REMOTE"
else
    echo -e "   $cross_mark GitHub remote not configured"
    echo "   Run: git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git"
    exit 1
fi

# Check 4: Pushed to GitHub
echo "4. Checking if code is pushed to GitHub..."
if git rev-parse --verify @{u} >/dev/null 2>&1; then
    echo -e "   $check_mark Code is pushed to GitHub"
else
    echo -e "   $cross_mark Code not pushed"
    echo "   Run: git push -u origin main"
    exit 1
fi

# Check 5: Dependencies installed
echo "5. Checking Node.js dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "   $check_mark Dependencies installed"
else
    echo -e "   $cross_mark Installing dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check 6: .env.example exists
echo "6. Checking environment template..."
if [ -f "backend/.env.example" ]; then
    echo -e "   $check_mark .env.example found"
else
    echo -e "   $cross_mark .env.example not found"
    exit 1
fi

# Check 7: Dockerfile exists
echo "7. Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    echo -e "   $check_mark Dockerfile found"
else
    echo -e "   $cross_mark Dockerfile not found"
    exit 1
fi

# Check 8: Deployment configs exist
echo "8. Checking deployment configs..."
configs=("railway.json" "render.yaml" "vercel.json" ".github/workflows/deploy.yml")
all_exist=true
for config in "${configs[@]}"; do
    if [ -f "$config" ]; then
        echo -e "   $check_mark $config found"
    else
        echo -e "   $cross_mark $config not found"
        all_exist=false
    fi
done

# Check 9: Deploy scripts exist
echo "9. Checking deployment scripts..."
scripts=("deploy-railway.sh" "deploy-render.sh" "deploy-vercel.sh")
for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        echo -e "   $check_mark $script found"
    else
        echo -e "   $cross_mark $script not found"
    fi
done

echo ""
echo "========================================"
echo "✨ Pre-deployment checks complete!"
echo ""
echo "🚀 You're ready to deploy!"
echo ""
echo "Next steps:"
echo "  1. Create Railway account: https://railway.app"
echo "  2. Connect GitHub repository"
echo "  3. Click 'Deploy'"
echo ""
echo "Or use command:"
echo "  bash deploy-railway.sh"
echo ""
