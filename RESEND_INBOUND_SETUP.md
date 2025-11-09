# 📨 Resend Inbound Email Setup Guide

This guide will help you set up Resend to receive emails at `hello@hostpenny.co.uk` and automatically:
1. Store them in your MongoDB database
2. Forward them to `hostpennyuk@gmail.com`
3. Make them available in the Admin Dashboard

## 🎯 What You'll Get

When someone sends an email to `hello@hostpenny.co.uk`:
- ✅ Email stored in database
- ✅ Forwarded to your Gmail
- ✅ Viewable in Admin Dashboard
- ✅ Can reply directly from Admin Dashboard

---

## 📋 Step-by-Step Setup

### Step 1: Configure Inbound Email in Resend Dashboard

1. **Go to Resend Dashboard**: https://resend.com/inbound

2. **Click "Add Inbound Email"**

3. **Configure Domain**:
   - Domain: `hostpenny.co.uk`
   - Status should show "Verified" (since you already verified it)

4. **Set Webhook URL**:
   ```
   https://your-backend-url.com/api/inbound-emails/webhook
   ```
   
   **For now (development)**:
   - You need to expose your local server using **ngrok** or **localtunnel**
   - OR deploy backend first (recommended)

5. **Add MX Records** to your domain DNS:
   
   Go to your domain registrar and add these MX records:
   
   ```
   Type: MX
   Name: @ (or hostpenny.co.uk)
   Priority: 10
   Value: inbound-smtp.resend.com
   
   Type: MX  
   Name: @ (or hostpenny.co.uk)
   Priority: 20
   Value: inbound-smtp-fallback.resend.com
   ```
   
   **Important**: This will route ALL incoming emails for your domain through Resend

6. **Verify MX Records**:
   - Wait 10-60 minutes for DNS propagation
   - Resend will automatically verify
   - Status should change to "Active"

---

### Step 2: Your Backend is Already on Vercel!

Good news! Your backend is deployed as **Vercel Serverless Functions** alongside your frontend. No separate deployment needed!

Your webhook URL will be:
```
https://hostpenny.co.uk/api/inbound-emails/webhook
```

#### Environment Variables on Vercel

Make sure these are set in your Vercel project settings:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostpenny
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=notifications@hostpenny.co.uk
ADMIN_EMAIL=hostpennyuk@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hostpennyuk@gmail.com
SMTP_PASS=your_gmail_app_password_here
```

5. Click "Save"
6. Redeploy your site (Vercel does this automatically)

---

### Step 3: Update Resend Webhook URL

1. Go to Resend Dashboard → Inbound: https://resend.com/inbound
2. Click on your inbound email configuration
3. Set Webhook URL to:
   ```
   https://hostpenny.co.uk/api/inbound-emails/webhook
   ```
4. Save

---

### Step 4: Test the Setup

1. **Send a test email** to `hello@hostpenny.co.uk` from any email account

2. **Check your server logs**:
   ```
   📨 Received inbound email webhook from Resend
   ✅ Email saved to database: [email-id]
   ✅ Email forwarded to Gmail
   ```

3. **Check Gmail**: You should receive a forwarded email at `hostpennyuk@gmail.com`

4. **Check Admin Dashboard**:
   - Go to http://localhost:5173/admin
   - Click "Inbox" or "Emails" tab
   - You should see the received email

---

## 🎨 Admin Dashboard Email Management

### Features Available:

- **View Emails**: See all received emails
- **Mark as Read/Unread**
- **Star Important Emails**
- **Archive Emails**
- **Add Labels**
- **Reply Directly**: Send replies using Resend
- **Search**: Filter by sender, subject, content
- **Delete**: Remove emails

### API Endpoints Created:

```
GET    /api/inbound-emails              # Get all emails
GET    /api/inbound-emails/:id          # Get single email
POST   /api/inbound-emails/webhook      # Resend webhook (receives emails)
PATCH  /api/inbound-emails/:id/read     # Mark as read/unread
PATCH  /api/inbound-emails/:id/star     # Star/unstar
PATCH  /api/inbound-emails/:id/archive  # Archive/unarchive
PATCH  /api/inbound-emails/:id/labels   # Add/remove labels
POST   /api/inbound-emails/:id/reply    # Send reply
DELETE /api/inbound-emails/:id          # Delete email
```

---

## 🔧 Troubleshooting

### Emails Not Being Received

**Check MX Records**:
```bash
# On Windows PowerShell
Resolve-DnsName -Name hostpenny.co.uk -Type MX

# Should show:
# inbound-smtp.resend.com (Priority 10)
# inbound-smtp-fallback.resend.com (Priority 20)
```

**Check Resend Dashboard**:
- Go to Logs → Inbound
- See if emails are being received but webhook failing

**Check Server Logs**:
- Look for webhook POST requests
- Check for any errors

### Webhook Not Working

1. **Verify URL is HTTPS** (not HTTP)
2. **Check server is publicly accessible** (not localhost)
3. **Verify route is correct**: `/api/inbound-emails/webhook`
4. **Check Resend webhook logs** for error responses

### Not Forwarding to Gmail

1. **Check Gmail SMTP credentials** in `.env`
2. **Verify Gmail App Password** is correct
3. **Check server logs** for SMTP errors

---

## 📊 Database Schema

Emails are stored with this structure:

```javascript
{
  messageId: "unique-id",
  from: {
    email: "sender@example.com",
    name: "Sender Name"
  },
  to: [{ email: "hello@hostpenny.co.uk" }],
  subject: "Email subject",
  text: "Plain text content",
  html: "<p>HTML content</p>",
  receivedAt: Date,
  read: false,
  starred: false,
  archived: false,
  labels: ["important", "customer"],
  attachments: [],
  forwardedToGmail: true,
  forwardedAt: Date
}
```

---

## 🚀 Next Steps After Setup

1. **Update Admin Dashboard UI** to show inbox tab
2. **Add email composer** for sending new emails
3. **Add email templates** for common replies
4. **Set up email signatures**
5. **Add auto-responder** for certain emails
6. **Add spam filtering**
7. **Add email analytics** (open rates, response times)

---

## 🔒 Security Notes

- Webhook endpoint is public but only accepts requests from Resend
- Add webhook signature verification for extra security
- Emails are stored in your private MongoDB database
- Gmail forwarding uses authenticated SMTP

---

## 💰 Resend Pricing

**Free Tier**:
- 3,000 emails/month (inbound + outbound combined)
- Perfect for getting started

**Pro Plan** ($20/month):
- 50,000 emails/month
- Custom domains
- Priority support

---

## 📝 Summary Checklist

- [ ] MX records added to domain DNS
- [ ] Backend deployed to Railway/Render
- [ ] Webhook URL configured in Resend
- [ ] Environment variables set in production
- [ ] Test email sent and received
- [ ] Email appears in Admin Dashboard
- [ ] Email forwarded to Gmail
- [ ] Reply functionality tested

---

## 🆘 Need Help?

If you get stuck:

1. **Check Resend Logs**: https://resend.com/logs
2. **Check Server Logs**: Look for webhook POST requests
3. **Verify DNS**: Use `Resolve-DnsName` to check MX records
4. **Test Webhook**: Use Resend's "Test Webhook" feature

**Your webhook URL will be**:
```
https://[your-backend-url]/api/inbound-emails/webhook
```

Once backend is deployed, update this URL in Resend Dashboard!
