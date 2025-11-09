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
          from: process.env.EMAIL_FROM || 'notifications@hostpenny.co.uk',
          to: process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com',
          subject: `🔔 New Enquiry from ${enquiry.fullName}`,
          html: `
            <h2>New Enquiry Received</h2>
            <p><strong>From:</strong> ${enquiry.fullName}</p>
            <p><strong>Email:</strong> ${enquiry.email}</p>
            ${enquiry.company ? `<p><strong>Company:</strong> ${enquiry.company}</p>` : ''}
            <p><strong>Message:</strong> ${enquiry.idea}</p>
            <p><a href="https://hostpenny.co.uk/admin">View in Admin</a></p>
          `,
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
