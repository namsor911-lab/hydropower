@echo off
REM Vercel Deployment Script for Windows

echo.
echo 🚀 Starting Vercel Deployment...
echo.

where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI not found. Installing...
    call npm install -g vercel
)

echo 🔐 Logging in to Vercel...
call vercel login

echo 📦 Deploying to Vercel...
call vercel --prod

echo.
echo ✅ Deployment complete!
echo 🌐 Your frontend is live on Vercel!
echo.
echo 📝 Now deploy your backend:
echo 1. Use Railway.app or Render.com for backend
echo 2. Update frontend API calls to point to your backend URL
echo.
echo 💡 Or use Railway for both frontend AND backend ^(recommended^)
echo.
