import express from 'express';
import InboundEmail from '../models/InboundEmail.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Webhook endpoint for Resend inbound emails
router.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Received inbound email webhook from Resend');
    
    const emailData = req.body;
    
    // Save email to database
    const inboundEmail = new InboundEmail({
      messageId: emailData.message_id || emailData.id,
      from: {
        email: emailData.from?.email || emailData.from,
        name: emailData.from?.name,
      },
      to: Array.isArray(emailData.to) ? emailData.to : [{ email: emailData.to }],
      cc: emailData.cc || [],
      bcc: emailData.bcc || [],
      subject: emailData.subject || '(No Subject)',
      text: emailData.text || emailData.plain_text,
      html: emailData.html || emailData.html_body,
      replyTo: emailData.reply_to ? {
        email: emailData.reply_to.email || emailData.reply_to,
        name: emailData.reply_to.name,
      } : null,
      attachments: emailData.attachments || [],
      inReplyTo: emailData.in_reply_to,
      references: emailData.references || [],
    });

    await inboundEmail.save();
    console.log('✅ Email saved to database:', inboundEmail._id);

    // Forward to Gmail
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await forwardToGmail(emailData);
        inboundEmail.forwardedToGmail = true;
        inboundEmail.forwardedAt = new Date();
        await inboundEmail.save();
        console.log('✅ Email forwarded to Gmail');
      } catch (error) {
        console.error('❌ Failed to forward to Gmail:', error.message);
      }
    }

    res.status(200).json({ success: true, id: inboundEmail._id });
  } catch (error) {
    console.error('❌ Error processing inbound email:', error);
    res.status(500).json({ error: 'Failed to process email' });
  }
});

// Forward email to Gmail
async function forwardToGmail(emailData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromEmail = emailData.from?.email || emailData.from;
  const fromName = emailData.from?.name || fromEmail;

  await transporter.sendMail({
    from: `"${fromName} (via HostPenny)" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com',
    replyTo: fromEmail,
    subject: `[Fwd: hello@hostpenny.co.uk] ${emailData.subject || '(No Subject)'}`,
    text: `
Original From: ${fromName} <${fromEmail}>
Original To: ${emailData.to}
Original Subject: ${emailData.subject || '(No Subject)'}

---

${emailData.text || emailData.plain_text || 'No text content'}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0;">📧 Forwarded Email from hello@hostpenny.co.uk</h3>
        </div>
        <div style="border: 1px solid #ddd; border-top: none; padding: 20px; background: #f9f9f9;">
          <p><strong>From:</strong> ${fromName} &lt;${fromEmail}&gt;</p>
          <p><strong>To:</strong> ${emailData.to}</p>
          <p><strong>Subject:</strong> ${emailData.subject || '(No Subject)'}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <div style="background: white; padding: 15px; border-radius: 8px;">
            ${emailData.html || emailData.html_body || emailData.text || 'No content'}
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">View and reply to this email in your <a href="http://localhost:5173/admin?tab=emails" style="color: #8b5cf6;">Admin Dashboard</a></p>
        </div>
      </div>
    `,
  });
}

// Get all inbound emails
router.get('/', async (req, res) => {
  try {
    const { 
      read, 
      archived, 
      starred,
      limit = 50, 
      skip = 0,
      search 
    } = req.query;

    const filter = {};
    if (read !== undefined) filter.read = read === 'true';
    if (archived !== undefined) filter.archived = archived === 'true';
    if (starred !== undefined) filter.starred = starred === 'true';
    
    if (search) {
      filter.$or = [
        { 'from.email': { $regex: search, $options: 'i' } },
        { 'from.name': { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } },
      ];
    }

    const emails = await InboundEmail.find(filter)
      .sort({ receivedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await InboundEmail.countDocuments(filter);
    const unreadCount = await InboundEmail.countDocuments({ ...filter, read: false });

    res.json({
      emails,
      total,
      unreadCount,
      hasMore: total > (parseInt(skip) + emails.length),
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Get single email by ID
router.get('/:id', async (req, res) => {
  try {
    const email = await InboundEmail.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Mark email as read
router.patch('/:id/read', async (req, res) => {
  try {
    const email = await InboundEmail.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read },
      { new: true }
    );
    res.json(email);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Star/unstar email
router.patch('/:id/star', async (req, res) => {
  try {
    const email = await InboundEmail.findByIdAndUpdate(
      req.params.id,
      { starred: req.body.starred },
      { new: true }
    );
    res.json(email);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Archive/unarchive email
router.patch('/:id/archive', async (req, res) => {
  try {
    const email = await InboundEmail.findByIdAndUpdate(
      req.params.id,
      { archived: req.body.archived },
      { new: true }
    );
    res.json(email);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Add labels to email
router.patch('/:id/labels', async (req, res) => {
  try {
    const email = await InboundEmail.findByIdAndUpdate(
      req.params.id,
      { labels: req.body.labels },
      { new: true }
    );
    res.json(email);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Delete email
router.delete('/:id', async (req, res) => {
  try {
    await InboundEmail.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// Send reply from admin dashboard
router.post('/:id/reply', async (req, res) => {
  try {
    const email = await InboundEmail.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@hostpenny.co.uk',
      to: email.from.email,
      subject: req.body.subject || `Re: ${email.subject}`,
      html: req.body.html,
      reply_to: process.env.EMAIL_FROM || 'hello@hostpenny.co.uk',
      in_reply_to: email.messageId,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Mark original as read
    email.read = true;
    await email.save();

    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

export default router;
