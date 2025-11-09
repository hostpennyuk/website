# 🚀 HostPenny Platform - Quick Start

## ✅ What's Configured & Working

### Database
- ✅ MongoDB Atlas connected
- ✅ Database: `hostpenny`
- ✅ Collections: `enquiries`, `subscribers`

### Email Notifications
- ✅ **Resend**: Primary service (API Key configured)
- ✅ **Gmail SMTP**: Backup service (App Password configured)
- ✅ Recipient: hostpennyuk@gmail.com
- ✅ **Test Status**: 2 test emails sent successfully

### Backend Server
- ✅ Running on `http://localhost:4000`
- ✅ Health check: `http://localhost:4000/api/health`
- ✅ Auto-restart enabled with `--watch`

### Frontend
- ✅ Development server (default): `http://localhost:5173` or `http://localhost:5174`
- ✅ API proxy configured (`/api` → `http://localhost:4000`)

## 🎯 Start Development

### Terminal 1: Backend Server
```powershell
cd server
npm run start
```

### Terminal 2: Frontend Dev Server
```powershell
npm run dev
```

## 📧 Email System Status

**Every form submission automatically sends an email to: hostpennyuk@gmail.com**

### Configured Services:
1. **Resend** (Primary)
   - API Key: `re_3pBzQuVX_8kASeah1iXRgx2iLVQ1HPvxr`
   - From: `onboarding@resend.dev`
   - Status: ✅ Working

2. **Gmail SMTP** (Fallback)
   - Account: hostpennyuk@gmail.com
   - App Password: Configured
   - Status: ✅ Working

### Test Email System
```powershell
cd server
node --env-file=.env test-email.js
```

Expected: Email arrives at hostpennyuk@gmail.com within seconds

## 🔑 Admin Access

- URL: `http://localhost:5174/admin`
- Email: `profmendel@gmail.com`
- Password: `[Your admin password]`

## 📊 Key Features

### Forms that Trigger Email Notifications:
1. **Contact Form** (`/contact`) → Saves to DB + Sends email
2. **Enquiry Modal** (CTA buttons) → Saves to DB + Sends email
3. **Newsletter** → Saves to subscribers collection

### Admin Dashboard:
- View all enquiries
- Filter by status/tags
- Export to CSV
- Delete (with confirmation)
- Full submission details in View modal

## 🌐 API Endpoints

```
GET    /api/health              # Check server status
GET    /api/enquiries           # Get all enquiries
POST   /api/enquiries           # Create enquiry + send email
PATCH  /api/enquiries/:id       # Update enquiry
DELETE /api/enquiries/:id       # Delete enquiry
GET    /api/subscribers         # Get all subscribers
POST   /api/subscribers         # Add subscriber
```

## 📁 Important Files

### Environment Config
- `server/.env` - Database connection, email credentials
- `server/.env.example` - Template with instructions

### Email System
- `server/src/utils/email.js` - Email service (Resend + Gmail)
- `server/test-email.js` - Email testing script

### Database
- `server/src/utils/db.js` - MongoDB connection
- `server/src/models/Enquiry.js` - Enquiry schema
- `server/src/models/Subscriber.js` - Subscriber schema

### Frontend
- `src/pages/Admin.jsx` - Admin dashboard
- `src/pages/Contact.jsx` - Contact form
- `src/components/cta/CtaModal.jsx` - Enquiry modal
- `src/store/content.js` - Data store with API integration

## 🎨 Contact Details (Updated Throughout Site)

- Phone: **+44 7958 623678**
- Email: **hello@hostpenny.co.uk**
- Address: **41 Rosedale Garden, Chadwell Heath, RM6 5PB, United Kingdom**

## 🔧 Common Commands

### Check if server is running:
```powershell
curl http://localhost:4000/api/health
```

Expected: `{"ok":true}`

### View server logs:
Server automatically logs email status:
```
✓ Email sent via Resend (ID: ...)
```

### Stop all Node processes:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Install dependencies:
```powershell
# Frontend
npm install

# Backend
cd server
npm install
```

## 🚀 Production Deployment Checklist

### Before Going Live:
1. ✅ Add custom domain to Resend
2. ✅ Update `EMAIL_FROM` in `.env` to `notifications@hostpenny.co.uk`
3. ⏳ Deploy backend to hosting service (Railway, Render, etc.)
4. ⏳ Update frontend API proxy to production URL
5. ⏳ Deploy frontend to Netlify/Vercel
6. ⏳ Update admin dashboard link in email template
7. ⏳ Add environment variables to hosting platform
8. ⏳ Test form submissions in production

## 📖 Documentation

- `EMAIL_SETUP.md` - Professional email services guide (Resend, SendGrid, Mailgun)
- `GMAIL_SETUP.md` - Gmail App Password setup
- `EMAIL_SYSTEM.md` - Complete email notification system documentation
- `README.md` - Project overview

## ✨ Current Status

**Everything is working perfectly!**

✅ Frontend running
✅ Backend running
✅ Database connected
✅ Email notifications active (Resend primary, Gmail backup)
✅ Contact form wired to database
✅ Enquiry modal wired to database
✅ Admin dashboard fully functional
✅ Test emails sent successfully

**Ready for development and testing!**

## 🆘 Need Help?

Check the detailed documentation:
- Email issues → `EMAIL_SYSTEM.md`
- Email service setup → `EMAIL_SETUP.md`
- Gmail configuration → `GMAIL_SETUP.md`

---

**Last Updated**: November 8, 2025
**Email Test**: ✅ Successful (2 test emails delivered)
