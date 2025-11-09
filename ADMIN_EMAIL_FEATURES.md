# Admin Dashboard Email Features

## Overview

The admin dashboard now has **two distinct email management systems**, each designed for different use cases:

---

## 📬 **Inbox Tab** - Quick Email Management

**Purpose**: Receive and quickly reply to emails sent to your @hostpenny.co.uk addresses

### Features:
- ✅ **Receive inbound emails** from hello@, support@, admin@, info@, sales@, contact@ @hostpenny.co.uk
- ✅ **Quick compose** for simple text emails
- ✅ **Reply to emails** with quoted original message
- ✅ **Email actions**: Mark as read, star, archive, delete
- ✅ **Filters**: All, Unread, Starred, Archived
- ✅ **Search**: Find emails by sender, subject, or content
- ✅ **Multi-sender support**: Choose which @hostpenny.co.uk address to send from
- ✅ **Automatic Gmail forwarding**: All inbound emails forwarded to hostpennyuk@gmail.com

### Best For:
- Customer support inquiries
- Quick responses to client emails
- Managing day-to-day correspondence
- One-on-one communication

### User Interface:
- Clean inbox view with email list
- Email preview pane
- Simple compose form (From, To, Subject, Message)
- No templates or styling - plain text/HTML emails

---

## ✨ **Emails Tab** - Professional Branded Campaigns

**Purpose**: Create beautiful, branded emails with professional templates, custom styles, and signatures

### Features:
- ✅ **Email Templates**: Choose from pre-saved templates (subject + body)
- ✅ **4 Professional Styles**: 
  - Template 1: Purple gradient theme
  - Template 2: Orange theme
  - Template 3: Purple-pink gradient
  - Template 4: Dark professional theme
- ✅ **Signature Integration**: Auto-append professional signatures with name, designation
- ✅ **Rich Email Fields**:
  - From: Choose sender address
  - To: Recipient email
  - Subject: Email subject line
  - Preheader: Preview text (shows in inbox)
  - CTA Button: Call-to-action with custom label and URL
  - Message: Main email body
- ✅ **Live Preview**: See exactly how email will look before sending
- ✅ **Outbox History**: Track all sent branded emails
- ✅ **Professional HTML Emails**: Fully responsive, mobile-optimized
- ✅ **Actual Email Sending**: Integrates with `/api/send-email` via Resend

### Best For:
- Newsletter campaigns
- Marketing announcements
- Product launches
- Welcome emails
- Promotional campaigns
- Professional client communications
- Branded company announcements

### User Interface:
- Template selector dropdown
- Style selector (4 visual themes)
- Signature selector
- Rich compose form with all email elements
- Live HTML preview pane
- Outbox with sent email history

---

## 🎨 Email Template Styles

### Template 1 - Purple Professional
- **Colors**: Purple gradient header (#4c1d95)
- **Background**: Light purple (#f3e8ff)
- **Use Case**: General corporate communications

### Template 2 - Orange Energy
- **Colors**: Orange header (#f97316)
- **Background**: Light orange (#fff7ed)
- **Use Case**: Announcements, promotions

### Template 3 - Purple-Pink Gradient
- **Colors**: Purple to pink gradient
- **Background**: Light pink (#fff1f2)
- **Use Case**: Creative campaigns, special events

### Template 4 - Dark Professional
- **Colors**: Dark gray/black header (#111827)
- **Background**: Light gray (#e5e7eb)
- **Use Case**: Formal, executive communications

---

## 📝 Email Signatures

Manage professional signatures in the **Signatures Tab**:

**Fields**:
- **Name**: Signature identifier
- **Full Name**: Your name (e.g., "John Smith")
- **Designation**: Your title (e.g., "CEO, HostPenny")
- **Signature**: Full signature block with contact info

**Usage**: Automatically appended to all emails sent from the Emails tab.

---

## 📋 Email Templates

Create reusable templates in the **Templates Tab**:

**Fields**:
- **Name**: Template identifier (e.g., "Welcome Email", "Newsletter")
- **Subject**: Pre-filled subject line
- **Body**: Pre-filled email content

**Usage**: Select template in Emails tab to auto-populate subject and body.

---

## 🔄 Workflow Comparison

### Quick Customer Reply (Use Inbox Tab):
1. Customer sends email to support@hostpenny.co.uk
2. Email appears in Inbox tab
3. Click email to read
4. Click "Reply" button
5. Type quick response
6. Send

### Professional Newsletter (Use Emails Tab):
1. Go to Emails tab
2. Select newsletter template
3. Choose style (e.g., Template 2 - Orange)
4. Select signature
5. Fill in recipient
6. Customize subject/content
7. Add CTA button ("Read More")
8. Preview in live preview pane
9. Send
10. Track in Outbox

---

## 🛠️ Technical Details

### Inbox Tab
- **API Endpoint**: `/api/inbound-emails`
- **Methods**: GET (list), GET/:id (single), PATCH (actions), POST/:id/reply (reply)
- **Database**: MongoDB InboundEmail collection
- **Email Provider**: Resend (webhook) + Nodemailer (forwarding)

### Emails Tab
- **API Endpoint**: `/api/send-email`
- **Method**: POST
- **Email Provider**: Resend API
- **Storage**: LocalStorage (outbox history)
- **HTML Generation**: Server-side rendering with 4 responsive templates

---

## 📧 Available Email Addresses

Both tabs support sending from:
- hello@hostpenny.co.uk
- support@hostpenny.co.uk
- admin@hostpenny.co.uk
- info@hostpenny.co.uk
- sales@hostpenny.co.uk
- contact@hostpenny.co.uk
- notifications@hostpenny.co.uk

---

## 🎯 Quick Reference

| Feature | Inbox | Emails |
|---------|-------|--------|
| **Purpose** | Receive & Quick Reply | Branded Campaigns |
| **Email Style** | Plain/Simple | Professional HTML |
| **Templates** | ❌ No | ✅ Yes |
| **Styling** | ❌ No | ✅ 4 Themes |
| **Signatures** | ❌ No | ✅ Yes |
| **CTA Buttons** | ❌ No | ✅ Yes |
| **Live Preview** | ❌ No | ✅ Yes |
| **Inbound Emails** | ✅ Yes | ❌ No |
| **Quick Compose** | ✅ Yes | ❌ No |
| **Reply to Email** | ✅ Yes | ❌ No |
| **Best For** | Support | Marketing |

---

## 💡 Tips

1. **Use Inbox for**: Daily customer support and quick communication
2. **Use Emails for**: Newsletters, announcements, promotional campaigns
3. **Create templates**: Save time by creating reusable email templates
4. **Add signatures**: Build professional credibility with consistent signatures
5. **Preview before sending**: Always check live preview in Emails tab
6. **Track your campaigns**: Use Outbox to see what was sent and when

---

**Last Updated**: November 9, 2025  
**Version**: 2.0
