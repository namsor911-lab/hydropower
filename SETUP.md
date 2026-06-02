# 🚀 Setup Guide - Namsor Accounting System v3.1

## Prerequisites Check

```bash
# Check Node.js version (need 16+)
node --version

# Check npm
npm --version

# Check Python (for serving frontend locally)
python --version
```

---

## ⚡ 5-Minute Quick Start

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# The .env already has defaults. For development, only change if needed:
# - PORT (default 5000)
# - DATABASE_URL (default ./database/namsor.db)
```

### Step 2: Start Backend

```bash
# From backend folder
npm run migrate    # Creates database (only first time)
npm run dev        # Starts server on port 5000
```

✅ Backend now runs at: `http://localhost:5000`

### Step 3: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Start local server
python -m http.server 3000
```

✅ Frontend now runs at: `http://localhost:3000`

### Step 4: Access System

1. Open `http://localhost:3000/login.html`
2. See demo credentials below
3. Click "ເຂົ້າລະບົບ" (Login)

---

## 🔑 Demo Credentials

These are created automatically. To set them up manually:

### Create Admin User

Open backend terminal and run:

```bash
# Connect to database
sqlite3 ./database/namsor.db

# Then paste this SQL:
INSERT INTO users (id, email, password, fullName, role, department)
VALUES (
  'user-admin-001',
  'admin@namsor.local',
  '$2b$10$...',  # bcrypt hash of "admin123"
  'System Administrator',
  'admin',
  'Management'
);
```

**Or use this Node.js snippet** (in backend folder):

```javascript
// Save as createAdmin.js in backend folder
import { initDatabase } from './src/database/db.js';
import { User } from './src/models/index.js';

await initDatabase();

const admin = await User.create({
  email: 'admin@namsor.local',
  password: 'admin123',
  fullName: 'System Administrator',
  role: 'admin',
  department: 'Management'
});

console.log('✓ Admin created:', admin.email);
process.exit(0);
```

Run with: `node createAdmin.js`

---

## 📁 File Organization

### Original Files
The original `index.html` and `hr.html` are in the root:
- `/index.html` (v3.0 - localStorage based)
- `/hr.html` (v3.0 - localStorage based)

### New Files
New API-based versions in:
- `/frontend/index.html` (needs to be created with API integration)
- `/frontend/hr.html` (needs to be created with API integration)
- `/frontend/login.html` ✅ (ready to use)

### Migration Steps

1. **Copy original files to frontend folder:**
```bash
cp index.html frontend/index.html
cp hr.html frontend/hr.html
```

2. **Update the copied files** to use API (see below)

3. **Delete or archive** the original root files

---

## 🔄 Integrating API with Original HTML

### Step 1: Add API Client Import

At the top of `<head>` in `index.html`:

```html
<script type="module">
  import { Transactions, Budget, Purchase, Auth, setAuthToken } from './js/api.js';
  window.api = { Transactions, Budget, Purchase, Auth, setAuthToken };
</script>
```

### Step 2: Add Authentication Check

At the end of your existing JavaScript:

```javascript
// Check authentication on page load
window.addEventListener('load', async function() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  try {
    const user = await window.api.Auth.getCurrentUser();
    // Update UI with user info
    document.getElementById('userDisplayName').textContent = user.fullName;
  } catch (err) {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
  }
});
```

### Step 3: Replace localStorage Calls

**BEFORE** (localStorage-based):
```javascript
function saveTransaction() {
  let data = JSON.parse(localStorage.getItem('acc_v2') || '{}');
  data.transactions = data.transactions || [];
  data.transactions.push({
    type: 'income',
    amount: 1000000,
    date: new Date()
  });
  localStorage.setItem('acc_v2', JSON.stringify(data));
}
```

**AFTER** (API-based):
```javascript
async function saveTransaction() {
  try {
    const result = await window.api.Transactions.create({
      type: 'income',
      amount: 1000000,
      date: new Date().toISOString().split('T')[0]
    });
    console.log('Transaction saved:', result);
  } catch (err) {
    console.error('Failed to save:', err);
    showError('ບໍ່ສາມາດບັນທຶກໄດ້');
  }
}
```

### Step 4: Update Data Loading

**BEFORE**:
```javascript
function loadTransactions() {
  const data = JSON.parse(localStorage.getItem('acc_v2') || '{}');
  renderTable(data.transactions || []);
}
```

**AFTER**:
```javascript
async function loadTransactions() {
  try {
    const transactions = await window.api.Transactions.getAll({
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    });
    renderTable(transactions);
  } catch (err) {
    showError('ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້');
  }
}

// Call on page load
window.addEventListener('load', loadTransactions);
```

