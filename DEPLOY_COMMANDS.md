# ⚡ COPY-PASTE COMMANDS - Deploy In 5 Minutes

**Copy and run these exact commands to deploy your app**

---

## 🚀 Railway.app Deployment (Recommended)

### For Windows Users

**Step 1: Navigate to project**
```powershell
cd d:\hydropower
```

**Step 2: Prepare code**
```powershell
git add .
git commit -m "Ready for production deployment"
git push origin main
```

**Step 3: Deploy**
```powershell
deploy-railway.bat
```

**That's it!** Your app will be live in 2-3 minutes.

---

### For macOS/Linux Users

**Step 1: Navigate to project**
```bash
cd ~/your-project-path/hydropower
```

**Step 2: Prepare code**
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

**Step 3: Deploy**
```bash
bash deploy-railway.sh
```

**That's it!** Your app will be live in 2-3 minutes.

---

## 🔄 Using npm Scripts (All Platforms)

Instead of running shell scripts, you can use npm:

```bash
npm run deploy:railway    # Railway
npm run deploy:render     # Render
npm run deploy:vercel     # Vercel
```

---

## 🤖 GitHub Actions Auto-Deployment (Optional)

**Setup automatic deployment on every git push:**

### Step 1: Get Railway Token
1. Go to https://railway.app/dashboard
2. Click your profile (top right)
3. Go to "Account" → "API Tokens"
4. Create new token and copy it

### Step 2: Add to GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `RAILWAY_TOKEN`
5. Value: Paste your Railway token
6. Click "Add secret"

### Step 3: Deploy
```bash
git add .
git commit -m "Trigger auto-deployment"
git push origin main
```

**Your app automatically deploys!** 🤖

Check: GitHub → Actions → See it deploying

---

## ✅ Verify Deployment Works

After deployment:

### Test 1: Check Health
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-06-02T..."}
```

### Test 2: Load Login Page
```
Open in browser: https://your-app.railway.app/login.html
```

### Test 3: Login
```
Email: admin@namsor.local
Password: admin123
Click: ເຂົ້າລະບົບ (Login)
```

### Test 4: Create Transaction
1. After login, click "ບັນຊີລາຍການ" (Accounting)
2. Fill in transaction details
3. Click "ບັນທຶກ" (Save)
4. Should appear in list immediately

---

## 🎯 Pre-Deployment Checklist

Run before deploying:

### Windows
```powershell
prepare-deployment.bat
```

### macOS/Linux
```bash
bash prepare-deployment.sh
```

This checks:
- ✅ Git initialized
- ✅ Changes committed
- ✅ GitHub remote set
- ✅ Code pushed
- ✅ Dependencies installed
- ✅ All config files present

---

## 🔍 View Deployment Logs

### Railway Dashboard
1. Go to https://railway.app/dashboard
2. Click your project
3. View "Deployments" tab
4. See real-time logs

### GitHub Actions
1. Go to your GitHub repo
2. Click "Actions" tab
3. See all deployment runs
4. Click latest to view logs

---

## 🆘 If Something Goes Wrong

### Get Help
1. Check Railway logs
2. Open `DEPLOYMENT.md` → Troubleshooting
3. Read `CI_CD_EXPLAINED.md`

### Common Fixes

**Build failed:**
```bash
# Clear cache and redeploy
# Go to Railway dashboard → Click your project
# Click "Redeploy" button
```

**Database error:**
```bash
# Restart service
# Go to Railway dashboard → Click service
# Click "Restart" button
```

**CORS error in browser:**
```bash
# Update CORS_ORIGIN in Railway
# Go to dashboard → Variables
# Set CORS_ORIGIN = https://your-app.railway.app
```

---

## 📱 Mobile Test

After deployment:

1. Open on smartphone
2. Go to: `https://your-app.railway.app/login.html`
3. Login with demo account
4. Test creating transaction
5. Test file upload

---

## 🎉 Success!

Your app is now live at:
```
https://your-app.railway.app
```

Share with team:
```
Frontend: https://your-app.railway.app
Demo account: admin@namsor.local / admin123
```

---

## 📚 More Commands

```bash
# Local development
npm run dev              # Start backend locally
npm run migrate          # Create local database

# Deployment
npm run deploy:railway   # Deploy to Railway
npm run deploy:render    # Deploy to Render
npm run deploy:vercel    # Deploy to Vercel

# Checking
npm run health          # Check if backend running

# Setup
npm run setup:prod      # Run production setup
```

---

## 🔗 Important URLs

```
Railway Dashboard:        https://railway.app/dashboard
GitHub Actions:           https://github.com/YOUR-USER/YOUR-REPO/actions
Your Live App:            https://your-app.railway.app
Your Login Page:          https://your-app.railway.app/login.html
Your API Health:          https://your-app.railway.app/health
```

Replace:
- `YOUR-USER` with your GitHub username
- `YOUR-REPO` with your repository name
- `your-app` with your Railway project name

---

## 💡 Pro Tips

1. **Enable auto-deploy** - Set up GitHub Secrets for automatic deployment
2. **Check logs often** - Railway logs show errors immediately
3. **Test frequently** - Deploy early and often
4. **Monitor performance** - Use Railway dashboard to see resource usage
5. **Backup database** - Download SQLite file from Railway regularly

---

## 🚀 Your Deployment Command (Choose One)

### Recommended: Railway
```bash
# Windows
deploy-railway.bat

# macOS/Linux
bash deploy-railway.sh

# npm
npm run deploy:railway
```

### Alternative: Render
```bash
# Windows
deploy-render.bat

# macOS/Linux
bash deploy-render.sh

# npm
npm run deploy:render
```

### Alternative: Vercel (Frontend Only)
```bash
# Windows
deploy-vercel.bat

# macOS/Linux
bash deploy-vercel.sh

# npm
npm run deploy:vercel
```

---

## 🎊 That's It!

**Everything is ready to deploy!**

Pick your platform, run the command, and your app will be live in 5-10 minutes! 🎉

---

**Ready? Let's deploy!** 🚀

Copy the appropriate command above and paste into your terminal!
