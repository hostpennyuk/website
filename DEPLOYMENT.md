# 🚀 Deploying HostPenny to Vercel

This guide walks you through deploying both the frontend (to Vercel) and backend (to Railway/Render) for production.

## 📋 Prerequisites

- ✅ GitHub account (code already pushed)
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Railway or Render account for backend (recommended)

## 🎯 Deployment Strategy

### Frontend → Vercel (Free)
- React SPA
- Static files
- CDN distribution
- Automatic deployments from GitHub

### Backend → Railway/Render (Free tier available)
- Node.js Express API
- MongoDB connection
- Email notifications
- Environment variables

## 📦 Part 1: Deploy Backend to Railway

### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy Backend
1. Click "Deploy from GitHub repo"
2. Select `hostpennyuk/website`
3. Click "Add variables" and add these environment variables:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostpenny

# Port (Railway auto-assigns)
PORT=4000

# Email - Admin
ADMIN_EMAIL=hostpennyuk@gmail.com

# Email - Resend (Primary) - Domain Verified ✅
RESEND_API_KEY=re_3pBzQuVX_8kASeah1iXRgx2iLVQ1HPvxr
EMAIL_FROM=notifications@hostpenny.co.uk

# Email - Gmail (Backup)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hostpennyuk@gmail.com
```bash
SMTP_PASS=your_gmail_app_password_here

# Node Environment
NODE_ENV=production
```

### Step 3: Configure Build Settings
1. **Root Directory**: `/server`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. Click "Deploy"

### Step 4: Get Backend URL
Once deployed, Railway will give you a URL like:
```
https://website-production-xxxx.up.railway.app
```

**Copy this URL** - you'll need it for frontend configuration.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"

### Step 2: Import Repository
1. Click "Import Git Repository"
2. Select `hostpennyuk/website`
3. Click "Import"

### Step 3: Configure Project

**Framework Preset**: Vite

**Root Directory**: `./` (leave as root)

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```bash
# Backend API URL (use your Railway URL from Part 1)
VITE_API_URL=https://website-production-xxxx.up.railway.app
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your site will be live at `https://hostpenny.vercel.app`

---

## 🔧 Part 3: Update Configuration Files

After getting your backend URL, you need to update the Vercel configuration:

### Update vercel.json

Replace the API route in `vercel.json`:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-railway-url.up.railway.app/api/$1"
    }
  ]
}
```

Then push to GitHub:
```bash
git add vercel.json
git commit -m "Update API URL for production"
git push
```

Vercel will automatically redeploy.

---

## 🌐 Part 4: Custom Domain (Optional)

### Add hostpenny.co.uk to Vercel

1. Go to Vercel project settings
2. Click "Domains"
3. Add `hostpenny.co.uk`
4. Vercel will give you DNS records to add
5. Update your domain DNS settings:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Update Email Links

Once you have a custom domain, update email notification links:

In `server/src/utils/email.js`, replace:
```javascript
http://localhost:5174/admin
```

With:
```javascript
https://hostpenny.co.uk/admin
```

---

## ✅ Part 5: Testing Production Deployment

### Test Checklist:

1. **Homepage loads**: ✅
   - Visit `https://hostpenny.vercel.app`
   - Check all animations work
   - Verify images load

2. **Forms work**: ✅
   - Submit contact form
   - Submit enquiry modal
   - Subscribe to newsletter

3. **Email notifications**: ✅
   - Check hostpennyuk@gmail.com inbox
   - Verify email contains all details

4. **Admin dashboard**: ✅
   - Login at `/admin`
   - View submitted enquiries
   - Check database connection

5. **API connection**: ✅
   - Open browser console
   - Check for API errors
   - Verify data loads from backend

---

## 🔒 Security & Environment Variables

### ⚠️ Never Commit These Files:
- ❌ `.env` (already in .gitignore)
- ❌ `server/.env` (already in .gitignore)

