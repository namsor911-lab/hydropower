@echo off
REM setup.bat - Complete setup script for Namsor Accounting System (Windows)

echo ================================
echo 🚀 Namsor Accounting Setup
echo ================================
echo.

REM Step 1: Install backend
echo Step 1: Installing backend dependencies...
cd backend
call npm install
echo ✓ Backend dependencies installed
echo.

REM Step 2: Initialize database
echo Step 2: Initializing database...
call npm run migrate
echo ✓ Database initialized
echo.

REM Step 3: Create demo users
echo Step 3: Creating demo users...
node -e "import('./setup-users.js').catch(e => {console.error(e); process.exit(1)})"
echo ✓ Demo users created
echo.

echo ================================
echo ✓ Setup Complete!
echo ================================
echo.
echo Demo Credentials:
echo    Admin:      admin@namsor.local / admin123
echo    Accountant: accountant@namsor.local / accountant123
echo    Viewer:     viewer@namsor.local / viewer123
echo.
echo Next Steps:
echo    1. Start backend:   npm run dev (in backend folder)
echo    2. Start frontend:  python -m http.server 3000 (in frontend folder)
echo    3. Open browser:    http://localhost:3000/login.html
echo.
pause
