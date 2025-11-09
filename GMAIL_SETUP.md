# Gmail App Password Setup for Email Notifications

## Overview
To send automatic email notifications to hostpennyuk@gmail.com when someone submits a form, you need to create a Gmail App Password.

## Why App Password?
Gmail doesn't allow apps to use your regular password for security. Instead, you create a special 16-character "App Password" that only this application can use.

## Setup Steps

### 1. Enable 2-Step Verification (if not already enabled)
1. Go to https://myaccount.google.com/security
2. Sign in with **hostpennyuk@gmail.com**
3. Find "2-Step Verification" section
4. Click "Get started" and follow the prompts
5. Verify with your phone

### 2. Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with **hostpennyuk@gmail.com**
3. Click "Select app" → Choose "Other (Custom name)"
4. Enter name: **HostPenny Server**
5. Click "Generate"
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
7. Remove spaces: `abcdefghijklmnop`

### 3. Add to Server Configuration
1. Open `server/.env` file
2. Find the line: `SMTP_PASS=your_app_password_here`
3. Replace with your actual app password:
   ```
   SMTP_PASS=abcdefghijklmnop
   ```
4. Save the file

### 4. Restart the Server
```powershell
# Stop any running server (Ctrl+C in the terminal)
# Then restart:
cd server
npm run start
```

## Test It
1. Go to your website contact form
2. Fill out and submit
3. Check **hostpennyuk@gmail.com** inbox
4. You should receive an email notification with all the form details!

## Email Notification Features
When someone fills the contact form or enquiry form, you'll receive:
- ✉️ **Immediate email notification** to hostpennyuk@gmail.com
- 📋 **All form details** beautifully formatted
- 🎨 **Branded email template** with your colors
- 🔗 **Direct link** to view in Admin Dashboard
- 📱 **Mobile-friendly** design

## Troubleshooting

### "Invalid login" error
- Double-check the app password has no spaces
- Make sure you're using the app password, not your regular Gmail password
- Verify 2-Step Verification is enabled

### Not receiving emails
- Check spam/junk folder
- Verify ADMIN_EMAIL in .env matches your Gmail
- Check server logs for errors
- Test with a simple form submission

### Still not working?
1. Check server terminal for error messages
2. Verify all .env settings are correct
3. Make sure server restarted after .env changes
4. Try creating a new app password

## Security Notes
- ✅ **DO NOT** commit the .env file to Git (already in .gitignore)
- ✅ **DO NOT** share your app password
- ✅ App passwords can be revoked anytime from Google Account settings
- ✅ Use different app passwords for different apps/servers

## Alternative: Use Professional Email Service
For production, consider using:
- **Resend** (recommended for hostpenny.co.uk domain)
- **SendGrid** (most popular)
- **Mailgun** (developer-friendly)

These services offer:
- Better deliverability
- No Gmail rate limits
- Professional "from" address (hello@hostpenny.co.uk)
- Analytics and tracking
- Higher volume capacity

See EMAIL_SETUP.md for full integration guides.

---

**Need help?** If you get stuck, let me know which step is causing issues!
