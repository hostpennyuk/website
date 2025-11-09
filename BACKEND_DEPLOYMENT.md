# Vercel API Routes Not Working - Quick Fix

## The Problem

Vercel is not detecting the `/api` folder because it's treating this as a pure Vite/React project.

## Quick Solution

### Option 1: Use Vercel Serverless Functions in a Monorepo Structure

Your current setup has `/api` folder but Vercel might be ignoring it. 

### Option 2: Deploy Backend Separately (Easiest Fix)

Since the API isn't working on Vercel, let's use a different approach:

1. Keep frontend on Vercel (it's working fine)
2. Deploy backend to **Render.com** (free tier, specifically for Node.js backends)

This is actually BETTER because:
- ✅ Backend and frontend separated (best practice)
- ✅ Easier to debug
- ✅ More control over backend environment
- ✅ Can restart backend independently
- ✅ Better for scaling later

---

## Deploy Backend to Render (5 Minutes)

### Step 1: Go to Render.com
Visit: https://render.com

### Step 2: Sign Up / Log In
Use your GitHub account to sign in

### Step 3: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository: `hostpennyuk/website`
4. Render will scan your repo

### Step 4: Configure Service
```
Name: hostpenny-api
Region: Frankfurt (closest to UK)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 5: Add Environment Variables

Click "Add Environment Variable" for each:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostpenny?retryWrites=true&w=majority&appName=Cluster0

RESEND_API_KEY=re_your_actual_api_key_here

EMAIL_FROM=notifications@hostpenny.co.uk

ADMIN_EMAIL=hostpennyuk@gmail.com

SMTP_HOST=smtp.gmail.com

SMTP_PORT=587

SMTP_USER=hostpennyuk@gmail.com

SMTP_PASS=your_gmail_app_password_here

PORT=4000
```

### Step 6: Select Free Plan
Choose "Free" plan (0$/month)

### Step 7: Click "Create Web Service"
Wait 2-3 minutes for deployment

### Step 8: Copy Your Backend URL
After deployment, you'll get a URL like:
```
https://hostpenny-api.onrender.com
```

### Step 9: Update Frontend

Update this ONE line in your code:

**File: `src/store/content.js`**

Find:
```javascript
apiBaseUrl: '/api',
```

Change to:
```javascript
apiBaseUrl: 'https://hostpenny-api.onrender.com/api',
```

Then commit and push:
```bash
git add src/store/content.js
git commit -m "Update API base URL to Render backend"
git push
```

Vercel will auto-redeploy frontend with the new backend URL.

---

## Why This Works Better

1. **Vercel** is optimized for static sites (your React app)
2. **Render** is optimized for Node.js backends (your API)
3. **Separation of concerns** = easier to maintain
4. **CORS is handled** automatically
5. **Both are FREE** for your traffic level

---

## Alternative: If You Want Everything on Vercel

The issue is Vercel's new build system doesn't detect API routes the same way. You'd need to:

1. Create a `vercel.json` that explicitly defines each function
2. Use Vercel's Edge Functions instead
3. Or use Vercel's new "Functions" directory structure

But honestly, **Render for backend + Vercel for frontend is the better architecture** for your use case.

---

## What to Do Right Now

1. Go to https://render.com
2. Follow steps above (takes 5 minutes)
3. Update `apiBaseUrl` in your code
4. Push to GitHub
5. Everything will work!

Let me know when you're ready and I can help with the Render setup!
