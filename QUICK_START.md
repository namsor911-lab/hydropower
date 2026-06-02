# ⚡ 5-Minute Quick Start - Your First Run

**Everything is ready to use. Follow these exact steps.**

---

## 1️⃣ Windows - Run Setup Script

```bash
cd hydropower
setup.bat
```

This automatically:
- Installs dependencies
- Creates database
- Creates demo users
- Shows you the credentials

**Done!** Skip to step 3.

---

## 2️⃣ macOS/Linux - Manual Setup

```bash
# Terminal 1: Backend
cd backend
npm install
npm run migrate
npm run dev

# Wait for: "✓ Server running on http://localhost:5000"
```

Then in **Terminal 2**:
```bash
cd backend
node << 'EOF'
import { initDatabase } from './src/database/db.js';
import { User } from './src/models/index.js';

await initDatabase();
await User.create({
  email: 'admin@namsor.local',
  password: 'admin123',
  fullName: 'Administrator',
  role: 'admin'
});
await User.create({
  email: 'accountant@namsor.local',
  password: 'accountant123',
  fullName: 'Accountant',
  role: 'accountant'
});
console.log('✅ Users created');
process.exit(0);
EOF
```

---

## 3️⃣ Start Frontend

**Terminal 3:**
```bash
cd frontend
python -m http.server 3000
```

Wait for: `Serving HTTP on 0.0.0.0 port 3000`

---

## 4️⃣ Login & Test

**Open browser:** `http://localhost:3000/login.html`

**Use these credentials:**
```
Email: admin@namsor.local
Password: admin123
```

Click "ເຂົ້າລະບົບ" (Login)

---

## ✅ You Should See

After login, your dashboard loads with:
- ✅ Welcome message with your name
- ✅ "ພາບລວມການເງິນ" (Financial Overview)
- ✅ Navigation menu on left
- ✅ Your Lao language interface

---

## 🧪 Test Each Feature

### 1. Create a Transaction

1. Click "ບັນຊີລາຍການ" (Accounting)
2. Fill in transaction details
3. Click "ບັນທຶກ" (Save)
4. **Should appear in table immediately**

### 2. Upload a File

1. In transaction form, click upload area
2. Select any image file
3. **Should show preview**
4. Save transaction
5. **Receipt stored in backend**

### 3. Check Database

```bash
sqlite3 backend/database/namsor.db "SELECT * FROM transactions LIMIT 1;"
```

You'll see your data in the database!

---

## 🎯 Verify Everything Works

| Item | Status | How to Check |
|------|--------|-------------|
| Backend running | ✅ | Browser: `http://localhost:5000/health` |
| Frontend loading | ✅ | Browser: `http://localhost:3000/login.html` |
| Login works | ✅ | Use demo credentials |
| Create transaction | ✅ | Fill form and save |
| Data in database | ✅ | Run sqlite3 query above |
| File upload works | ✅ | Upload image, see preview |

---

## 🚀 Next: Integrate Your Original HTML

Once above works, follow [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) to connect your:
- `index.html` → Transactions/Dashboard
- `hr.html` → Employees/Payroll

---

## 🆘 Common Issues

### "Connection refused" on localhost:5000
→ Backend not running  
→ Open **Terminal 1** and check backend is running

### "No backend at http://localhost:5000"
→ Need to `cd backend` first  
→ Then `npm run dev`

### "CORS error" in browser
→ Backend .env needs updating  
→ Edit `backend/.env` and set: `CORS_ORIGIN=http://localhost:3000`  
→ Restart backend

### "Cannot create transaction"
→ Check browser console (F12) for errors  
→ Verify token: `localStorage.getItem('authToken')` in console

### "Database locked"
→ Close SQLite browser if open  
→ Kill Node: `killall node` (macOS/Linux) or Task Manager (Windows)  
→ Restart backend

---

## 📁 What's In Each Folder

```
backend/           → Your API server
├── src/           → Code (controllers, models, routes)
├── database/      → namsor.db (created automatically)
└── uploads/       → Receipts & files go here

frontend/          → Your UI
├── login.html     → Login page (ready!)
├── index.html     → Dashboard (needs integration)
├── hr.html        → Payroll (needs integration)
└── js/api.js      → API client (ready!)
```

---

## 🎓 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@namsor.local | admin123 |
| Accountant | accountant@namsor.local | accountant123 |
| Viewer | viewer@namsor.local | viewer123 |

Each has different permissions!

---

## 📚 Documentation

| Need | Read |
|------|------|
| How to integrate old HTML | [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) |
| How to deploy to cloud | [SETUP.md](./SETUP.md) - Deployment section |
| API endpoints reference | [backend/README.md](./backend/README.md) |
| Troubleshooting | [HANDBOOK.md](./HANDBOOK.md) |
| File structure | [STRUCTURE.md](./STRUCTURE.md) |

---

## ✨ What Happens Next

### Week 1
- ✅ Verify everything works locally (you're here!)
- 📝 Integrate your `index.html` with API
- 📝 Integrate your `hr.html` with API
- ✅ Test with sample data

### Week 2
- 🚀 Deploy backend to Railway/Render
- 🚀 Deploy frontend to Vercel
- 🔐 Set up custom domain

### Week 3
- ✅ Migrate old data (if needed)
- ✅ Train team
- ✅ Go live!

---

## 🎉 You Did It!

You now have:
- ✅ Working authentication
- ✅ Real database (not localStorage!)
- ✅ Multi-user system
- ✅ File uploads
- ✅ Lao language interface
- ✅ Production-ready backend

**Next step:** Read [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) to connect your original HTML files.

---

**Questions?** All answers in [HANDBOOK.md](./HANDBOOK.md)

**Ready to deploy?** See [SETUP.md](./SETUP.md) - Deployment section
