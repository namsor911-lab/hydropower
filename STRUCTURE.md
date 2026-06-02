# 📁 Project Directory Structure

Complete folder layout and file organization for the Namsor Hydropower Accounting System v3.1

```
hydropower/                              # Root project directory
│
├── 📄 package.json                      # Root workspace config (npm workspaces)
├── 📄 README.md                         # Project overview
├── 📄 SETUP.md                          # Quick start guide (READ THIS FIRST!)
├── 📄 MIGRATION.md                      # Migration from v3.0 to v3.1
├── 📄 STATUS.md                         # Project status & checklist
├── 📄 .gitignore
│
├── 🔧 backend/                          # Node.js/Express API Server
│   ├── 📄 package.json                  # Dependencies: express, sqlite3, jwt, bcrypt, multer
│   ├── 📄 .env.example                  # Environment variables template
│   ├── 📄 .gitignore
│   ├── 📄 README.md                     # Backend-specific documentation
│   ├── 📄 Dockerfile                    # Docker image definition
│   ├── 📄 docker-compose.yml            # Local Docker setup
│   ├── 📄 vercel.json                   # Vercel serverless config
│   ├── 📄 render.yaml                   # Render.com deployment config
│   │
│   ├── 📂 src/
│   │   ├── 📄 server.js                 # Main Express app, routes, middleware setup
│   │   │
│   │   ├── 📂 controllers/              # Request handlers (business logic)
│   │   │   ├── authController.js        # Login, register, user management
│   │   │   ├── transactionController.js # Transactions CRUD + reports
│   │   │   ├── purchaseController.js    # Purchase items CRUD
│   │   │   ├── budgetController.js      # Budget plans CRUD
│   │   │   └── employeeController.js    # Employees CRUD + tax calculation
│   │   │
│   │   ├── 📂 routes/                   # API route definitions
│   │   │   ├── auth.js                  # /api/auth routes
│   │   │   ├── transactions.js          # /api/transactions routes
│   │   │   ├── purchase.js              # /api/purchase routes
│   │   │   ├── budget.js                # /api/budget routes
│   │   │   └── employees.js             # /api/employees routes
│   │   │
│   │   ├── 📂 models/                   # Database models & queries
│   │   │   └── index.js                 # User, Transaction, Purchase, Budget, Employee classes
│   │   │
│   │   ├── 📂 middleware/               # Express middleware
│   │   │   ├── auth.js                  # JWT authentication, authorization, role checking
│   │   │   └── upload.js                # File upload handling (multer, image optimization)
│   │   │
│   │   ├── 📂 utils/                    # Helper functions
│   │   │   └── helpers.js               # Password hashing, JWT, tax calculation, formatting
│   │   │
│   │   └── 📂 database/                 # Database initialization
│   │       └── db.js                    # SQLite connection, table creation, query wrappers
│   │
│   ├── 📂 database/                     # Database files (auto-created)
│   │   └── namsor.db                    # SQLite database file
│   │
│   ├── 📂 uploads/                      # Uploaded files storage
│   │   ├── .gitkeep
│   │   └── [uploaded files...]
│   │
│   └── 📂 node_modules/                 # Dependencies (created by npm install)
│
├── 🎨 frontend/                         # Static HTML/CSS/JavaScript Frontend
│   ├── 📄 package.json                  # Frontend metadata
│   ├── 📄 .gitignore
│   ├── 📄 vercel.json                   # Vercel static site config
│   ├── 📄 netlify.toml                  # Netlify deployment config
│   │
│   ├── 📄 login.html                    # ✅ Login page (READY TO USE)
│   ├── 📄 index.html                    # 📝 Main dashboard (needs API integration)
│   ├── 📄 hr.html                       # 📝 HR/Payroll page (needs API integration)
│   │
│   ├── 📂 js/
│   │   ├── api.js                       # ✅ API client library (handles all HTTP calls)
│   │   └── [other JS files...]
│   │
│   ├── 📂 css/
│   │   └── [style files...]
│   │
│   ├── 📂 assets/
│   │   └── [images, icons, etc...]
│   │
│   └── 📂 node_modules/
│
└── 📂 [original files - to be archived]
    ├── index.html                       # Original v3.0 (localStorage-based)
    └── hr.html                          # Original v3.0 (localStorage-based)

```

---

## 🔍 Key Files Explained

### Backend Core

| File | Purpose |
|------|---------|
| `backend/src/server.js` | Express app setup, middleware, route registration |
| `backend/src/database/db.js` | SQLite connection, table creation, query helpers |
| `backend/src/models/index.js` | Database models (User, Transaction, etc.) with queries |
| `backend/.env` | Environment variables (secrets, paths, config) |

