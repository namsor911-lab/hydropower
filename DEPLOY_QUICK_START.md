# ⚡ Deploy in 5 Minutes - Quick Reference

## 🎯 One-Command Deployment

### For Railway (Recommended)

**Windows:**
```bash
deploy-railway.bat
```

**macOS/Linux:**
```bash
bash deploy-railway.sh
```

---

## 📋 Prerequisite Checklist (1 minute)

```
✓ Commit code: git add . && git commit -m "Ready"
✓ Push to GitHub: git push origin main
✓ Create Railway account: railway.app
✓ Connect GitHub to Railway
```

---

## 🚀 Deployment Steps

### Step 1: Connect Repository (2 min)
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Select `main` branch

### Step 2: Railway Auto-Configures (1 min)
- Detects `railway.json`
- Detects `Dockerfile`
- Configures environment

### Step 3: Deploy (1 min)
- Click "Deploy"
- Railway builds and deploys
- Watch status dashboard

### Step 4: Get URL (1 min)
- Railway shows: `https://your-app.railway.app`
- This is your live app!

---

## ✅ Verify It Works

### Test API
```bash
curl https://your-app.railway.app/health
```

### Test Login
```
https://your-app.railway.app/login.html
Email: admin@namsor.local
Password: admin123
```

---

## 🔑 Environment Variables to Set

In Railway dashboard, add:

```
NODE_ENV = production
JWT_SECRET = <generate random string>
CORS_ORIGIN = <auto-filled>
PORT = 5000
```

---

## 📊 What Gets Deployed

```
✅ Backend API (port 5000)
✅ Frontend (login.html, index.html, hr.html)
✅ SQLite database (auto-created)
✅ File uploads (persisted)
✅ Demo users (auto-created)
```

---

## 🆘 If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| "Build failed" | Check logs in Railway dashboard |
| "Database error" | Restart service in dashboard |
| "CORS error" | Set CORS_ORIGIN correctly |
| "Can't login" | Check demo users created in logs |

---

## 🎉 You're Done!

Share your live app:
```
https://your-app.railway.app
```

Demo credentials:
```
admin@namsor.local / admin123
accountant@namsor.local / accountant123
viewer@namsor.local / viewer123
```

---

## 📚 More Help

- **Full guide:** See `DEPLOYMENT.md`
- **GitHub Actions:** Automatic CI/CD configured
- **Database backups:** Railway handles automatically
- **Scaling:** Upgrade to PostgreSQL when needed

---

## 🚀 Alternative Platforms

### Render
```bash
bash deploy-render.sh
```

### Vercel (Frontend Only)
```bash
bash deploy-vercel.sh
```

---

**That's it! Your app is now live on the internet!** ✨
