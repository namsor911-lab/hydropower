# 🤖 GitHub Actions CI/CD Pipeline Explained

**Automatic Deployment on Every Git Push**

---

## 🎯 What is CI/CD?

**CI = Continuous Integration**
- Automatically test code on every push
- Catch errors early
- Run checks before deploying

**CD = Continuous Deployment**
- Automatically deploy when tests pass
- No manual deployment steps
- Live in seconds

---

## 📁 Configuration File

**Location:** `.github/workflows/deploy.yml`

This file controls:
- When to deploy (on push to main)
- What to do (build, test, deploy)
- Where to deploy (Railway.app)

---

## 🔄 How It Works

```
1. You push code to GitHub
   ↓
2. GitHub webhook fires
   ↓
3. GitHub Actions starts workflow
   ↓
4. Checkout code
   ↓
5. Install Railway CLI
   ↓
6. Deploy to Railway
   ↓
7. Verify deployment
   ↓
8. Show URL in summary
   ↓
9. Your app is live! 🎉
```

---

## ⚙️ Workflow Triggers

The pipeline runs when:

```yaml
on:
  push:
    branches:
      - main        # Any push to main branch
      - master      # Or master branch
  workflow_dispatch:  # Or manual trigger (button in GitHub)
```

---

## 📝 Workflow Jobs

### Job 1: Deploy

**What it does:**
1. Checkout your code
2. Install Railway CLI
3. Authenticate with Railway token
4. Deploy to Railway
5. Get the live URL

**Environment variable:**
- `RAILWAY_TOKEN` (stored in GitHub Secrets)

### Job 2: Test

**What it does:**
1. Checkout code
2. Install Node.js
3. Install dependencies
4. Run npm tests (if configured)

**Runs after deploy succeeds**

### Job 3: Notify

**What it does:**
- Show success message
- Confirm app is live

**Runs if everything succeeded**

---

## 🔐 Setting Up GitHub Secrets

### Step 1: Get Railway Token

1. Go to https://railway.app/dashboard
2. Click your profile (top right)
3. Go to "Account" → "API Tokens"
4. Create new token
5. Copy the token

### Step 2: Add to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `RAILWAY_TOKEN`
5. Value: Paste your Railway token
6. Click "Add secret"

### Step 3: Done!

Now every push will automatically deploy! 🎉

---

## 👀 Viewing Deployment Status

### In GitHub

1. Go to your repository
2. Click "Actions" tab
3. See workflow runs
4. Click latest run to see logs

### Live Logs
- Shows each step
- Shows errors if any
- Shows deployment URL

### View Specific Job
1. Click on a workflow run
2. Click on job name (Deploy, Test, Notify)
3. Expand steps to see details

---

## 🚨 If Deployment Fails

### Check the Logs

1. Go to Actions tab
2. Click the failed workflow
3. Click "Deploy" job
4. Expand steps to find error

### Common Errors

| Error | Fix |
|-------|-----|
| "Invalid token" | Regenerate RAILWAY_TOKEN secret |
| "Build failed" | Check Dockerfile, missing dependencies |
| "Port already in use" | Change PORT in environment |
| "Module not found" | Run `npm install` locally, commit package-lock.json |

### Retry Deployment

1. Go to failed workflow in Actions
2. Click "Re-run all jobs"
3. GitHub re-runs the deployment

---

## 📊 Example Workflow Run

```
WORKFLOW: Deploy to Railway

Job 1: deploy
  ✓ Checkout repository (2s)
  ✓ Install Railway CLI (5s)
  ✓ Deploy to Railway (30s)
  ✓ Get deployment URL (3s)
  → https://namsor-accounting.railway.app

Job 2: test
  ✓ Checkout repository
  ✓ Setup Node.js 18
  ✓ Install dependencies
  ✓ Run tests

Job 3: notify
  ✓ Deployment successful!
  ✓ App is live at: https://namsor-accounting.railway.app

TOTAL TIME: ~2 minutes
```

---

## ⏰ When to Use

### Automatic (Recommended)
- Small changes
- Bug fixes
- New features
- Team collaboration

### Manual Trigger
- Emergency deployments
- Testing specific code
- Rollbacks

