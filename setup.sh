#!/bin/bash
# setup.sh - Complete setup script for Namsor Accounting System

set -e

echo "================================"
echo "🚀 Namsor Accounting Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Install backend
echo -e "${BLUE}Step 1: Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Step 2: Initialize database
echo -e "${BLUE}Step 2: Initializing database...${NC}"
npm run migrate
echo -e "${GREEN}✓ Database initialized${NC}"
echo ""

# Step 3: Create demo admin user
echo -e "${BLUE}Step 3: Creating demo admin user...${NC}"
node << 'EOF'
import { initDatabase } from './src/database/db.js';
import { User } from './src/models/index.js';

try {
  await initDatabase();
  
  // Check if admin exists
  const admin = await User.findByEmail('admin@namsor.local');
  if (!admin) {
    await User.create({
      email: 'admin@namsor.local',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'admin',
      department: 'Management'
    });
    console.log('✓ Admin user created');
  } else {
    console.log('✓ Admin user already exists');
  }
  
  // Create accountant
  const accountant = await User.findByEmail('accountant@namsor.local');
  if (!accountant) {
    await User.create({
      email: 'accountant@namsor.local',
      password: 'accountant123',
      fullName: 'Accountant',
      role: 'accountant',
      department: 'Finance'
    });
    console.log('✓ Accountant user created');
  }
  
  // Create viewer
  const viewer = await User.findByEmail('viewer@namsor.local');
  if (!viewer) {
    await User.create({
      email: 'viewer@namsor.local',
      password: 'viewer123',
      fullName: 'Report Viewer',
      role: 'viewer',
      department: 'Reports'
    });
    console.log('✓ Viewer user created');
  }
  
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
EOF

echo -e "${GREEN}✓ Demo users created${NC}"
echo ""

echo "================================"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "================================"
echo ""
echo "📋 Demo Credentials:"
echo "   Admin:      admin@namsor.local / admin123"
echo "   Accountant: accountant@namsor.local / accountant123"
echo "   Viewer:     viewer@namsor.local / viewer123"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start backend:   npm run dev (in backend folder)"
echo "   2. Start frontend:  python -m http.server 3000 (in frontend folder)"
echo "   3. Open browser:    http://localhost:3000/login.html"
echo ""
