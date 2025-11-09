# 🔒 URGENT: Security Action Required

## ⚠️ Critical Security Issue - Credentials Exposed

Your public GitHub repository **hostpennyuk/website** contained sensitive credentials in commit history. These have been removed from the current version, but **YOU MUST TAKE IMMEDIATE ACTION**.

---

## 🚨 STEP 1: Rotate All Credentials (URGENT - Do This NOW)

### 1. MongoDB Database Password

**Why**: Database connection string with username/password was exposed

**Action**:
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to Database Access
3. Find user: `hostpennyuk_db_user`
4. Click **Edit** → Change password
5. Update connection string with new password
6. Save new MONGODB_URI (you'll need it for Step 2)

### 2. Resend API Key

**Why**: API key `re_3pBzQuVX_8kASeah1iXRgx2iLVQ1HPvxr` was exposed

**Action**:
1. Go to Resend Dashboard: https://resend.com/api-keys
2. **Delete** the exposed API key
3. **Create** a new API key
4. Copy the new key (you'll need it for Step 2)

### 3. Gmail App Password

**Why**: SMTP password `xjbxrbpqbdktgbpl` was exposed

**Action**:
1. Go to Google App Passwords: https://myaccount.google.com/apppasswords
2. **Revoke** the "HostPenny" app password
3. **Create** a new app password (name it "HostPenny Server")
4. Copy the 16-character password (you'll need it for Step 2)

### 4. Admin Dashboard Password

**Why**: Password `Gig@50chin` was hardcoded in source files

**Action**:
- Choose a new strong password (use a password manager)
- You'll set this in Vercel environment variables in Step 2

---

## 🔧 STEP 2: Update Vercel Environment Variables

1. Go to Vercel: https://vercel.com/
2. Select your project: **hostpenny**
3. Go to **Settings** → **Environment Variables**
4. **Update** these variables with NEW values:

```bash
MONGODB_URI=mongodb+srv://hostpennyuk_db_user:NEW_PASSWORD@cluster0.gira6ng.mongodb.net/hostpenny?retryWrites=true&w=majority&appName=Cluster0

RESEND_API_KEY=re_NEW_API_KEY_HERE

SMTP_PASS=NEW_16_CHAR_APP_PASSWORD

# NEW: Add these for admin security
VITE_ADMIN_EMAIL=profmendel@gmail.com
VITE_ADMIN_PASSWORD=YOUR_NEW_STRONG_PASSWORD
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

---

## 🔒 STEP 3: Update Local Environment Files

Update your local `server/.env` file with new credentials:

```bash
MONGODB_URI=mongodb+srv://hostpennyuk_db_user:NEW_PASSWORD@...
RESEND_API_KEY=re_NEW_API_KEY_HERE
SMTP_PASS=NEW_16_CHAR_APP_PASSWORD
```

**NEVER commit this file to GitHub!**

---

## ✅ STEP 4: Verify Everything Works

After rotating credentials and updating Vercel:

1. **Test website**: https://hostpenny.co.uk
2. **Test contact form**: Submit a test enquiry
3. **Test admin login**: https://hostpenny.co.uk/admin (use new password)
4. **Test email**: Send to hello@hostpenny.co.uk and check inbox

---

## 📋 STEP 5: Configure Resend Webhook (For Email Inbox)

Follow the guide in `RESEND_WEBHOOK_SETUP.md`:

1. Go to Resend Dashboard → Domains → hostpenny.co.uk → Inbound
2. Add MX records to your DNS if not already done
3. Create inbound rule:
   - Email: hello@hostpenny.co.uk
   - Webhook: https://hostpenny.co.uk/api/inbound-emails
4. Test by sending an email to hello@hostpenny.co.uk

---

## 🛡️ STEP 6: Clean Git History (Optional but Recommended)

**Warning**: This rewrites git history. Coordinate with any team members first.

### Option A: Using BFG Repo-Cleaner (Easiest)

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Backup your repo first!
3. Run:
   ```bash
   # Create a fresh clone
   git clone --mirror https://github.com/hostpennyuk/website.git
   
   # Remove sensitive files from history
   java -jar bfg.jar --delete-files ".env" website.git
   java -jar bfg.jar --delete-files ".env.vercel" website.git
   java -jar bfg.jar --delete-files ".env.production" website.git
   
   # Push cleaned history
   cd website.git
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   git push --force
   ```

### Option B: Using git filter-repo (More Control)

```bash
pip install git-filter-repo
git filter-repo --path server/.env --invert-paths
git filter-repo --path .env.vercel --invert-paths
git filter-repo --path .env.production --invert-paths
git push --force
```

### Option C: Make Repository Private

If cleaning history is too complex:
1. Go to GitHub → Settings → Danger Zone
2. Change repository visibility to **Private**
3. This prevents public access to commit history

---

## 📝 Security Checklist

- [ ] Rotated MongoDB password
- [ ] Rotated Resend API key
- [ ] Rotated Gmail app password
- [ ] Changed admin dashboard password
- [ ] Updated all Vercel environment variables
- [ ] Redeployed Vercel app
- [ ] Tested website functionality
- [ ] Configured Resend webhook for inbound emails
- [ ] Cleaned git history OR made repo private
- [ ] Updated local .env files with new credentials
- [ ] Verified .env files are NOT committed to git

---

## 🔐 Prevention - Security Best Practices

Going forward:

1. ✅ **Never** commit `.env` files - always use `.env.example` templates
2. ✅ **Always** check what files are staged before committing:
   ```bash
   git status
   git diff --staged
   ```
3. ✅ **Use** pre-commit hooks to prevent accidental commits:
   ```bash
   npm install --save-dev husky
   npx husky add .husky/pre-commit "grep -r 'RESEND_API_KEY' . && exit 1 || exit 0"
   ```
4. ✅ **Enable** GitHub secret scanning alerts (Settings → Security)
5. ✅ **Review** commits before pushing to GitHub
6. ✅ **Use** 1Password, LastPass, or similar for credential management
7. ✅ **Rotate** credentials regularly (every 90 days)

---

## ❓ Need Help?

If you encounter issues:

1. Check Vercel deployment logs for errors
2. Verify environment variables are set correctly
3. Test API endpoints: `curl https://hostpenny.co.uk/api/health`
4. Review `VERCEL_TROUBLESHOOTING.md` for common issues

---

**Created**: November 9, 2025  
**Priority**: CRITICAL - Do immediately  
**Estimated Time**: 15-20 minutes