### Controllers (Business Logic)

| File | Endpoints |
|------|-----------|
| `authController.js` | Login, register, user management |
| `transactionController.js` | Create/update/delete transactions, monthly summary |
| `purchaseController.js` | Equipment purchase tracking |
| `budgetController.js` | Budget planning and tracking |
| `employeeController.js` | Employee data, salary, tax calculation |

### Routes (Endpoints)

| File | Base Path | Methods |
|------|-----------|---------|
| `routes/auth.js` | `/api/auth` | POST login/register, GET users |
| `routes/transactions.js` | `/api/transactions` | GET/POST/PUT/DELETE |
| `routes/purchase.js` | `/api/purchase` | GET/POST/PUT/DELETE |
| `routes/budget.js` | `/api/budget` | GET/POST/PUT/DELETE |
| `routes/employees.js` | `/api/employees` | GET/POST/PUT/DELETE |

### Middleware

| File | Purpose |
|------|---------|
| `middleware/auth.js` | JWT verification, role-based access control |
| `middleware/upload.js` | File upload validation, image optimization |

### Frontend

| File | Purpose |
|------|---------|
| `frontend/login.html` | ✅ User login interface |
| `frontend/js/api.js` | ✅ API client with methods for all endpoints |
| `frontend/index.html` | 📝 Dashboard (integrate API into this) |
| `frontend/hr.html` | 📝 Payroll page (integrate API into this) |

---

## 📊 Database Tables

Created automatically by `backend/src/database/db.js`:

### Core Tables

1. **users** - User accounts
   - id, email, password (hashed), fullName, role, department, lastLogin

2. **transactions** - Income/Expense ledger
   - id, type (income/expense), amount, date, description, category, receiptId

3. **purchase_items** - Equipment/Materials
   - id, itemName, quantity, unitPrice, unit, date, receiptId

4. **budget_plans** - Monthly budgets
   - id, category, plannedAmount, actualAmount, month, year, signatures

5. **employees** - HR data
   - id, firstName, lastName, email, phone, position, department, salary

6. **payroll_records** - Salary calculations
   - id, employeeId, month, year, baseSalary, deductions, taxAmount, netSalary

7. **files** - Uploaded documents
   - id, fileName, filePath, mimeType, fileType (receipt/signature)

8. **audit_logs** - Activity tracking
   - id, action, entity, userId, timestamp

---

## 🔑 Environment Setup

### Backend .env

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=./database/namsor.db
JWT_SECRET=<generate-strong-random-string>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Frontend Configuration

In `js/api.js`:
- Auto-detects API URL based on environment
- Uses relative `/api` path in production
- Uses `http://localhost:5000/api` in development

---

## 🚀 Deployment Paths

### Option 1: Railway.app
- Connect GitHub repo
- Uses `backend/render.yaml` configuration
- Auto-deploys on git push

### Option 2: Render.com
- New Web Service from GitHub
- Uses `backend/render.yaml`
- Environment variables in dashboard

### Option 3: Vercel
- Backend: Uses `backend/vercel.json`
- Frontend: Uses `frontend/vercel.json`
- Deploy separately or together

### Option 4: Docker
- `docker-compose up` for local
- `docker build` for manual containerization
- Deploy container to any cloud

### Option 5: Self-Hosted
- Use `backend/Dockerfile`
- Run on any server with Node.js
- Configure reverse proxy (nginx)

---

## 📋 File Dependencies

### Core Dependencies

```json
{
  "backend": [
    "express",           // Web framework
    "sqlite3",          // Database
    "jsonwebtoken",     // JWT auth
    "bcrypt",           // Password hashing
    "multer",           // File upload
    "sharp",            // Image optimization
    "cors"              // Cross-origin requests
  ],
  "frontend": [
    "Fetch API",        // Built-in (no npm)
    "localStorage",     // Built-in (no npm)
  ]
}
```

---

## ✅ Setup Verification Checklist

```bash
# Backend ready?
cd backend && npm install && npm run migrate && npm run dev

# Frontend accessible?
cd frontend && python -m http.server 3000

# Can you login?
# http://localhost:3000/login.html

# Backend responding?
curl http://localhost:5000/health

# Can you create data?
# Try creating transaction in dashboard
```

---

## 🎯 Next Steps

1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `cd frontend && python -m http.server 3000`
3. **Copy original files**: `cp index.html hr.html frontend/`
4. **Integrate API** into copied HTML files
5. **Test locally** with sample data
6. **Deploy to cloud** (Railway/Render for backend, Vercel for frontend)
7. **Monitor production** logs

---

**Created**: June 2024  
**Version**: 3.1.0  
**Status**: Complete Backend, Frontend Ready for Integration
