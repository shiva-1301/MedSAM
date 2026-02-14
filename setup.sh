#!/bin/bash

echo "============================================"
echo "Analyx Drug Scanner - Unix/Linux/Mac Setup"
echo "============================================"
echo ""

echo "[1/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"
echo ""

echo "[2/6] Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB command not found"
    echo "Make sure MongoDB is installed and running"
    echo "Install: https://www.mongodb.com/try/download/community"
fi
echo ""

echo "[3/6] Installing Backend Dependencies..."
cd backend
if [ -d "node_modules" ]; then
    echo "Backend dependencies already installed"
else
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
    echo "✓ Backend dependencies installed"
fi
echo ""

echo "[4/6] Setting up Backend Environment..."
if [ -f ".env" ]; then
    echo ".env file already exists"
else
    cp .env.example .env
    echo "✓ Created .env file from template"
    echo "⚠ Please update .env with your configuration"
fi
cd ..
echo ""

echo "[5/6] Installing Frontend Dependencies..."
cd frontend
if [ -d "node_modules" ]; then
    echo "Frontend dependencies already installed"
else
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
    echo "✓ Frontend dependencies installed"
fi
echo ""

echo "[6/6] Setting up Frontend Environment..."
if [ -f ".env" ]; then
    echo ".env file already exists"
else
    cp .env.example .env
    echo "✓ Created .env file from template"
fi
cd ..
echo ""

echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo "1. Start MongoDB service (if not running)"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo ""
echo "2. Create admin user:"
echo "   cd backend"
echo "   npm run create-admin"
echo ""
echo "3. Start Backend Server:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Start Frontend (in new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "5. Open http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo "============================================"
