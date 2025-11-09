# Resend Webhook Configuration Guide

## Current Configuration Status

### ⚠️ ACTION REQUIRED: Configure Inbound Email Webhook

Your Resend webhook for receiving emails at `hello@hostpenny.co.uk` (and other addresses) needs to be configured.

## Step-by-Step Setup

### 1. Access Resend Dashboard
1. Go to https://resend.com/domains
2. Log in to your Resend account
3. Select your verified domain: **hostpenny.co.uk**

### 2. Configure MX Records (if not already done)
Navigate to the **Inbound** tab and verify these MX records are set in your DNS:

```
Type: MX
Priority: 10
Value: inbound-smtp.resend.com
```

**DNS Provider**: Check with your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

### 3. Create Inbound Email Rule

In the Resend Dashboard → Domains → hostpenny.co.uk → Inbound:

1. Click **"Add Inbound Rule"** or **"Create Rule"**

2. Configure the rule:
   ```
   Email Address: hello@hostpenny.co.uk
   Webhook URL: https://hostpenny.co.uk/api/inbound-emails
   Status: Enabled
   ```

3. Click **Save** or **Create**

4. Repeat for other email addresses if needed:
   - support@hostpenny.co.uk
   - admin@hostpenny.co.uk
   - info@hostpenny.co.uk
   - sales@hostpenny.co.uk
   - contact@hostpenny.co.uk

**Note**: You can use the same webhook URL for all addresses since the API receives the full email data.

### 4. Test the Webhook

After configuration:

1. **Send a test email** to hello@hostpenny.co.uk from your personal email

2. **Check Resend logs**:
   - Go to Resend Dashboard → Inbound → Logs
   - Look for POST requests to your webhook
   - Check for any errors (401, 404, 500, etc.)

3. **Verify in Admin Dashboard**:
   - Go to https://hostpenny.co.uk/admin
   - Login with your credentials
   - Click the **Inbox** tab
   - You should see the test email

4. **Check Gmail forwarding**:
   - Verify the email was forwarded to hostpennyuk@gmail.com
   - Check your Gmail inbox and spam folder

## Webhook Endpoint Details

**URL**: `https://hostpenny.co.uk/api/inbound-emails`

**Method**: POST

**Expected Payload** (from Resend):
```json
{
  "from": "sender@example.com",
  "to": "hello@hostpenny.co.uk",
  "subject": "Test Email",
  "html": "<p>Email body HTML</p>",
  "text": "Email body plain text",
  "headers": {...},
  "attachments": [...]
}
```

**Successful Response**: 200 OK
```json
{
  "success": true,
  "message": "Email received and forwarded"
}
```

## Troubleshooting

### Webhook Logs Show Errors

1. **401 Unauthorized** → Check Vercel environment variables are set
2. **404 Not Found** → Verify URL is exactly `https://hostpenny.co.uk/api/inbound-emails`
3. **500 Internal Server Error** → Check Vercel function logs for errors

### Email Not Appearing in Inbox

1. Check MongoDB connection (MONGODB_URI in Vercel env vars)
2. Verify API endpoint: `curl https://hostpenny.co.uk/api/inbound-emails` should return `[]` or list of emails
3. Check Vercel function logs for errors

### Email Not Forwarded to Gmail

1. Verify SMTP credentials in Vercel environment variables:
   - SMTP_USER=hostpennyuk@gmail.com
   - SMTP_PASS=[your new Gmail app password]
2. Check Gmail app password is valid
3. Review Vercel function logs for nodemailer errors

### No Emails Received at All

1. Verify MX records are properly configured
2. Use an MX lookup tool: https://mxtoolbox.com/mx-lookup
3. Check that DNS changes have propagated (can take up to 48 hours)

## Security Notes

⚠️ **After configuring, you should**:

1. Rotate ALL exposed credentials found in the repository:
   - MongoDB password
   - Resend API key  
   - Gmail app password
   - Admin dashboard password

2. Update Vercel environment variables with new credentials

3. Test that everything still works after rotation

## Verification Checklist

- [ ] MX records configured in DNS
- [ ] Inbound rule created in Resend for hello@hostpenny.co.uk
- [ ] Webhook URL points to https://hostpenny.co.uk/api/inbound-emails
- [ ] Test email sent and received
- [ ] Email appears in Admin → Inbox
- [ ] Email forwarded to hostpennyuk@gmail.com
- [ ] All credentials rotated after security leak
- [ ] Vercel environment variables updated with new credentials

**Last Updated**: November 9, 2025
