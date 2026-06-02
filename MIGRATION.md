# Namsor Hydropower Accounting System - Migration Guide

## 📋 Project Structure

```
hydropower/
├── backend/                          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/              # Request handlers
│   │   ├── models/                   # Database models
│   │   ├── routes/                   # API routes
│   │   ├── middleware/               # Auth, upload handling
│   │   ├── utils/                    # Helper functions
│   │   ├── database/                 # DB initialization
│   │   └── server.js                 # Main server file
│   ├── database/                     # SQLite files (auto-created)
│   ├── uploads/                      # Receipt/image storage
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── vercel.json
│   └── render.yaml
│
├── frontend/                         # Static HTML/CSS/JS
│   ├── login.html                    # Login page
│   ├── index.html                    # Main dashboard (needs API integration)
│   ├── hr.html                       # HR/Payroll page (needs API integration)
│   ├── js/
│   │   └── api.js                    # API client library
│   ├── css/
│   ├── assets/
│   ├── package.json
│   ├── netlify.toml
│   └── vercel.json
│
├── package.json                      # Root package (optional)
└── MIGRATION.md                      # This file
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# - Set JWT_SECRET to a strong random string
# - Set DATABASE_URL path
# - Configure CORS_ORIGIN for frontend URL

# Initialize database
npm run migrate

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# For development
python -m http.server 3000

# Access at http://localhost:3000
```

### 3. Login Flow

1. Navigate to `http://localhost:3000/login.html`
2. Credentials are created through backend (`/api/auth/register` or admin setup)
3. After login, token stored in `localStorage.authToken`
4. Token passed in all subsequent API requests

## 🔄 Migration from localStorage to API

### Key Changes

| Aspect | Before (v3.0) | After (v3.1) |
|--------|---------------|-------------|
| Data Storage | localStorage + IndexedDB | SQLite database |
| Authentication | None (local only) | JWT tokens + Roles |
| Multi-user | No | Yes (admin, accountant, viewer) |
| Deployment | Single file | Backend + Frontend separate |
| Audit Trail | None | Activity logging |
| File Upload | Base64 in IndexedDB | Disk storage with references |

### Frontend API Integration

The `frontend/js/api.js` library replaces localStorage calls:

```javascript
// OLD: localStorage.setItem('acc_v2', JSON.stringify(data))
// NEW: Using API
import { Transactions } from './js/api.js';
const result = await Transactions.create(transactionData);

// All existing form handlers need to:
// 1. Call API instead of localStorage
// 2. Handle async responses
// 3. Check user roles before showing UI elements
```

### Data Migration Strategy

For existing data, create a migration script:

```javascript
// In backend: src/database/migrate.js
// 1. Read existing localStorage from exports
// 2. Transform data to new schema
// 3. Bulk insert into SQLite
// 4. Validate totals match
```

## 🔐 Authentication & Roles

### User Roles

- **Admin**: Full system access, user management
- **Accountant**: Create/edit transactions, budgets, employees
- **Viewer**: Read-only access to reports

### Role-Based Routes

```javascript
// Example: Only accountants and admins can edit
router.put('/:id', 
  authenticate,                        // Must be logged in
  authorize(['admin', 'accountant']),   // Must have these roles
  controller
);
```

### Checking Roles in Frontend

```javascript
import { Auth } from './js/api.js';
const user = await Auth.getCurrentUser();

if (user.role === 'admin') {
  // Show admin controls
}

if (['admin', 'accountant'].includes(user.role)) {
  // Show edit/delete buttons
}
```

## 📁 File Upload Handling

### Receipts/Documents

```javascript
// Upload file
import { uploadFile } from './js/api.js';
const fileData = await uploadFile(file);
// Returns: { fileId, filePath, mimeType, fileSize }

// Associate with transaction
await Transactions.create({
  // ...
  receiptId: fileData.fileId
});
```

### Signatures (Base64)

```javascript
import { uploadBase64 } from './js/api.js';
const signatureData = await uploadBase64(
  canvasDataURL,
  'signature.png',
  'signature'
);
```

## 📊 Report Endpoints

### Monthly Summary
```
GET /api/transactions/summary?month=1&year=2024
Response: {
  totalIncome: 50000000,
  totalExpense: 30000000,
  totalTransactions: 150
}
```

### 12-Month Chart
```
GET /api/transactions/chart/monthly?year=2024
Response: [
  { month: 1, income: 50000000, expense: 30000000 },
  { month: 2, income: 55000000, expense: 32000000 },
  // ... 12 months
]
```

