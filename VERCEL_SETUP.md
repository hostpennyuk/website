# 🚀 Vercel Deployment - Complete Setup

## ✅ What's Been Done

Your entire HostPenny platform (frontend + backend) is now configured for **unified Vercel deployment**:

- ✅ Frontend (React SPA)
- ✅ Backend API (Serverless Functions)
- ✅ MongoDB Atlas (Database)
- ✅ Resend (Email Service)
- ✅ Admin Dashboard

Everything runs on **Vercel** - no Railway, no separate backend hosting!

---

## 📋 Deployment Checklist

### 1. Set Environment Variables in Vercel

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these:

```
MONGODB_URI=mongodb+srv://hostpennyuk_db_user:VdjO48YuBamGi6va@cluster0.gira6ng.mongodb.net/hostpenny
RESEND_API_KEY=re_3pBzQuVX_8kASeah1iXRgx2iLVQ1HPvxr
EMAIL_FROM=notifications@hostpenny.co.uk
ADMIN_EMAIL=hostpennyuk@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hostpennyuk@gmail.com
SMTP_PASS=xjbxrbpqbdktgbpl
```

**Important**: Set for **Production**, **Preview**, and **Development** environments.

### 2. Redeploy

Vercel will automatically redeploy when you push to GitHub, OR:

1. Go to Vercel Dashboard
2. Click "Redeploy" button
3. Wait for deployment to complete (1-2 minutes)

### 3. Test Your API

Once deployed, test these endpoints:

```bash
# Health check
https://hostpenny.co.uk/api/health

# Get enquiries
https://hostpenny.co.uk/api/enquiries

# Get subscribers
https://hostpenny.co.uk/api/subscribers
```

### 4. Test Admin Dashboard

```
https://hostpenny.co.uk/admin

Login:
Email: profmendel@gmail.com
Password: Gig@50chin
```

### 5. Configure Resend Webhook

1. Go to: https://resend.com/inbound
2. Set webhook URL to:
   ```
   https://hostpenny.co.uk/api/inbound-emails/webhook
   ```
3. Save

---

## 🎯 How It Works

### Vercel Serverless Functions

Your API runs as serverless functions in the `/api` folder:

```
/api/[...path].js  →  Handles ALL API routes
```

**Routes Available**:
- `GET  /api/health` - Health check
- `GET  /api/enquiries` - Get all enquiries
- `POST /api/enquiries` - Create enquiry + send email
- `GET  /api/subscribers` - Get all subscribers
- `POST /api/subscribers` - Add subscriber
- `POST /api/inbound-emails/webhook` - Receive emails from Resend

### Frontend

Your React app is built and served as static files from `/dist`.

React Router handles client-side routing (`/`, `/admin`, `/contact`, etc.)

---

## 🔧 Local Development

### Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

### Backend (for testing serverless functions locally)
```bash
cd server
npm run start
# Runs on http://localhost:4000
```

In production, both are served from `https://hostpenny.co.uk`!

---

## 📊 Architecture

```
hostpenny.co.uk
├── / → React SPA (Frontend)
├── /admin → Admin Dashboard
├── /contact → Contact Page
└── /api/* → Serverless Functions (Backend)
    ├── /api/health
    ├── /api/enquiries
    ├── /api/subscribers
    └── /api/inbound-emails/webhook
```

**Database**: MongoDB Atlas (Cloud)
**Email**: Resend API
**Hosting**: Vercel (Everything!)

---

## 🐛 Troubleshooting

### Admin Page 404?
- Clear browser cache (Ctrl+Shift+R)
- Wait 2 minutes for Vercel deployment
- Check `vercel.json` has correct rewrites

### API Not Working?
- Verify environment variables in Vercel
- Check deployment logs in Vercel Dashboard
- Test with: `curl https://hostpenny.co.uk/api/health`

### Forms Not Submitting?
- Check browser console for errors
- Verify MongoDB connection string
- Check Vercel function logs

---

## ✨ Benefits of Vercel Deployment

✅ **Unified Hosting**: Frontend + Backend in one place
✅ **Auto Deploy**: Push to GitHub = instant deployment
✅ **Global CDN**: Fast worldwide performance
✅ **Serverless**: No server management
✅ **Free Tier**: Perfect for your traffic
✅ **Easy Setup**: One configuration file
✅ **HTTPS**: Automatic SSL certificates
✅ **Custom Domain**: Already configured (hostpenny.co.uk)

---

## 🎉 You're All Set!

Your platform is now:
- ✅ Deployed on Vercel
- ✅ Using MongoDB for database
- ✅ Using Resend for emails
- ✅ Fully functional admin dashboard
- ✅ Ready to receive form submissions
- ✅ Ready to receive emails at hello@hostpenny.co.uk

**No Railway, No Render, No separate backend** - Everything on Vercel! 🚀
