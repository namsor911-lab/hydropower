@echo off
REM Railway.app Deployment Script for Windows
REM Requires: Railway CLI installed (npm i -g @railway/cli)
REM Usage: deploy-railway.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting Railway.app Deployment...
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Railway CLI not found. Installing...
    call npm install -g @railway/cli
)

REM Check if git is initialized
if not exist .git (
    echo ❌ Error: Not a git repository
    echo Please run: git init ^&^& git add . ^&^& git commit -m "Initial commit"
    exit /b 1
)

REM Build environment file
echo 📝 Setting up environment...
if not exist backend\.env (
    copy backend\.env.example backend\.env >nul 2>&1 || (
        (echo JWT_SECRET=your-secret-key) > backend\.env
    )
    echo ⚠️  Created .env file - update with your secrets
)

REM Authenticate with Railway
echo 🔐 Authenticating with Railway...
call railway login || echo Already authenticated with Railway

REM Create project if needed
echo 📦 Setting up Railway project...
call railway link || call railway up --setup

REM Set environment variables
echo 🔑 Setting environment variables...
call railway variables set NODE_ENV=production
call railway variables set PORT=5000
call railway variables set JWT_SECRET=%RANDOM%-%RANDOM%-%RANDOM%
call railway variables set CORS_ORIGIN=http://localhost:3000

REM Deploy
echo 🚀 Deploying to Railway...
call railway up --detach

echo.
echo ✅ Deployment in progress!
echo 📊 Check Railway dashboard at: https://railway.app
echo.
echo 💡 To view logs: railway logs
echo 📊 To manage: railway open
echo.

endlocal