### Budget vs Actual
```
GET /api/budget?year=2024&month=1
Response: [
  {
    id: "uuid",
    category: "Equipment",
    plannedAmount: 100000000,
    actualAmount: 85000000,
    month: 1,
    year: 2024
  }
]
```

## 🐳 Deployment Options

### Option 1: Docker (Railway, Render, Self-hosted)

```bash
# Build image
docker build -t namsor-api .

# Run container
docker run -p 5000:5000 \
  -e JWT_SECRET=your-secret \
  -e DATABASE_URL=/app/database/namsor.db \
  namsor-api
```

### Option 2: Vercel (Serverless)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd backend
vercel deploy

# Deploy frontend
cd ../frontend
vercel deploy
```

### Option 3: Railway.app

1. Connect GitHub repository
2. Create Node.js service
3. Set environment variables in Railway dashboard
4. Auto-deploys on push

### Option 4: Render.com

1. Create new Web Service
2. Connect to GitHub
3. Use `render.yaml` for configuration
4. Deploy

## 📝 Environment Variables

### Backend (.env)

```
NODE_ENV=production
PORT=5000
DATABASE_URL=./database/namsor.db
JWT_SECRET=<generate-random-string>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Frontend (api.js)

API URL automatically detected:
- Local: `http://localhost:5000/api`
- Production: `/api` (relative path)

## 🔄 Updating Existing HTML Files

### Original Files Migration

1. **index.html** (Main Dashboard)
   - Keep all HTML/CSS as-is
   - Replace `localStorage.getItem()` calls with `await Transactions.getAll()`
   - Replace form submissions with `await Transactions.create(data)`
   - Add authentication check at page load

2. **hr.html** (Payroll)
   - Keep all styling
   - Replace employee data loading with `await Employees.getAll()`
   - Replace salary updates with `await Employees.update(id, data)`

### Example Code Changes

```javascript
// BEFORE: localStorage-based
function loadTransactions() {
  const data = JSON.parse(localStorage.getItem('acc_v2') || '{}');
  renderTransactions(data.transactions);
}

// AFTER: API-based
async function loadTransactions() {
  try {
    const data = await Transactions.getAll();
    renderTransactions(data);
  } catch (err) {
    showError('Failed to load transactions');
  }
}

// Add this at page start
async function initPage() {
  // Check if logged in
  if (!localStorage.getItem('authToken')) {
    window.location.href = '/login.html';
    return;
  }
  
  try {
    const user = await Auth.getCurrentUser();
    document.getElementById('userName').textContent = user.fullName;
  } catch (err) {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
  }
}

// Call on page load
window.addEventListener('load', initPage);
```

## 🧪 Testing

### Test User Credentials

Create in backend first:

```javascript
// In backend terminal after npm run dev is running
const { User } = require('./src/models');

// Create admin
await User.create({
  email: 'admin@namsor.local',
  password: 'admin123',
  fullName: 'Admin User',
  role: 'admin'
});

// Create accountant
await User.create({
  email: 'accountant@namsor.local',
  password: 'accountant123',
  fullName: 'Accountant User',
  role: 'accountant'
});

// Create viewer
await User.create({
  email: 'viewer@namsor.local',
  password: 'viewer123',
  fullName: 'Viewer User',
  role: 'viewer'
});
```

## 🐛 Troubleshooting

### CORS Error
- Check `CORS_ORIGIN` in backend `.env`
- Add frontend URL to comma-separated list
- Restart backend server

### 401 Unauthorized
- Token expired: Clear `localStorage.authToken` and re-login
- Token invalid: Check JWT_SECRET matches between logins

### Database Lock
- Close all connections: `killall node`
- Delete lock file: `rm database/*.db-journal`
- Restart server

### File Upload Fails
- Check permissions on `uploads/` directory
- Verify `MAX_FILE_SIZE` is large enough
- Check disk space available

## 📞 Support

For issues or questions:
1. Check API response in browser DevTools (Network tab)
2. Review backend logs in terminal
3. Check database with: `sqlite3 database/namsor.db`.schema`

## 🎯 Next Steps

1. ✅ Set up backend and frontend locally
2. ✅ Test login flow
3. ✅ Verify API endpoints work
4. ✅ Update HTML files to use API
5. ✅ Test with sample data
6. ✅ Deploy backend to Railway/Render
7. ✅ Deploy frontend to Vercel/Netlify
8. ✅ Configure custom domain
9. ✅ Set up SSL certificate
10. ✅ Monitor production logs

---

**Version**: 1.0.0  
**Last Updated**: June 2024  
**Status**: Production Ready
