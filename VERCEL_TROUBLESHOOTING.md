# 🚨 Vercel Deployment Troubleshooting

## Current Issue: 404 on API Routes

If you're seeing `404: NOT_FOUND` on `/api/*` routes, follow these steps:

---

## ✅ Checklist (Do in Order)

### 1. Verify Environment Variables in Vercel

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Required Variables** (all 8):
- ✅ MONGODB_URI
- ✅ RESEND_API_KEY  
- ✅ EMAIL_FROM
- ✅ ADMIN_EMAIL
- ✅ SMTP_HOST
- ✅ SMTP_PORT
- ✅ SMTP_USER
- ✅ SMTP_PASS

**Important**: Make sure they're set for **Production** environment!

### 2. Check Deployment Status

1. Go to: https://vercel.com/dashboard
2. Look for latest deployment
3. Status should be: **"Ready" (green checkmark)**
4. If it says "Building..." wait 2-3 minutes

### 3. Check Function Logs

1. Click on the deployment
2. Click **"Functions"** tab
3. Look for:
   - `/api/health.func`
   - `/api/enquiries.func`
   - `/api/subscribers.func`
4. If you DON'T see these, the functions weren't detected

### 4. Manual Redeploy

If functions aren't showing up:
1. Go to Vercel Dashboard
2. Click **"Deployments"** tab
3. Find the latest deployment
4. Click the **three dots** (...) menu
5. Click **"Redeploy"**
6. Wait 2-3 minutes

---

## 🧪 Testing Steps

### Test 1: Health Check
```
https://hostpenny.co.uk/api/health
```
**Expected**: `{"ok":true,"message":"HostPenny API is running"}`

### Test 2: Admin Page
```
https://hostpenny.co.uk/admin
```
**Expected**: Login page appears

### Test 3: API Test Page
```
https://hostpenny.co.uk/api-test.html
```
Click buttons to test each endpoint

---

## 🔍 Common Issues & Fixes

### Issue: "404: NOT_FOUND" on /api routes

**Possible Causes:**
1. Environment variables not set
2. Functions not detected by Vercel
3. Build failed

**Fix:**
1. Verify all 8 environment variables are set
2. Check deployment logs for errors
3. Manual redeploy
4. Wait 5 full minutes after deployment

### Issue: Admin page shows 404

**Fix:**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 2 minutes for Vercel CDN to update
- Try incognito/private window

### Issue: Forms not submitting

**Causes:**
1. API not working (fix API first)
2. MongoDB not connected
3. Missing environment variables

**Fix:**
1. Test `/api/health` first
2. Check MongoDB URI is correct
3. Check Vercel function logs for errors

---

## 📊 Vercel Project Settings

Your project should have these settings:

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`
**Node.js Version**: 18.x (or 20.x)

### To verify:
1. Go to: Settings → General
2. Scroll to "Build & Development Settings"
3. Check the values match above

---

## 🆘 Still Not Working?

### Check Build Logs

1. Go to latest deployment
2. Click "Building" or "Ready" status
3. Look for errors in build log
4. Common errors:
   - `Missing dependencies` → Run `npm install` locally and push
   - `Build failed` → Check vite.config.js
   - `Function size too large` → Your functions are under 50MB, so this shouldn't happen

### Check Function Logs (Runtime)

1. Go to deployment
2. Click "Functions" tab
3. Click on a function (e.g., `/api/health.func`)
4. Click "Logs"
5. Look for errors like:
   - `Cannot connect to MongoDB` → Check MONGODB_URI
   - `Resend API error` → Check RESEND_API_KEY
   - `Module not found` → Missing dependency

---

## 📝 Files Created for Vercel

Your project has these API files:
- `api/health.js` - Health check endpoint
- `api/enquiries.js` - Enquiries CRUD + email notifications
- `api/subscribers.js` - Newsletter subscribers
- `api/[...path].js` - Catch-all (backup)

All are serverless functions that run on Vercel Edge.

---

## 🔄 Force Fresh Deployment

If nothing works:

```bash
# In your local project
git commit --allow-empty -m "Force redeploy"
git push
```

This forces Vercel to do a completely fresh deployment.

---

## 📞 Next Steps

1. Wait 5 minutes after latest deployment
2. Test: https://hostpenny.co.uk/api/health
3. If still 404, check Vercel function logs
4. If no functions are showing, the issue is in the build
5. Share the build logs so we can debug further

---

## ✅ When It's Working

You should see:
- ✅ `/api/health` returns JSON
- ✅ `/admin` loads login page
- ✅ Forms submit successfully
- ✅ Emails arrive at hostpennyuk@gmail.com
- ✅ `/api-test.html` shows all green checkmarks

---

**Last Updated**: November 9, 2025
