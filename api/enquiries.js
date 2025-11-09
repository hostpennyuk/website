const mongoose = require('mongoose');

// MongoDB connection
let cachedDb = null;
async function connectDb() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGODB_URI, { dbName: 'hostpenny' });
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
}, { timestamps: true });

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();

  try {
    if (req.method === 'GET') {
      const enquiries = await Enquiry.find().sort({ createdAt: -1 });
      return res.status(200).json(enquiries);
    }
    
    if (req.method === 'POST') {
      const enquiry = new Enquiry(req.body);
      await enquiry.save();
      
      // Send email notification
      if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: `HostPenny Notifications <${process.env.EMAIL_FROM || 'notifications@hostpenny.co.uk'}>`,
          to: process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com',
          subject: `New Enquiry from ${enquiry.fullName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">New Enquiry Received</h2>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                <p><strong>From:</strong> ${enquiry.fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
                ${enquiry.company ? `<p><strong>Company:</strong> ${enquiry.company}</p>` : ''}
                ${enquiry.projectType ? `<p><strong>Project Type:</strong> ${enquiry.projectType}</p>` : ''}
                ${enquiry.budget ? `<p><strong>Budget:</strong> ${enquiry.budget}</p>` : ''}
                ${enquiry.timeline ? `<p><strong>Timeline:</strong> ${enquiry.timeline}</p>` : ''}
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
                  ${enquiry.idea}
                </div>
                <p style="margin-top: 20px;">
                  <a href="https://hostpenny.co.uk/admin" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View in Admin Dashboard</a>
                </p>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 6px; font-size: 12px; color: #666;">
                <p style="margin: 0;"><strong>HostPenny</strong></p>
                <p style="margin: 5px 0;">Professional Web Development & Hosting</p>
                <p style="margin: 5px 0;">support@hostpenny.co.uk</p>
              </div>
            </body>
            </html>
          `,
          headers: {
            'X-Entity-Ref-ID': `enquiry-${enquiry._id}`,
          },
        }).catch(err => console.error('Email failed:', err));
      }
      
      return res.status(201).json(enquiry);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