**Manual trigger button:**
1. Go to Actions tab
2. Click workflow: "Deploy to Railway"
3. Click "Run workflow"
4. Click green "Run workflow" button

---

## 🔄 Multiple Branches

**Current setup:** Deploys only from `main` branch

**To deploy from multiple branches:**

Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches:
      - main      # Production
      - develop   # Staging
      - master    # Backup
```

Each branch gets its own Railway service

---

## 🚀 Advanced: Conditional Deployments

### Deploy Only if Tests Pass

Already configured! Workflow is:
1. Deploy runs
2. If succeeds → Test runs
3. If tests pass → Notify runs

### Skip Deployment

Add `[skip ci]` to commit message:
```bash
git commit -m "Update README [skip ci]"
```

This skips the deployment workflow

---

## 📈 Monitoring Deployments

### GitHub Dashboard
- Go to Actions tab
- See all workflow runs
- Click to see details
- Average deploy time: 1-2 minutes

### Railway Dashboard
- Go to https://railway.app
- See real-time deployment status
- View logs
- Monitor resources

### Verifying Success
1. Check GitHub Actions: Green ✓
2. Check Railway dashboard: Deployed ✓
3. Test live URL: Works ✓

---

## 🔒 Security Best Practices

### Tokens
- ✅ Store in GitHub Secrets (encrypted)
- ✅ Regenerate regularly
- ✅ Don't commit to git
- ✅ Don't share in email/chat

### Secrets Rotation
1. Generate new Railway token
2. Update RAILWAY_TOKEN secret
3. Delete old token from Railway
4. Next deploy uses new token

---

## 🛠️ Customizing the Workflow

### Change Deploy Trigger

**Current:** Deploy on every push to `main`

**Options:**
- Deploy on manual trigger only
- Deploy on pull request merge
- Deploy on release creation
- Deploy on schedule (daily/weekly)

### Add More Jobs

**Example: Add lint check**
```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm run lint  # Check code style
```

### Add Notifications

**Email on deployment:**
```yaml
notify:
  steps:
    - name: Send email
      run: |
        # Custom email script
```

---

## 📚 Workflow Syntax Reference

### Triggers
```yaml
on:
  push:              # On push
  pull_request:      # On PR
  workflow_dispatch: # Manual button
  schedule:          # On schedule
    - cron: '0 0 * * *'  # Daily at midnight
```

### Jobs
```yaml
jobs:
  deploy:           # Job name
    runs-on: ubuntu-latest  # Runner
    steps:          # List of steps
      - run: command  # Run command
      - uses: action  # Use GitHub action
```

### Environment
```yaml
env:
  NODE_VERSION: 18  # Default for all jobs
jobs:
  deploy:
    env:
      DEBUG: true   # Specific to job
```

---

## 🎯 Your Workflow

1. **Local Development**
   ```bash
   git add .
   git commit -m "New feature"
   git push origin main
   ```

2. **GitHub Webhook**
   - GitHub notifies Actions
   - Workflow starts automatically

3. **Automated Testing**
   - Dependencies installed
   - Code checked
   - Tests run

4. **Automated Deployment**
   - Docker image built
   - Deployed to Railway
   - Database migrated
   - Admin user created

5. **Live!**
   - Your app is live
   - Changes visible immediately
   - No manual steps needed

---

## ✨ Success!

Your deployment pipeline is now:
- ✅ Automated
- ✅ Tested
- ✅ Reliable
- ✅ Fast (1-2 minutes)
- ✅ Safe (no manual errors)

**Everything is hands-off!** 🎉

Push code → GitHub Actions → Live on Railway

---

## 📞 Troubleshooting

**Q: Workflow doesn't run**
A: Check RAILWAY_TOKEN secret is set

**Q: Deployment takes too long**
A: Normal, usually 1-2 minutes

**Q: How do I cancel a deployment?**
A: Go to Actions, click "Cancel" button (if still running)

**Q: Can I deploy manually?**
A: Yes, click "Run workflow" button in Actions tab

---

## 🚀 You're All Set!

Your CI/CD pipeline is ready. Every push to `main` will automatically deploy your app to Railway!

**Try it:**
```bash
git add .
git commit -m "Test deployment"
git push origin main

# Then go to GitHub Actions tab and watch it deploy! 👀
```

---

**Happy automated deployments!** 🤖
