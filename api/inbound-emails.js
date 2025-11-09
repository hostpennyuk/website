const mongoose = require('mongoose');

let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = conn;
  return conn;
}

const InboundEmailSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  from: {
    email: { type: String, required: true },
    name: { type: String },
  },
  to: [{ email: { type: String, required: true }, name: { type: String } }],
  cc: [{ email: { type: String }, name: { type: String } }],
  bcc: [{ email: { type: String }, name: { type: String } }],
  subject: { type: String, required: true },
  text: String,
  html: String,
  receivedAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  starred: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  labels: [String],
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    url: String,
  }],
  replyTo: { email: String, name: String },
  inReplyTo: String,
  references: [String],
  forwardedToGmail: { type: Boolean, default: false },
  forwardedAt: Date,
}, { timestamps: true });

InboundEmailSchema.index({ receivedAt: -1 });
InboundEmailSchema.index({ 'from.email': 1 });
InboundEmailSchema.index({ read: 1 });
InboundEmailSchema.index({ archived: 1 });

module.exports = async (req, res) => {
  await connectDB();
  
  const InboundEmail = mongoose.models.InboundEmail || mongoose.model('InboundEmail', InboundEmailSchema);

  try {
    // Handle different HTTP methods and routes
    const { method, query } = req;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Remove 'api' and 'inbound-emails' from path to get actual route parts
    const routeParts = pathParts.slice(2); // Skip 'api' and 'inbound-emails'
    const emailId = routeParts[0] || null;
    const action = routeParts[1] || null;

    // POST /api/inbound-emails - Create/Receive new email (webhook)
    if (method === 'POST' && !emailId) {
      const emailData = req.body;
      
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

      // Forward to Gmail
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const nodemailer = require('nodemailer');
          
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
            to: 'hostpennyuk@gmail.com',
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
                  <p style="margin: 0;">View and reply to this email in your <a href="https://hostpenny.co.uk/admin" style="color: #8b5cf6;">Admin Dashboard</a></p>
                </div>
              </div>
            `,
          });

          inboundEmail.forwardedToGmail = true;
          inboundEmail.forwardedAt = new Date();
          await inboundEmail.save();
          
          console.log('✅ Email forwarded to hostpennyuk@gmail.com');
        } catch (error) {
          console.error('❌ Failed to forward to Gmail:', error.message);
        }
      }

      return res.status(200).json({ success: true, id: inboundEmail._id });
    }

    // GET /api/inbound-emails - List all emails
    if (method === 'GET' && !emailId) {
      const { read, archived, starred, limit = 50, skip = 0, search } = query;
      
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

      return res.json({ emails, total, unreadCount, hasMore: total > (parseInt(skip) + emails.length) });
    }

    // GET /api/inbound-emails/:id - Get single email
    if (method === 'GET' && emailId && !action) {
      if (!mongoose.Types.ObjectId.isValid(emailId)) {
        return res.status(400).json({ error: 'Invalid email ID' });
      }
      const email = await InboundEmail.findById(emailId);
      if (!email) return res.status(404).json({ error: 'Email not found' });
      return res.json(email);
    }

    // PATCH /api/inbound-emails/:id/read
    if (method === 'PATCH' && action === 'read') {
      if (!mongoose.Types.ObjectId.isValid(emailId)) {
        return res.status(400).json({ error: 'Invalid email ID' });
      }
      const email = await InboundEmail.findByIdAndUpdate(
        emailId,
        { read: req.body.read },
        { new: true }
      );
      return res.json(email);
    }

    // PATCH /api/inbound-emails/:id/star
    if (method === 'PATCH' && action === 'star') {
      if (!mongoose.Types.ObjectId.isValid(emailId)) {
        return res.status(400).json({ error: 'Invalid email ID' });
      }
      const email = await InboundEmail.findByIdAndUpdate(
        emailId,
        { starred: req.body.starred },
        { new: true }
      );
      return res.json(email);
    }

    // PATCH /api/inbound-emails/:id/archive
    if (method === 'PATCH' && action === 'archive') {
      if (!mongoose.Types.ObjectId.isValid(emailId)) {
        return res.status(400).json({ error: 'Invalid email ID' });
      }
      const email = await InboundEmail.findByIdAndUpdate(
        emailId,
        { archived: req.body.archived },
        { new: true }
      );
      return res.json(email);
    }

    // DELETE /api/inbound-emails/:id
    if (method === 'DELETE' && emailId) {
      await InboundEmail.findByIdAndDelete(emailId);
      return res.json({ success: true });
    }

    // POST /api/inbound-emails/:id/reply - Send reply
    if (method === 'POST' && action === 'reply') {
      const email = await InboundEmail.findById(emailId);
      if (!email) return res.status(404).json({ error: 'Email not found' });

      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'hello@hostpenny.co.uk',
        to: email.from.email,
        subject: req.body.subject || `Re: ${email.subject}`,
        html: req.body.html,
        reply_to: process.env.EMAIL_FROM || 'hello@hostpenny.co.uk',
        in_reply_to: email.messageId,
      });

      if (error) throw new Error(error.message);

      email.read = true;
      await email.save();

      return res.json({ success: true, messageId: data.id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Inbound emails API error:', error);
    res.status(500).json({ error: error.message });
  }
};