### Step 5: File Upload

**BEFORE** (Base64):
```javascript
fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64 = evt.target.result;
    localStorage.setItem('receipt_' + Date.now(), base64);
  };
  reader.readAsDataURL(file);
});
```

**AFTER** (Upload to API):
```javascript
fileInput.addEventListener('change', async function(e) {
  try {
    const file = e.target.files[0];
    const result = await window.api.uploadFile(file);
    console.log('File uploaded:', result.filePath);
    // Store result.fileId with your transaction
  } catch (err) {
    showError('ບໍ່ສາມາດອັບໂຫລດໄຟລ໌ໄດ້');
  }
});
```

---

## 🧪 Testing API Endpoints

### Check if Backend is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-06-02T10:30:45.123Z"
}
```

### Test Login Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@namsor.local",
    "password": "admin123"
  }'
```

### Test Transactions Endpoint (with token)

```bash
# First get the token from login response, then:
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐳 Docker Setup

### Option A: Using docker-compose

```bash
# From root folder
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Option B: Manual Docker

```bash
# Build
docker build -t namsor-api backend/

# Run
docker run -d \
  -p 5000:5000 \
  -e JWT_SECRET="your-secret" \
  -v $(pwd)/backend/database:/app/database \
  -v $(pwd)/backend/uploads:/app/uploads \
  namsor-api
```

---

## 📱 Production Deployment

### Deploy Backend to Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

Railway automatically detects and uses `railway.yaml`

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel deploy

# Set environment variable
# API_BASE_URL = https://your-api-url.railway.app
```

### Deploy Both to Render.com

**Backend:**
1. Create new Web Service
2. Connect GitHub repo
3. Environment variables set in dashboard:
   - `JWT_SECRET`
   - `CORS_ORIGIN`
4. Deploy

**Frontend:**
1. Create new Static Site
2. Connect GitHub repo
3. Deploy

---

## 🚨 Common Issues & Solutions

### "Can't connect to API"

**Cause**: Backend not running or wrong URL

**Fix**:
```bash
# Check backend is running
curl http://localhost:5000/health

# If not running:
cd backend && npm run dev
```

### "CORS error"

**Cause**: CORS_ORIGIN not set correctly

**Fix in backend/.env**:
```env
CORS_ORIGIN=http://localhost:3000
```

Then restart backend.

### "404 on /api/..."

**Cause**: Frontend calling wrong API URL

**Check in browser DevTools** → Network tab:
- Request URL should be `http://localhost:5000/api/...`
- NOT `/api/...` (local path)

### "Database locked"

**Cause**: Multiple connections or process still running

**Fix**:
```bash
# Kill Node process
pkill -f "node src/server.js"

# Remove lock file
rm backend/database/*.db-journal

# Restart
cd backend && npm run dev
```

### "Password hash error"

**Cause**: bcrypt native module not installed for your platform

**Fix**:
```bash
# Rebuild bcrypt
cd backend
npm rebuild bcrypt

# Or reinstall
npm install bcrypt --save
```

---

## 📊 Database

### View Database

```bash
# Install sqlite3 (if needed)
# macOS: brew install sqlite
# Ubuntu: sudo apt-get install sqlite3
# Windows: choco install sqlite

# Open database
sqlite3 backend/database/namsor.db

# View tables
.tables

# View schema
.schema

# Query users
SELECT id, email, fullName, role FROM users;

# Query transactions
SELECT * FROM transactions LIMIT 10;

# Exit
.quit
```

### Backup Database

```bash
# Backup
cp backend/database/namsor.db namsor-backup-$(date +%Y%m%d).db

# Restore
cp namsor-backup-20240602.db backend/database/namsor.db
```

---

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [JWT Introduction](https://jwt.io/introduction)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## ✅ Verification Checklist

- [ ] Node.js v16+ installed
- [ ] Backend installed (`npm install` in backend/)
- [ ] Frontend can access backend API
- [ ] Login page loads without errors
- [ ] Can create user and login
- [ ] Dashboard loads after login
- [ ] Can create transaction
- [ ] Transaction appears in database
- [ ] File upload works
- [ ] Reports generate correctly

---

## 📞 Getting Help

1. **Check logs**: Backend terminal shows detailed errors
2. **Browser console**: Frontend errors appear in DevTools
3. **Database check**: Query database directly with sqlite3
4. **Network tab**: See what API requests are being made

---

**Version**: 3.1  
**Updated**: June 2024  
**Status**: Ready for Setup
