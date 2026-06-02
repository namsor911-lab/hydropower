# 🚀 Complete Deployment Guide

**One-Command Deployment for Namsor Accounting System**

---

## ⚡ Quick Start (Railway - Recommended)

Railway is the easiest option for SQLite-based apps.

### Option 1: Web Interface (Easiest)
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to railway.app and connect your GitHub repo
# 3. Railway auto-deploys! Done! ✅
```

### Option 2: Command Line (Fastest)
```bash
# Windows
deploy-railway.bat

# macOS/Linux
bash deploy-railway.sh
```

**That's it! Your app is live in 2-3 minutes.** 🎉

---

## 📋 Prerequisites

Before deploying, make sure:

### For All Platforms:
- ✅ Git repository initialized: `git init`
- ✅ Code committed: `git add . && git commit -m "Initial commit"`
- ✅ GitHub account: https://github.com

### Platform-Specific:

**Railway.app:**
- ✅ Account created: https://railway.app
- ✅ GitHub connected

**Render.com:**
- ✅ Account created: https://render.com
- ✅ GitHub connected

**Vercel:**
- ✅ Account created: https://vercel.com
- ✅ GitHub connected

---

## 🚀 Deployment Options

### **OPTION 1: Railway.app (Recommended)** ⭐

**Best for:** Full-stack apps with SQLite  
**Cost:** Free $5 credit/month (enough for small app)  
**Setup time:** 5 minutes

#### Step 1: Prepare Code
```bash
git add .
git commit -m "Deployment ready"
git push origin main
```

#### Step 2: Create Railway Account
1. Go to https://railway.app
2. Sign in with GitHub
3. Connect your GitHub repository

#### Step 3: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select branch: `main`

#### Step 4: Railway Auto-Detects Config
Railway automatically uses `railway.json` and `Dockerfile`

#### Step 5: Set Environment Variables
In Railway dashboard:
- `NODE_ENV` = `production`
- `JWT_SECRET` = Generate a random string
- `CORS_ORIGIN` = Your Railway domain (appears after deploy)
- `PORT` = `5000`

#### Step 6: Deploy
Click "Deploy" - Railway will:
- Build Docker image ✅
- Create SQLite database ✅
- Run migrations ✅
- Create admin user ✅
- Start server ✅

#### Step 7: Get Live URL
Railway shows you: `https://your-app.railway.app`

#### Result:
- ✅ Backend API running
- ✅ Frontend static files served
- ✅ SQLite database persistent
- ✅ Auto-HTTPS
- ✅ Auto-backups

---

### **OPTION 2: Render.com** 

**Best for:** Free tier with persistent disk  
**Cost:** Free with persistent disk  
**Setup time:** 10 minutes

#### Step 1: Prepare Code
```bash
git push origin main
```

#### Step 2: Create Render Account
1. Go to https://render.com
2. Sign in with GitHub
3. Connect repository

#### Step 3: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Choose your repository

#### Step 4: Configure Service

Fill in:
```
Name: namsor-accounting
Environment: Node
Region: Closest to you
Build Command: cd backend && npm ci && npm run migrate
Start Command: cd backend && npm run start
Plan: Free
```

#### Step 5: Add Environment Variables
```
NODE_ENV=production
JWT_SECRET=<generate-random>
CORS_ORIGIN=<your-render-domain>
PORT=5000
DATABASE_URL=/var/data/namsor.db
```

#### Step 6: Add Persistent Disk
1. Go to "Disk" tab
2. Create new disk: `/var/data`
3. Size: 1GB

#### Step 7: Deploy
Click "Create Web Service" - Render will deploy automatically

#### Result:
- ✅ Backend API running
- ✅ Database persists on disk
- ✅ Auto-deploys on git push
- ✅ Auto-HTTPS

---

### **OPTION 3: Vercel** (Frontend Only)

**Best for:** Frontend only (static files)  
**Cost:** Free  
**Setup time:** 3 minutes  
**Note:** Need separate backend on Railway/Render

#### Step 1: Push to GitHub
```bash
git push origin main
```

#### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your repository

