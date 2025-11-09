# Email Setup Guide for HostPenny Admin Dashboard

## Overview
To send emails from the Admin dashboard using your real domain (hostpenny.co.uk), you need to integrate an email service provider.

## Recommended Options

### Option 1: Resend (Recommended - Modern & Simple)
**Best for:** Modern transactional emails with great deliverability

1. **Sign up**: https://resend.com
2. **Add your domain**: hostpenny.co.uk
3. **Verify DNS records**: Add the provided DNS records to your domain
4. **Get API key**: Create an API key in dashboard
5. **Install package**:
   ```bash
   cd server
   npm install resend
   ```

6. **Add to server/.env**:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

7. **Create email route** (`server/src/routes/emails.js`):
   ```javascript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);

   router.post('/send', async (req, res) => {
     const { to, subject, html } = req.body;
     const data = await resend.emails.send({
       from: 'HostPenny <hello@hostpenny.co.uk>',
       to,
       subject,
       html,
     });
     res.json(data);
   });
   ```

**Pricing**: 3,000 emails/month free, then $20/month for 50k emails

---

### Option 2: SendGrid (Most Popular)
**Best for:** High volume, established service

1. **Sign up**: https://sendgrid.com
2. **Verify domain**: hostpenny.co.uk
3. **Get API key**
4. **Install**:
   ```bash
   cd server
   npm install @sendgrid/mail
   ```

5. **Add to server/.env**:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
   ```

6. **Create route**:
   ```javascript
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   router.post('/send', async (req, res) => {
     const { to, subject, html } = req.body;
     const msg = { to, from: 'hello@hostpenny.co.uk', subject, html };
     await sgMail.send(msg);
     res.json({ ok: true });
   });
   ```

**Pricing**: 100 emails/day free forever, then $19.95/month for 50k emails

---

### Option 3: Mailgun
**Best for:** Developers, powerful APIs

1. **Sign up**: https://mailgun.com
2. **Add domain**: hostpenny.co.uk
3. **Verify DNS**
4. **Get API key**
5. **Install**:
   ```bash
   cd server
   npm install mailgun.js form-data
   ```

6. **Add to server/.env**:
   ```
   MAILGUN_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
   MAILGUN_DOMAIN=hostpenny.co.uk
   ```

**Pricing**: 5,000 emails/month free for 3 months, then $35/month

---

## Frontend Integration

Once you have the backend route set up, update the Admin Emails tab to actually send:

In `src/pages/Admin.jsx`, replace the mock send in EmailsTab:

```javascript
const send = async () => {
  if (!form.to || !form.subject) return;
  
  const html = renderHtml(
    form.body,
    styleSel,
    settings.logoUrl,
    signatures.find(s=>s.id===sigSel) || signatures[0],
    form.subject,
    form.preheader,
    form.ctaLabel,
    form.ctaUrl
  );

  try {
    // Send via API
    const response = await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: form.to,
        subject: form.subject,
        html,
      }),
    });

    if (!response.ok) throw new Error('Send failed');

    // Save to outbox
    const email = {
      id: `${Date.now()}`,
      ...form,
      html,
      template: tplSel,
      templateStyle: styleSel,
      signature: sigSel,
      sentAt: new Date().toISOString(),
    };
    addEmail(email);
    setOutbox(getEmails());
    setForm({ to: '', subject: '', preheader: '', ctaLabel: '', ctaUrl: '', body: '' });
    
    alert('Email sent successfully!');
  } catch (err) {
    alert('Failed to send email: ' + err.message);
  }
};
```

---

## Domain Setup Checklist

For any provider, you'll need to:

1. **SPF Record**: Proves emails are from your domain
2. **DKIM**: Cryptographic signature for authenticity
3. **DMARC**: Policy for handling failures
4. **Return-Path**: For bounces

Your email provider will give you exact DNS records to add.

---

## Quick Start (Using Resend)

1. Install Resend in server:
   ```bash
   cd server
   npm install resend
   ```

2. Add API key to `server/.env`:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   ```

3. Create `server/src/routes/emails.js`:
   ```javascript
   import express from 'express';
   import { Resend } from 'resend';

   const router = express.Router();
   const resend = new Resend(process.env.RESEND_API_KEY);

   router.post('/send', async (req, res) => {
     try {
       const { to, subject, html } = req.body;
       const data = await resend.emails.send({
         from: 'HostPenny <hello@hostpenny.co.uk>',
         to,
         subject,
         html,
       });
       res.json(data);
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   });

   export default router;
   ```

4. Add route to `server/src/index.js`:
   ```javascript
   import emailsRouter from './routes/emails.js';
   app.use('/api/emails', emailsRouter);
   ```

5. Restart server and test!

---

## Testing

Before going live, test with:
- Your own email first
- Check spam folder
- Verify all links work
- Test on multiple email clients (Gmail, Outlook, Apple Mail)

---

## Best Practices

1. **Always use verified domains** - Never send from @gmail.com in production
2. **Warm up your domain** - Start with low volume, increase gradually
3. **Monitor bounces** - Remove invalid emails quickly
4. **Unsubscribe links** - Required by law for marketing emails
5. **Track opens/clicks** - Most providers offer analytics

---

Need help setting any of this up? Let me know which provider you'd like to use!
