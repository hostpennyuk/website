# 🚨 Fix Emails Going to Spam - Complete Guide

## Why Your Emails Go to Spam

Emails go to spam when they lack proper **email authentication** records. Email providers (Gmail, Outlook, etc.) check these records to verify your emails are legitimate:

1. **SPF** - Verifies which servers can send email from your domain
2. **DKIM** - Adds a cryptographic signature to prove authenticity
3. **DMARC** - Tells receivers what to do with unauthenticated emails
4. **MX Records** - For receiving emails (you may already have this)

---

## ✅ Step-by-Step Fix for Resend

Since you're using Resend for sending emails, follow these steps:

### Step 1: Access Resend Dashboard

1. Go to https://resend.com/domains
2. Log in to your account
3. Click on your domain: **hostpenny.co.uk**

### Step 2: Get Your DNS Records

In the Resend dashboard, you'll see records that need to be added. They look like this:

#### SPF Record
```
Type: TXT
Name: @ (or hostpenny.co.uk)
Value: v=spf1 include:_spf.resend.com ~all
```

#### DKIM Records (Usually 3 records)
```
Type: TXT
Name: resend._domainkey
Value: [Long cryptographic string provided by Resend]

Type: TXT
Name: resend2._domainkey
Value: [Long cryptographic string provided by Resend]

Type: TXT
Name: resend3._domainkey
Value: [Long cryptographic string provided by Resend]
```

#### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@hostpenny.co.uk
```

### Step 3: Add Records to Your DNS

**Where to add these records depends on your domain registrar:**

#### If using **GoDaddy**:
1. Log in to GoDaddy
2. Go to **My Products** → **Domains**
3. Click on **hostpenny.co.uk**
4. Scroll to **DNS** section → Click **Manage DNS**
5. Click **Add** for each record
6. Select **TXT** type
7. Enter Name and Value from Resend
8. Save each record

#### If using **Namecheap**:
1. Log in to Namecheap
2. Go to **Domain List**
3. Click **Manage** next to hostpenny.co.uk
4. Go to **Advanced DNS** tab
5. Click **Add New Record**
6. Select **TXT Record**
7. Enter Host and Value
8. Save

#### If using **Cloudflare**:
1. Log in to Cloudflare
2. Select **hostpenny.co.uk** domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Select **TXT** type
6. Enter Name and Content
7. Set Proxy status to **DNS only** (gray cloud)
8. Save

#### If using **Other Providers**:
- Look for "DNS Settings", "DNS Management", or "Advanced DNS"
- Add TXT records as provided by Resend
- Contact support if you can't find it

### Step 4: Verify Records in Resend

1. After adding all records, go back to Resend dashboard
2. Click **Verify** next to each record
3. Wait 10-60 minutes if verification fails (DNS propagation time)
4. Once all records show ✅ verified, you're done!

### Step 5: Check DNS Propagation

Use online tools to verify your records are live:

**Check SPF:**
```powershell
Resolve-DnsName -Name hostpenny.co.uk -Type TXT
```

**Check DKIM:**
```powershell
Resolve-DnsName -Name resend._domainkey.hostpenny.co.uk -Type TXT
```

**Check DMARC:**
```powershell
Resolve-DnsName -Name _dmarc.hostpenny.co.uk -Type TXT
```

Or use online tools:
- https://mxtoolbox.com/spf.aspx
- https://mxtoolbox.com/dkim.aspx
- https://mxtoolbox.com/dmarc.aspx

---

## 📧 Additional Tips to Avoid Spam

### 1. **Use a Proper "From" Name**
```javascript
// ❌ Bad
from: 'hello@hostpenny.co.uk'

// ✅ Good
from: 'HostPenny <hello@hostpenny.co.uk>'
```

### 2. **Add Unsubscribe Link** (Required for marketing emails)
```html
<p style="font-size:12px; color:#999;">
  Don't want these emails? 
  <a href="https://hostpenny.co.uk/unsubscribe">Unsubscribe</a>
