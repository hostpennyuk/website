import mongoose from 'mongoose';
import { Resend } from 'resend';

// MongoDB connection
let cachedDb = null;
async function connectDb() {
  if (cachedDb) return cachedDb;
  
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'hostpenny'
  });
  
  cachedDb = db;
  return db;
}

// Enquiry Model
const EnquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  projectType: String,
  idea: String,
  budget: String,
  timeline: String,
  status: { type: String, default: 'new' },
  notes: String,
  tags: [String],
  assignee: String,
  dueDate: Date,
  links: [String],
  spam: { type: Boolean, default: false },
}, { timestamps: true });

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

// Subscriber Model
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  source: String,
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

// InboundEmail Model
const InboundEmailSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  from: { email: String, name: String },
  to: [{ email: String, name: String }],
  subject: String,
  text: String,
  html: String,
  headers: Object,
  attachments: [Object],
  receivedAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  starred: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  labels: [String],
  forwardedToGmail: { type: Boolean, default: false },
  forwardedAt: Date,
});

const InboundEmail = mongoose.models.InboundEmail || mongoose.model('InboundEmail', InboundEmailSchema);

// Email notification function
async function sendEnquiryNotification(enquiry) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4c1d95 0%, #f43f5e 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #4c1d95; }
          .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🆕 New Enquiry Received</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${enquiry.fullName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${enquiry.email}</div>
            </div>
            ${enquiry.company ? `<div class="field"><div class="label">Company:</div><div class="value">${enquiry.company}</div></div>` : ''}
            <div class="field">
              <div class="label">Project Type:</div>
              <div class="value">${enquiry.projectType}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${(enquiry.idea || '').replace(/\n/g, '<br>')}</div>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #4c1d95; border-radius: 8px; text-align: center;">
              <a href="https://hostpenny.co.uk/admin" style="color: white; text-decoration: none; font-weight: bold;">
                View in Admin Dashboard →
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'notifications@hostpenny.co.uk',
      to: process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com',
      subject: `🔔 New Enquiry from ${enquiry.fullName}`,
      html: emailHtml,
    });
    
    console.log('✅ Email notification sent');
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDb();

  const { path } = req.query;
  const route = path ? path.join('/') : '';

  try {
    // Health check
    if (route === 'health') {
      return res.status(200).json({ ok: true });
    }

    // Enquiries routes
    if (route === 'enquiries') {
      if (req.method === 'GET') {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        return res.status(200).json(enquiries);
      }
      
      if (req.method === 'POST') {
        const enquiry = new Enquiry(req.body);
        await enquiry.save();
        
        // Send email notification (non-blocking)
        sendEnquiryNotification(enquiry).catch(err => 
          console.error('Email notification failed:', err)
        );
        
        return res.status(201).json(enquiry);
      }
    }

    if (route.startsWith('enquiries/')) {
      const id = route.split('/')[1];
      
      if (req.method === 'PATCH') {
        const enquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(enquiry);
      }
      
      if (req.method === 'DELETE') {
        await Enquiry.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Deleted successfully' });
      }
    }

    // Subscribers routes
    if (route === 'subscribers') {
      if (req.method === 'GET') {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        return res.status(200).json(subscribers);
      }
      
      if (req.method === 'POST') {
        const { email, source } = req.body;
        const existingSubscriber = await Subscriber.findOne({ email });
        
        if (existingSubscriber) {
          return res.status(200).json(existingSubscriber);
        }
        
        const subscriber = new Subscriber({ email, source });
        await subscriber.save();
        return res.status(201).json(subscriber);
      }
    }

    // Inbound emails routes
    if (route === 'inbound-emails') {
      if (req.method === 'GET') {
        const emails = await InboundEmail.find().sort({ receivedAt: -1 });
        return res.status(200).json(emails);
      }
    }

    if (route === 'inbound-emails/webhook') {
      if (req.method === 'POST') {
        const emailData = req.body;
        
        const inboundEmail = new InboundEmail({
          messageId: emailData.message_id || emailData.id,
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
          html: emailData.html,
          headers: emailData.headers,
          attachments: emailData.attachments || [],
        });
        
        await inboundEmail.save();
        
        // Forward to Gmail (non-blocking)
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          const nodemailer = await import('nodemailer');
          const transporter = nodemailer.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
          
          transporter.sendMail({
            from: `"HostPenny Inbox" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com',
            subject: `Fwd: ${emailData.subject}`,
            html: `
              <p><strong>Forwarded email from:</strong> ${emailData.from.email}</p>
              <hr>
              ${emailData.html || emailData.text}
            `,
          }).then(() => {
            inboundEmail.forwardedToGmail = true;
            inboundEmail.forwardedAt = new Date();
            inboundEmail.save();
          }).catch(err => console.error('Failed to forward email:', err));
        }
        
        return res.status(200).json({ success: true, emailId: inboundEmail._id });
      }
    }

    // Route not found
    return res.status(404).json({ error: 'Not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
