import connectDb from '../server/src/utils/db.js';
import Enquiry from '../server/src/models/Enquiry.js';
import Subscriber from '../server/src/models/Subscriber.js';
import InboundEmail from '../server/src/models/InboundEmail.js';
import { sendEnquiryNotification } from '../server/src/utils/email.js';

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