</p>
```

### 3. **Avoid Spam Trigger Words**
Avoid using ALL CAPS or these phrases:
- FREE!!!
- 100% FREE
- Click here NOW
- Buy now!!!
- Limited time offer!!!
- Act now!
- Dear friend

### 4. **Include Physical Address** (Legal requirement)
Add your business address in email footer:
```
HostPenny
[Your Business Address]
United Kingdom
```

### 5. **Balance Text and Images**
- Don't send image-only emails
- Include enough text content
- Use alt text for images

### 6. **Test Before Sending**
Send test emails to:
- Gmail account
- Outlook account
- Check spam folder
- Use mail-tester.com to check your score

---

## 🧪 Test Your Email Authentication

### Use Mail Tester
1. Go to https://www.mail-tester.com/
2. Copy the test email address shown
3. Send an email from your admin dashboard to that address
4. Go back to mail-tester.com and click "Then check your score"
5. Aim for **10/10** score

### What to Look For:
- ✅ SPF: Pass
- ✅ DKIM: Pass
- ✅ DMARC: Pass
- ✅ Spam Score: Low
- ✅ Blacklists: Not listed

---

## 🔍 Troubleshooting

### Issue: "SPF record not found"
**Solution**: 
- Check you added the TXT record to your domain root (@)
- Wait 1 hour for DNS propagation
- Verify with: `Resolve-DnsName -Name hostpenny.co.uk -Type TXT`

### Issue: "DKIM signature failed"
**Solution**:
- Double-check you copied the entire DKIM value (it's very long)
- Make sure there are no spaces or line breaks
- Verify all 3 DKIM records are added
- Contact Resend support if still failing

### Issue: "DMARC policy not found"
**Solution**:
- Add DMARC record: `v=DMARC1; p=none; rua=mailto:admin@hostpenny.co.uk`
- The `p=none` means "monitor but don't block"
- Change to `p=quarantine` after everything works

### Issue: Still going to spam after fixing records
**Possible causes**:
1. **Domain reputation is new** - Send low volume first (50-100/day)
2. **Content triggers spam filters** - Avoid spam words
3. **Engagement is low** - Recipients not opening/clicking
4. **Missing unsubscribe** - Add unsubscribe link
5. **Sending too fast** - Warm up your domain gradually

---

## 📊 Email Warm-Up Strategy

If your domain is new to sending emails, warm it up:

**Week 1**: Send 50-100 emails/day
**Week 2**: Send 200-300 emails/day  
**Week 3**: Send 500-700 emails/day
**Week 4+**: Gradually increase to your target volume

This builds your domain reputation slowly.

---

## ✅ Final Checklist

Before sending emails, verify:

- [ ] SPF record added and verified in Resend
- [ ] All 3 DKIM records added and verified
- [ ] DMARC record added
- [ ] MX records set (for receiving emails)
- [ ] Domain fully verified in Resend (green checkmark)
- [ ] Test email sent to mail-tester.com (score 10/10)
- [ ] Test email sent to your Gmail (not in spam)
- [ ] Test email sent to your Outlook (not in spam)
- [ ] "From" name includes your company name
- [ ] Unsubscribe link included (for newsletters)
- [ ] Physical address in footer
- [ ] No spam trigger words in subject/body
- [ ] Good text-to-image ratio

---

## 🆘 Need Help?

If you're stuck:

1. **Check Resend documentation**: https://resend.com/docs/dashboard/domains/introduction
2. **Contact Resend support**: They can verify your DNS setup
3. **Share your domain registrar**: Different registrars have different DNS interfaces
4. **Test with mail-tester.com**: Shows exactly what's wrong

---

## 📝 Current Status for HostPenny

Based on your setup, you need to:

1. ✅ You're already using Resend (good choice!)
2. ⚠️ **ACTION NEEDED**: Add SPF, DKIM, DMARC records to your DNS
3. ⚠️ **Verify domain** in Resend dashboard shows all green checkmarks
4. ⚠️ **Test** with mail-tester.com before sending to customers

**Estimated Time**: 20-30 minutes + 1 hour DNS propagation

**Where are your DNS records?**
Tell me your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and I can give you exact steps.

---

**Last Updated**: November 9, 2025  
**Priority**: HIGH - Affects email deliverability