### ✅ Always Set in Hosting Platform:
- Vercel: Environment Variables tab
- Railway: Variables tab
- Never expose in code or public repos

---

## 📊 Monitoring & Logs

### Vercel Logs
- Go to your project → "Deployments"
- Click any deployment → "View Function Logs"
- Monitor frontend errors

### Railway Logs
- Go to your project → "Deployments"
- Click "View Logs"
- Monitor API requests and email status

### Email Delivery
- [Resend Dashboard](https://resend.com/emails)
- View sent emails, delivery status, bounces

---

## 🚨 Troubleshooting

### Frontend doesn't connect to backend

**Problem**: API requests fail with CORS errors

**Solution**:
1. Check Railway backend is running
2. Verify `VITE_API_URL` in Vercel environment variables
3. Update `vercel.json` with correct backend URL
4. Redeploy frontend

### Email notifications not sending

**Problem**: Forms save but no emails arrive

**Solution**:
1. Check Railway environment variables (RESEND_API_KEY, SMTP_PASS)
2. View Railway logs for email errors
3. Test with `server/test-email.js` locally first
4. Check Resend dashboard for delivery status

### Admin can't login

**Problem**: Credentials don't work in production

**Solution**:
- Admin credentials are hardcoded in `src/pages/Admin.jsx`
- Works same in dev and production
- Default: profmendel@gmail.com / Gig@50chin

### Database connection fails

**Problem**: API returns 500 errors

**Solution**:
1. Check MONGODB_URI in Railway
2. Verify IP whitelist in MongoDB Atlas (set to 0.0.0.0/0 for production)
3. Test connection string locally first

---

## 💰 Cost Breakdown

### Free Tier (What you get for $0):

**Vercel Free**:
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ 100GB bandwidth/month
- ✅ Custom domains

**Railway Free**:
- ✅ $5 free credit/month
- ✅ ~500 hours runtime
- ✅ Automatic HTTPS
- ✅ Environment variables
- ⚠️ Sleep after inactivity (can upgrade to prevent)

**Resend Free**:
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ⚠️ Upgrade for higher volume ($20/mo for 50k emails)

**MongoDB Atlas Free**:
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Enough for 1000s of enquiries

### Total Monthly Cost: **$0** on free tier! 🎉

---

## 🎓 Alternative Backend Hosts

### Option 1: Railway (Recommended)
- ✅ Easy setup
- ✅ Auto-deploy from GitHub
- ✅ Built-in logging
- ✅ $5 free credit monthly

### Option 2: Render
1. Sign up at [render.com](https://render.com)
2. Create "Web Service"
3. Connect GitHub repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables

### Option 3: Heroku
- More expensive ($7/month minimum)
- Similar setup to Railway
- Good documentation

---

## 🔄 Continuous Deployment

Both Vercel and Railway auto-deploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Automatically triggers:
# 1. Vercel frontend rebuild (2-3 min)
# 2. Railway backend redeploy (1-2 min)
```

**No manual deployment needed!** ✨

---

## 📚 Next Steps After Deployment

1. **Add Custom Domain** (hostpenny.co.uk)
2. **Set up custom email domain** in Resend
3. **Update email links** in notification templates
4. **Enable analytics** (Vercel Analytics free)
5. **Set up monitoring** (Vercel Analytics + Railway logs)
6. **Test all forms** in production
7. **Share live URL** with team

---

## 📞 Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Vite Deployment**: [vitejs.dev/guide/static-deploy](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Environment variables added to Railway
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL added to Vercel
- [ ] vercel.json updated with backend URL
- [ ] Custom domain added (optional)
- [ ] Email links updated with production URL
- [ ] All forms tested in production
- [ ] Email notifications tested
- [ ] Admin dashboard tested
- [ ] MongoDB connection verified

---

**Ready to deploy!** Follow the steps above and your HostPenny platform will be live in ~15 minutes! 🚀
