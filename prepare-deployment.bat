@echo off
REM Pre-Deployment Checklist Script for Windows
REM Prepares your project for deployment
REM Usage: prepare-deployment.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 PRE-DEPLOYMENT CHECKLIST
echo ======================================
echo.

REM Check 1: Git initialized
echo 1. Checking Git repository...
if exist .git (
    echo    ✓ Git repository found
) else (
    echo    ✗ Git not initialized
    echo    Run: git init
    exit /b 1
)

REM Check 2: Remote configured
echo 2. Checking GitHub remote...
for /f "tokens=*" %%i in ('git remote -v 2^>nul') do (
    if not "%%i"=="" (
        echo    ✓ Remote configured
        goto :remote_ok
    )
)
echo    ✗ GitHub remote not configured
echo    Run: git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
exit /b 1

:remote_ok

REM Check 3: Dependencies installed
echo 3. Checking Node.js dependencies...
if exist "backend\node_modules" (
    echo    ✓ Dependencies installed
) else (
    echo    ✗ Installing dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check 4: .env.example exists
echo 4. Checking environment template...
if exist "backend\.env.example" (
    echo    ✓ .env.example found
) else (
    echo    ✗ .env.example not found
    exit /b 1
)

REM Check 5: Dockerfile exists
echo 5. Checking Dockerfile...
if exist "Dockerfile" (
    echo    ✓ Dockerfile found
) else (
    echo    ✗ Dockerfile not found
    exit /b 1
)

REM Check 6: Deployment configs exist
echo 6. Checking deployment configs...
if exist "railway.json" (
    echo    ✓ railway.json found
) else (
    echo    ✗ railway.json not found
)
if exist "render.yaml" (
    echo    ✓ render.yaml found
) else (
    echo    ✗ render.yaml not found
)

echo.
echo ======================================
echo ✨ Pre-deployment checks complete!
echo.
echo 🚀 You're ready to deploy!
echo.
echo Next steps:
echo   1. Create Railway account: https://railway.app
echo   2. Connect GitHub repository
echo   3. Click 'Deploy'
echo.
echo Or use command:
echo   deploy-railway.bat
echo.

endlocal
