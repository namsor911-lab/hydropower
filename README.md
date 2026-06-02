# Namsor Hydropower Accounting System

Complete full-stack accounting and HR management system for Nam Sor Hydropower Dam (ເຂື່ອນໄຟຟ້ານ້ຳຊໍ້).

## ✨ Features

- **Dashboard** - Financial overview with charts and statistics
- **Accounting** - Income/Expense transaction management with signatures
- **Budget Planning** - Monthly budget planning with actual vs planned comparison
- **Purchase Management** - Equipment and material purchase tracking
- **HR/Payroll** - Employee management with Lao tax calculation
- **Reports** - Quarterly and annual financial summaries
- **Role-Based Access** - Admin, Accountant, and Viewer roles
- **Multi-language** - Full Lao language support
- **File Uploads** - Receipt and signature attachment support
- **Audit Trail** - Complete activity logging

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT
- **File Handling**: Multer + Sharp
- **Language**: JavaScript (ES modules)

### Frontend
- **Markup**: HTML5
- **Styling**: CSS3
- **Client**: Vanilla JavaScript
- **API Communication**: Fetch API
- **UI Framework**: Custom dark theme

## 📦 Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Python 3 (for serving frontend locally)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env and configure:
# - JWT_SECRET (strong random string)
# - DATABASE_URL (database location)
# - CORS_ORIGIN (frontend URL)

npm run migrate    # Initialize database
npm run dev        # Start development server
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
python -m http.server 3000
# or use: npm run dev
```

Frontend runs on `http://localhost:3000`

### First Login

1. Navigate to `http://localhost:3000/login.html`
2. Backend will auto-create demo users on first run, or:

```bash
# In backend src/database/init.js, add:
await User.create({
  email: 'admin@namsor.local',
  password: 'password123',
  fullName: 'System Admin',
  role: 'admin'
});
```

## 🚀 Deployment

### Railway.app
```bash
git push railway main
# Automatically deploys with railway.yaml config
```

### Render.com
```bash
# Connect GitHub repository
# Render auto-detects render.yaml
# Set environment variables in dashboard
```

### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

### Docker
```bash
docker-compose up -d
# Or build and push to registry
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user

### Transactions
- `GET /api/transactions` - List
- `POST /api/transactions` - Create
- `PUT /api/transactions/:id` - Update
- `DELETE /api/transactions/:id` - Delete
- `GET /api/transactions/summary?month=1&year=2024` - Monthly summary
- `GET /api/transactions/chart/monthly?year=2024` - 12-month chart

### Purchase Items
- `GET /api/purchase` - List
- `POST /api/purchase` - Create
- `PUT /api/purchase/:id` - Update
- `DELETE /api/purchase/:id` - Delete

### Budget Plans
- `GET /api/budget?year=2024&month=1` - Get monthly budget
- `POST /api/budget` - Create
- `PUT /api/budget/:id` - Update
- `DELETE /api/budget/:id` - Delete

### Employees
- `GET /api/employees` - List
- `POST /api/employees` - Create
- `PUT /api/employees/:id` - Update
- `DELETE /api/employees/:id` - Delete

### File Upload
- `POST /api/upload` - Upload file (multipart/form-data)
- `POST /api/upload-base64` - Upload base64 (signature)

## 👥 User Roles

| Role | Permissions |
|------|------------|
| Admin | Full access, user management, system settings |
| Accountant | Create/edit transactions, budgets, employees, reports |
| Viewer | Read-only access to reports and data |

## 🔐 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS configuration
- SQL injection protection via parameterized queries
- File upload validation and size limits

## 💾 Database Schema

- **users** - User accounts and roles
- **transactions** - Income/expense records
- **purchase_items** - Equipment/material purchases
- **budget_plans** - Monthly budgets
- **employees** - HR employee data
- **payroll_records** - Payroll calculations
- **files** - Uploaded receipts/signatures
- **audit_logs** - Activity trail

## 📊 Lao Tax Calculation

Progressive annual tax brackets:
- 0 - 3,000,000₭: 0%
- 3,000,001 - 9,000,000₭: 5%
- 9,000,001 - 15,000,000₭: 10%
- 15,000,001+₭: 15%

## 🌐 Internationalization

- **Primary**: Lao (ລາວ)
- **Secondary**: English
- Custom fonts: IBM Plex Sans Thai for Lao support
- Monospace: IBM Plex Mono for numbers

## 🎨 UI/UX

- Dark mode by default (GitHub-inspired theme)
- Responsive design for desktop/tablet/mobile
- Keyboard navigation support
- Accessibility features (ARIA labels, semantic HTML)
- Print-friendly layouts

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 🔧 Environment Variables

### Backend

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=./database/namsor.db
JWT_SECRET=<random-secret-key>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Frontend

API endpoint auto-detected from relative path `/api`

## 📝 Logging

- Backend logs to console (DEV) and file (PROD)
- Database audit trail via `audit_logs` table
- User actions tracked with timestamp and IP

## 🧪 Testing

```bash
# Backend tests (when available)
npm test

# Manual API testing
curl -X GET http://localhost:5000/health
```

## 📖 Documentation

- [Migration Guide](./MIGRATION.md) - From v3.0 (localStorage) to v3.1 (Backend)
- [Backend README](./backend/README.md) - Backend setup and API
- [System Analysis](./SYSTEM_ANALYSIS.md) - Data models and architecture

## 📄 License

MIT License

## 👨‍💼 Author

Nam Sor Hydropower Dam  
Accounting & Finance Department  
2024

---

**Version**: 3.1  
**Status**: Production Ready  
**Last Updated**: June 2024
