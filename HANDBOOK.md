# 👨‍💻 Developer Handbook - Namsor Accounting System v3.1

Complete guide for developers working on or maintaining the system.

---

## 🗺️ Quick Navigation

| Need Help With | Read This |
|---|---|
| **Getting started** | [SETUP.md](./SETUP.md) |
| **What's included** | [STATUS.md](./STATUS.md) |
| **Folder structure** | [STRUCTURE.md](./STRUCTURE.md) |
| **Project overview** | [README.md](./README.md) |
| **Backend API docs** | [backend/README.md](./backend/README.md) |
| **Migrating from v3.0** | [MIGRATION.md](./MIGRATION.md) |
| **THIS FILE** | You are here! |

---

## 🚀 Common Tasks

### Start Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
python -m http.server 3000

# Terminal 3: Optional - Database browser
sqlite3 backend/database/namsor.db
```

### Add New Feature

#### Example: Add "Monthly Revenue Report" page

**1. Add database function** (if needed)

```javascript
// backend/src/models/index.js
class Report {
  static async getMonthlyRevenue(month, year) {
    const sql = `
      SELECT 
        category,
        SUM(amount) as total
      FROM transactions
      WHERE type = 'income'
        AND strftime('%m', date) = ?
        AND strftime('%Y', date) = ?
      GROUP BY category
    `;
    return allAsync(sql, [
      String(month).padStart(2, '0'),
      String(year)
    ]);
  }
}
export { Report };
```

**2. Add controller function**

```javascript
// backend/src/controllers/reportController.js
import { Report } from '../models/index.js';