#### Step 3: Configure Project
```
Framework: Other
Root Directory: ./frontend
```

#### Step 4: Deploy
Click "Deploy" - Vercel handles it automatically

#### Step 5: Update API Calls
Your frontend needs to point to backend URL:

Edit `frontend/js/api.js`:
```javascript
const API_BASE = 'https://your-railway-app.railway.app/api';
// or
const API_BASE = 'https://your-render-app.onrender.com/api';
```

#### Result:
- ✅ Frontend on Vercel
- ✅ Fast CDN delivery
- ✅ Auto-deploys on git push

---

## 🔧 Using npm Scripts for Deployment

### Railway
```bash
npm run deploy:railway
```

Runs: `bash deploy-railway.sh`

### Render
```bash
npm run deploy:render
```

Runs: `bash deploy-render.sh`

### Vercel
```bash
npm run deploy:vercel
```

Runs: `bash deploy-vercel.sh`

---

## 🤖 GitHub Actions CI/CD

Automatic deployment on every git push!

### Setup

1. **Create GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `repo` scope
   - Copy token

2. **Add to GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: Paste your Railway token

3. **Workflow Triggers:**
   - `.github/workflows/deploy.yml` runs on every push to `main` branch
   - Automatically deploys to Railway
   - Shows results in Actions tab

### View Deployment Logs
```
GitHub → Actions → Deployment workflow → Click latest run
```

---

## 📊 Environment Variables Explained

### Production

```env
# Node environment
NODE_ENV=production

# Server port
PORT=5000

# JWT secret (generate: openssl rand -base64 32)
JWT_SECRET=your-super-secret-key-32-chars

# CORS origin (your deployment domain)
CORS_ORIGIN=https://your-app.railway.app

# Database path (for SQLite)
DATABASE_URL=/app/backend/database/namsor.db

# Admin credentials (created on startup)
ADMIN_PASSWORD=admin123
ACCOUNTANT_PASSWORD=accountant123
VIEWER_PASSWORD=viewer123
```

### Generate Secure JWT Secret
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# Or use random string from password manager
```

---

## ✅ Verify Deployment

### Test API Health
```bash
# Replace with your domain
curl https://your-app.railway.app/health

# Expected response:
# {"status":"ok","timestamp":"2026-06-02T..."}
```

### Test Login
1. Open: `https://your-app.railway.app/login.html`
2. Email: `admin@namsor.local`
3. Password: `admin123`
4. Click "ເຂົ້າລະບົບ" (Login)

### Check Database
1. Go to platform dashboard (Railway/Render)
2. View logs
3. Should see: "✨ Production setup complete!"

---

## 🔒 Security Best Practices

### Before Deploying

1. **Generate Strong JWT Secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Change Default Passwords:**
   - Don't use default credentials in production
   - Set via environment variables

3. **Enable HTTPS:**
   - Railway/Render: Automatic ✅
   - Vercel: Automatic ✅

4. **Restrict CORS:**
   - Set `CORS_ORIGIN` to your domain only
   - Not `*`

5. **Hide Secrets:**
   - Use environment variables
   - Never commit `.env` file
   - Use platform's secret manager

---

## 🚨 Troubleshooting

### "Database Error" on Deployment

**Problem:** Migration failed
**Solution:** 
```bash
# Check logs in platform dashboard
# Ensure database path is writable
# Verify directory exists
```

### "Cannot find module" Error

**Problem:** Dependencies not installed
**Solution:**
```bash
# Clear build cache in platform dashboard
# Trigger redeploy
# Check if all node_modules installed
```

### "CORS Error" in Browser

**Problem:** Frontend can't reach API
**Solution:**
```env
# Set CORS_ORIGIN correctly
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### "404 Not Found"

**Problem:** Endpoint doesn't exist
**Solution:**
```bash
# Verify all routes are registered in server.js
# Check API endpoint names match
# View backend logs
```

### "Connection Refused"

**Problem:** Backend not running
**Solution:**
```bash
# Check if backend service is running
# View platform dashboard logs
# Restart service in dashboard
```

---

## 📊 Monitoring Deployment

### Railway Dashboard
- Go to https://railway.app
- Click your project
- View logs in real-time
- See deployments history
- Monitor resource usage

### Render Dashboard
- Go to https://dashboard.render.com
- Click your service
- View logs
- Manage environment variables

### Vercel Dashboard
- Go to https://vercel.com/dashboard
- Click your project
- View deployments
- Check analytics

---

## 🔄 Automatic Deployment on Git Push

### How It Works

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "New feature"
   git push origin main
   ```

