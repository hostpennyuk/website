# 🚀 HostPenny - Modern Conversion-Focused Website Platform

A complete React SPA with admin dashboard, email notifications, and MongoDB integration.

## ✨ Features

- 🎨 **Modern React SPA** - Built with Vite, React 19, Tailwind CSS v4
- 🎭 **Smooth Animations** - Framer Motion & GSAP ScrollTrigger
- 📱 **Fully Responsive** - Mobile-first design
- 🔔 **Email Notifications** - Automatic alerts via Resend & Gmail SMTP
- 🗄️ **MongoDB Integration** - Cloud database with Mongoose
- 👨‍💼 **Admin Dashboard** - Full CRM with enquiry management
- 📧 **Contact Forms** - Contact page & modal enquiry forms
- 📰 **Newsletter Signup** - Email list management
- 🎯 **SEO Optimized** - Meta tags, OG images, sitemap-ready
- 🔒 **Secure** - Environment variables, API authentication

## 🏗️ Tech Stack

### Frontend
- React 19
- Vite 7 (Rolldown)
- Tailwind CSS v4
- React Router v6
- Framer Motion
- GSAP ScrollTrigger

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- Nodemailer + Resend
- CORS enabled

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Resend or Gmail account for emails

### Installation

```bash
# Clone repository
git clone https://github.com/hostpennyuk/website.git
cd website

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Start backend (Terminal 1)
npm run start

# Start frontend (Terminal 2 - from root)
cd ..
npm run dev
```

Visit `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (`server/.env`)

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Email Service
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=your_email@example.com

# Gmail Backup (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
```

See `server/.env.example` for complete configuration.

### Frontend Environment Variables (`.env.local`)

```bash
VITE_API_URL=http://localhost:4000
```

## 📁 Project Structure

```
hostpenny/
├── src/
│   ├── components/       # React components
│   │   ├── cta/         # CTA modals & buttons
│   │   ├── home/        # Homepage sections
│   │   └── video/       # Video modal
│   ├── pages/           # Route pages
│   │   ├── Admin.jsx    # Admin dashboard
│   │   ├── Contact.jsx  # Contact page
│   │   └── Home.jsx     # Homepage
│   └── store/           # Data store & API
├── server/
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── utils/       # Email & DB utilities
│   └── test-email.js    # Email testing
├── public/              # Static assets
└── docs/               # Documentation
```

## 🎯 Key Features

### Admin Dashboard (`/admin`)
- **Login**: profmendel@gmail.com / Gig@50chin
- View all enquiries
- Filter by status, tags
- Full CRM functionality
- Export to CSV
- Email templates
- Subscriber management

### Forms
- **Contact Form** - Full contact page with validation
- **Enquiry Modal** - Global CTA with project details
- **Newsletter** - Email capture in footer

### Email Notifications
- Automatic notifications to admin on form submissions
- Professional HTML templates
- Resend (primary) + Gmail (fallback)
- Includes all form details and admin dashboard link

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide (Vercel + Railway)
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide
- **[EMAIL_SYSTEM.md](./EMAIL_SYSTEM.md)** - Email notification system
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Email service setup guides
- **[GMAIL_SETUP.md](./GMAIL_SETUP.md)** - Gmail app password setup

## 🚀 Deployment

### Deploy to Vercel (Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hostpennyuk/website)

```bash
# Or manually:
npm run build
# Upload dist/ folder to Vercel
```

### Deploy to Railway (Backend)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete instructions.

**Quick Steps:**
1. Sign up at [railway.app](https://railway.app)
2. Deploy from GitHub
3. Add environment variables
4. Set root directory to `/server`
5. Start command: `npm start`

## 🧪 Testing

### Test Email System
```bash
cd server
node --env-file=.env test-email.js
```

### Test API
```bash
curl http://localhost:4000/api/health
# Expected: {"ok":true}
```

## 📧 Contact Information

**In the app:**
- Phone: +44 7958 623678
- Email: hello@hostpenny.co.uk
- Address: 41 Rosedale Garden, Chadwell Heath, RM6 5PB, UK

## 🔒 Security

- ⚠️ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ API keys stored server-side only
- ✅ MongoDB uses authentication
- ✅ CORS configured properly

## 🤝 Contributing

This is a private commercial project. For access, contact the repository owner.

## 📄 License

Proprietary - All rights reserved © HostPenny 2025

## 🆘 Support

For setup help or issues:
1. Check documentation in `/docs` folder
2. Review `QUICK_START.md` for common issues
3. Check server logs for errors
4. Verify environment variables are set correctly

---

**Built with ❤️ for HostPenny**
