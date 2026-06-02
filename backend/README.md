# Namsor Hydropower Accounting System - Backend API

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env and set your secret keys
```

3. **Initialize database**
```bash
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - Login with email/password
- `POST /register` - Register new user
- `GET /me` - Get current user profile
- `GET /users` - List all users (admin only)
- `PUT /users/:id` - Update user (admin only)

### Transactions (`/api/transactions`)
- `POST /` - Create transaction
- `GET /` - List transactions (filters: type, startDate, endDate)
- `GET /:id` - Get transaction details
- `PUT /:id` - Update transaction (accountant+)
- `DELETE /:id` - Delete transaction (accountant+)
- `GET /summary?month=X&year=Y` - Monthly summary
- `GET /chart/monthly?year=Y` - 12-month chart data

### Purchase Items (`/api/purchase`)
- `POST /` - Create purchase item
- `GET /` - List purchase items
- `GET /:id` - Get purchase item details
- `PUT /:id` - Update (accountant+)
- `DELETE /:id` - Delete (accountant+)

### Budget Plans (`/api/budget`)
- `POST /` - Create budget (accountant+)
- `GET /?year=Y&month=M` - Get budget for month
- `GET /:id` - Get budget details
- `PUT /:id` - Update budget (accountant+)
- `DELETE /:id` - Delete budget (admin only)

### Employees (`/api/employees`)
- `POST /` - Create employee (accountant+)
- `GET /` - List all employees
- `GET /:id` - Get employee details
- `PUT /:id` - Update employee (accountant+)
- `DELETE /:id` - Delete employee (admin only)

### File Upload (`/api/upload`)
- `POST /` - Upload receipt/document (multipart/form-data)
- `POST /upload-base64` - Upload base64 signature

## Environment Variables

```
DATABASE_URL=./database/namsor.db
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

## User Roles

- **admin** - Full access to all features and user management
- **accountant** - Can create/edit transactions, budgets, employees
- **viewer** - Read-only access to reports and data

## Database Schema

Uses SQLite with tables:
- `users` - User accounts with roles
- `transactions` - Income/expense ledger
- `purchase_items` - Equipment/material tracking
- `budget_plans` - Monthly budget plans
- `employees` - HR employee data
- `payroll_records` - Payroll calculations
- `files` - Uploaded receipts/signatures
- `audit_logs` - Activity log

## Deployment

### Railway.app
```bash
npm install
npm run start
```

### Render.com
Configure in `render.yaml` or use Dockerfile

### Vercel (Serverless)
Use `vercel.json` configuration

## Tax Calculation

Lao progressive tax brackets (annual):
- 0-3M₭: 0%
- 3M-9M₭: 5%
- 9M-15M₭: 10%
- 15M+₭: 15%

## License

MIT