2. **Webhook Triggered**
   - GitHub notifies platform
   - Platform starts build

3. **Build Process**
   - Install dependencies
   - Run migrations
   - Run tests (if configured)
   - Create Docker image

4. **Deploy**
   - Start new instance
   - Run setup script
   - Create admin user
   - Start server

5. **Go Live**
   - Old instance stops
   - New instance serves traffic
   - No downtime (usually)

### View Deployment Status
- Railway: Dashboard → Deployments
- Render: Dashboard → Events
- Vercel: Dashboard → Deployments

---

## 🎯 Post-Deployment Checklist

- [ ] Verify health check: `/health` returns `{"status":"ok"}`
- [ ] Login page loads: `/login.html`
- [ ] Can login with admin@namsor.local / admin123
- [ ] Can create transaction
- [ ] Can upload file
- [ ] Data persists after restart
- [ ] Check database has tables
- [ ] Review logs for errors
- [ ] Test on mobile device
- [ ] Share link with team

---

## 💾 Database Backups

### Railway
- Go to dashboard
- Click your service
- Data backed up automatically
- Download backups as SQLite file

### Render
- Persistent disk backed up
- Download from dashboard
- Export as SQLite

### Manual Backup
```bash
# Download database file
# Keep local copy
# Commit to git (optional, database is large)
```

---

## 🔄 Updating After Deployment

### Make Changes Locally
```bash
# Edit code
npm run dev  # Test locally

# Commit and push
git add .
git commit -m "Bug fix"
git push origin main
```

### Auto-Deployment
- GitHub webhook triggers
- Platform redeploys automatically
- Changes live in 2-5 minutes

### Manual Redeploy (if needed)
```bash
npm run deploy:railway  # or render/vercel
```

---

## 🆘 Getting Help

### Check Platform Documentation
- **Railway:** https://docs.railway.app
- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs

### Common Issues
See Troubleshooting section above

### Logs
- Platform dashboard always shows real-time logs
- Check for error messages
- Google the error message

---

## 📈 Scaling Deployment

### When You Have More Users

**SQLite Limitations:**
- Works great for 10-50 concurrent users
- Single file database can be slow with many users

**Upgrade to PostgreSQL:**
1. Create PostgreSQL database
2. Update DATABASE_URL in environment
3. Run migrations against PostgreSQL
4. Redeploy

Platforms where you can add PostgreSQL:
- **Railway:** Built-in PostgreSQL service
- **Render:** Built-in PostgreSQL service
- **Vercel:** Use external service like Supabase

---

## ✨ You're Live!

Your accounting system is now live on the internet! 🎉

### Share With Team
```
https://your-app.railway.app/login.html
```

### Default Credentials
```
Admin:      admin@namsor.local / admin123
Accountant: accountant@namsor.local / accountant123
Viewer:     viewer@namsor.local / viewer123
```

### Next Steps
1. Train team members
2. Migrate existing data (if needed)
3. Monitor performance
4. Add more features
5. Scale as needed

---

## 🎯 Recommended Deployment Stack

| Component | Platform | Reason |
|-----------|----------|--------|
| **Backend** | Railway.app | Easy, SQLite-friendly, $5 free credit |
| **Frontend** | Railway (same) or Vercel | Same platform or CDN |
| **Database** | SQLite on Railway | No setup, automatic backups |
| **CI/CD** | GitHub Actions | Free, integrated |
| **Secrets** | Platform's secret manager | Secure, encrypted |

---

**Ready to deploy? Start with Option 1 above!** 🚀

Questions? Check the troubleshooting section or your platform's documentation.

Your app will be live in minutes! ✨
