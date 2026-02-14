@echo off
echo ============================================
echo Analyx Drug Scanner - Windows Setup Script
echo ============================================
echo.

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/6] Checking MongoDB installation...
mongo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB command not found
    echo Make sure MongoDB is installed and running
    echo Download from: https://www.mongodb.com/try/download/community
)
echo.

echo [3/6] Installing Backend Dependencies...
cd backend
if exist node_modules (
    echo Backend dependencies already installed
) else (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✓ Backend dependencies installed
)
echo.

echo [4/6] Setting up Backend Environment...
if exist .env (
    echo .env file already exists
) else (
    copy .env.example .env
    echo ✓ Created .env file from template
    echo ⚠ Please update .env with your configuration
)
cd ..
echo.

echo [5/6] Installing Frontend Dependencies...
cd frontend
if exist node_modules (
    echo Frontend dependencies already installed
) else (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✓ Frontend dependencies installed
)
echo.

echo [6/6] Setting up Frontend Environment...
if exist .env (
    echo .env file already exists
) else (
    copy .env.example .env
    echo ✓ Created .env file from template
)
cd ..
echo.

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo 1. Start MongoDB service (if not running)
echo    Command: net start MongoDB
echo.
echo 2. Create admin user:
echo    cd backend
echo    npm run create-admin
echo.
echo 3. Start Backend Server:
echo    cd backend
echo    npm run dev
echo.
echo 4. Start Frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 5. Open http://localhost:3000
echo.
echo For detailed instructions, see QUICKSTART.md
echo ============================================
pause