export const getMonthlyRevenue = async (req, res) => {
  try {
    const { month, year } = req.query;
    const data = await Report.getMonthlyRevenue(month, year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};
```

**3. Add route**

```javascript
// backend/src/routes/reports.js (new file)
import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.get('/monthly-revenue', authenticate, reportController.getMonthlyRevenue);
export default router;
```

**4. Register route in server**

```javascript
// backend/src/server.js
import reportRoutes from './routes/reports.js';
app.use('/api/reports', reportRoutes);
```

**5. Add to API client**

```javascript
// frontend/js/api.js
export const Reports = {
  getMonthlyRevenue: (month, year) => 
    apiCall('GET', `/reports/monthly-revenue?month=${month}&year=${year}`)
};
```

**6. Create frontend page**

```html
<!-- frontend/reports.html -->
<!DOCTYPE html>
<html>
<body>
  <h1>ລາຍງານລາຍໄດ້ປະຈຳເດືອນ</h1>
  <div id="report"></div>
  
  <script type="module">
    import { Reports } from './js/api.js';
    
    async function loadReport() {
      const today = new Date();
      const data = await Reports.getMonthlyRevenue(
        today.getMonth() + 1,
        today.getFullYear()
      );
      document.getElementById('report').innerHTML = 
        data.map(r => `<p>${r.category}: ${r.total}₭</p>`).join('');
    }
    
    window.addEventListener('load', loadReport);
  </script>
</body>
</html>
```

---

## 🐛 Debugging

### Check Backend Logs

```bash
# Terminal shows all console.log() output
# Look for:
# - "✓ Server running on..."
# - "✓ Connected to SQLite database"
# - Error messages with stack traces
```

### Database Debugging

```bash
sqlite3 backend/database/namsor.db

# View all data
SELECT * FROM transactions;

# Check for specific user
SELECT * FROM users WHERE email = 'admin@namsor.local';

# Count records
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM users;

# Find errors
SELECT * FROM audit_logs WHERE action LIKE '%error%';
```

### Frontend Debugging

**Browser DevTools:**

1. Open DevTools (F12)
2. **Network tab**: See API requests and responses
3. **Console tab**: JavaScript errors
4. **Application tab**: localStorage and session
5. **Sources tab**: Set breakpoints in code

```javascript
// Add debug logging to frontend
console.log('User token:', localStorage.getItem('authToken'));
console.log('Current user:', JSON.parse(localStorage.getItem('currentUser')));
```

### API Testing

```bash
# Test endpoint
curl -X GET http://localhost:5000/health

# Test with authentication
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@namsor.local","password":"admin123"}' | jq -r '.token')

curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📦 Dependency Management

### Add New Dependency

```bash
cd backend
npm install package-name --save

# Or development only
npm install package-name --save-dev
```

Update `package.json` automatically.

### Update Dependencies

```bash
cd backend

# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package@latest --save
```

### Lock Dependencies

```bash
# Generate lock file
npm install

# This creates package-lock.json for reproducible installs
```

---

## 🔐 Security Best Practices

### ✅ DO

- [x] Hash passwords with bcrypt
- [x] Use JWT tokens with expiration
- [x] Validate all inputs
- [x] Check user roles before operations
- [x] Use HTTPS in production
- [x] Store secrets in .env, never in code
- [x] Update dependencies regularly
- [x] Use prepared SQL statements

### ❌ DON'T

- [ ] Store passwords in plain text
- [ ] Hardcode secrets in code
- [ ] Trust user input blindly
- [ ] Expose error details to users
- [ ] Allow unlimited file uploads
- [ ] Use deprecated dependencies
- [ ] Run as root in production
- [ ] Log sensitive data

### Environment Variable Secrets

```bash
# Never commit .env file
# Add to .gitignore ✓

# Instead, use .env.example with placeholders
DATABASE_URL=./database/namsor.db
JWT_SECRET=change-this-to-a-secure-random-string
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create user and login
- [ ] Create transaction
- [ ] Transaction appears in dashboard
- [ ] Upload receipt file
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Try to access admin page as viewer (should be blocked)
- [ ] Token expires and re-login required

### Load Testing (Production)

```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Test endpoint
ab -n 1000 -c 10 http://localhost:5000/health

# Test with auth
# This requires custom script or tool like k6/JMeter
```

---

## 📈 Performance Optimization

### Database Optimization

```sql
-- Create indexes on frequently queried fields
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_employees_department ON employees(department);

-- Analyze query performance
EXPLAIN QUERY PLAN SELECT * FROM transactions WHERE date = '2024-01-01';
```

### API Optimization

```javascript
// Add caching for reports (backend)
const cache = new Map();

export const getMonthlyChart = async (req, res) => {
  const { year } = req.query;
  const cacheKey = `chart_${year}`;
  
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  
  // ... fetch data ...
  
  cache.set(cacheKey, data);
  res.json(data);
};

// Clear cache when data changes
export const createTransaction = async (req, res) => {
  // ... create transaction ...
  
  // Invalidate cache
  cache.clear();
  
  res.json(transaction);
};
```

### Frontend Optimization

```javascript
// Lazy load API calls
async function loadTransactions() {
  // Only load when user navigates to page
  if (!window.transactionsLoaded) {
    window.transactions = await Transactions.getAll();
    window.transactionsLoaded = true;
  }
  renderTransactions(window.transactions);
}
```

---

## 🐳 Docker Cheat Sheet

```bash
# Build image
docker build -t namsor-api backend/

# List images
docker images

# Run container
docker run -d -p 5000:5000 namsor-api

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Using docker-compose
docker-compose up                 # Start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose ps                 # Status
```

---

## 🚀 Production Deployment Checklist

Before going live:

- [ ] All secrets in .env (not hardcoded)
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] CORS properly configured
- [ ] File upload limits set
- [ ] Rate limiting enabled (optional)
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] Database indexes created
- [ ] Test full user flow
- [ ] Backup and restore tested
- [ ] Domain pointing to server

### Production .env Example

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=/opt/namsor/database/namsor.db
JWT_SECRET=<generate-64-char-random-string>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://namsor.example.com,https://www.namsor.example.com
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/opt/namsor/uploads
```

---

## 🔄 Git Workflow

### Commit Messages

```bash
# Good commit messages
git commit -m "feat: Add monthly revenue report endpoint"
git commit -m "fix: Correct tax calculation for 5% bracket"
git commit -m "docs: Update deployment guide"
git commit -m "refactor: Extract validation logic to utils"

# Avoid
git commit -m "updates"
git commit -m "WIP"
git commit -m "asdfasdf"
```

### Branching

```bash
# Feature branch
git checkout -b feature/monthly-reports
git add .
git commit -m "feat: Add monthly reports"
git push origin feature/monthly-reports
# Create Pull Request on GitHub

# Bugfix branch
git checkout -b bugfix/transaction-calculation
# ...fixes...
git push origin bugfix/transaction-calculation

# Hotfix branch (emergency production fix)
git checkout -b hotfix/critical-login-bug
# ...fix...
git push origin hotfix/critical-login-bug
```

---

## 📚 Code Style Guide

### JavaScript Naming Conventions

```javascript
// Constants (UPPER_SNAKE_CASE)
const MAX_FILE_SIZE = 5242880;
const JWT_SECRET = process.env.JWT_SECRET;

// Functions (camelCase)
async function loadTransactions() { }
export const getUserById = async (id) => { };

// Classes (PascalCase)
class Transaction { }
class User { }

// Private variables (leading underscore)
const _internalId = uuid();

// Booleans (is/has prefix)
const isActive = true;
const hasPermission = false;
```

### Async/Await Pattern

```javascript
// ✅ Preferred
async function createTransaction(data) {
  try {
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (err) {
    throw new Error('Transaction creation failed');
  }
}

// ❌ Avoid
function createTransaction(data) {
  return new Promise((resolve, reject) => {
    Transaction.create(data)
      .then(t => resolve(t))
      .catch(e => reject(e));
  });
}
```

---

## 🆘 Emergency Procedures

### Database Corrupted

```bash
# 1. Restore from backup
cp namsor-backup-20240602.db backend/database/namsor.db

# 2. Restart server
kill %1  # Stop backend
npm run dev

# 3. Verify data
sqlite3 backend/database/namsor.db "SELECT COUNT(*) FROM transactions;"
```

### Server Won't Start

```bash
# Check port in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Restart
cd backend && npm run dev
```

### Frontend Blank

```bash
# Check browser console (F12)
# Usually missing API URL or auth token

# Clear localStorage and try again
localStorage.clear();
location.reload();

# Check backend is running
curl http://localhost:5000/health
```

### Forgot Admin Password

```bash
# Create new admin user
sqlite3 backend/database/namsor.db

# Delete old user
DELETE FROM users WHERE email = 'admin@namsor.local';

# Exit sqlite3 and create new user via API
cd backend
node -e "
import { User, initDatabase } from './src/models/index.js';
await initDatabase();
const u = await User.create({email: 'admin@namsor.local', password: 'newpass', fullName: 'Admin', role: 'admin'});
console.log('Created:', u.email);
"
```

---

## 📞 Getting Help

### Error: "CORS policy"
→ Check `CORS_ORIGIN` in `.env` includes your frontend URL

### Error: "401 Unauthorized"
→ Check token is valid: `localStorage.getItem('authToken')`

### Error: "Cannot find module"
→ Run `npm install` in backend folder

### Error: "EADDRINUSE"
→ Port 5000 already in use: `killall node`

### Error: "Database locked"
→ Close other connections: `killall sqlite3`

---

## 📖 Useful Resources

- [Express.js Guide](https://expressjs.com/api.html)
- [SQLite Documentation](https://www.sqlite.org/index.html)
- [JWT.io](https://jwt.io/) - JWT debugger and info
- [Postman API Testing](https://www.postman.com/)
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 🎯 Your First Contribution

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd hydropower
   ```

2. **Set up locally**
   ```bash
   npm run setup
   cd backend && npm run migrate && npm run dev
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes**
   - Add your code
   - Test thoroughly
   - Update docs if needed

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: Description of your change"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Add description of changes
   - Reference any related issues
   - Wait for review

---

## 🏆 Best Practices Summary

### Write Clean Code
- ✅ Use meaningful variable names
- ✅ Add comments for complex logic
- ✅ Keep functions focused and small
- ✅ Follow consistent formatting

### Test Your Changes
- ✅ Test locally before committing
- ✅ Test with different user roles
- ✅ Test edge cases (empty data, large files, etc.)
- ✅ Test on different browsers

### Document Your Work
- ✅ Update README for new features
- ✅ Add inline comments
- ✅ Update API documentation
- ✅ Record breaking changes

### Security First
- ✅ Validate user input
- ✅ Check permissions
- ✅ Use environment variables for secrets
- ✅ Keep dependencies updated

---

**Last Updated**: June 2024  
**Version**: 3.1.0  
**Status**: Production Ready  

**Questions?** Check the relevant README or SETUP guide first!
