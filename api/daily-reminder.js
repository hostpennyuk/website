const mongoose = require('mongoose');

// MongoDB connection
let cachedDb = null;
async function connectDb() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGODB_URI, { dbName: 'hostpenny' });
  cachedDb = db;
  return db;
}

// Team Member Schema (for storing team members in DB)
const TeamMemberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  role: { type: String, default: 'Contributor' },
  jobTitle: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

const REQUIRED_REMINDER_EMAILS = [
  { email: 'ritailoka@gmail.com', name: 'Rita' },
  { email: 'profmendel@gmail.com', name: 'Prof Mendel' },
];

// Enquiry Model for counting
const EnquirySchema = new mongoose.Schema({
  fullName: String,
  email: String,
  status: String,
}, { timestamps: true });

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

module.exports = async (req, res) => {
  // Verify authorization (use a secret key or Vercel cron authorization)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET || 'hostpenny-cron-2024';
  
  if (authHeader !== `Bearer ${cronSecret}` && req.query.key !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDb();

    // Get stats for the email
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);

    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
    const todayEnquiries = await Enquiry.countDocuments({ createdAt: { $gte: today } });
    const weekEnquiries = await Enquiry.countDocuments({ createdAt: { $gte: weekAgo } });

    // Get team members from DB (active only)
    const dbTeamMembers = await TeamMember.find({ active: true }).lean();

    // Always include required recipients + optional admin fallback
    const baseRecipients = [
      ...REQUIRED_REMINDER_EMAILS,
      ...(process.env.ADMIN_EMAIL ? [{ email: process.env.ADMIN_EMAIL, name: 'Admin' }] : []),
      ...dbTeamMembers.map((member) => ({
        email: member.email,
        name: member.name,
      })),
    ];

    const recipientMap = new Map();
    for (const recipient of baseRecipients) {
      const normalizedEmail = String(recipient?.email || '').trim().toLowerCase();
      if (!normalizedEmail) continue;
      if (!recipientMap.has(normalizedEmail)) {
        recipientMap.set(normalizedEmail, {
          email: normalizedEmail,
          name: recipient?.name || '',
        });
      }
    }

    const teamMembers = Array.from(recipientMap.values());

    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const dashboardUrl = 'https://hostpenny.co.uk/admin';
    const emailResults = [];

    for (const member of teamMembers) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <img src="https://hostpenny.co.uk/logo.gif" alt="HostPenny" style="height: 50px; margin-bottom: 15px;" />
            <h1 style="color: white; margin: 0; font-size: 24px;">Daily Dashboard Reminder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Good morning${member.name ? `, ${member.name.split(' ')[0]}` : ''}! 👋</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #444;">Here's your daily business snapshot:</p>
            
            <div style="display: flex; gap: 15px; margin: 25px 0; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: white;">${newEnquiries}</div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-transform: uppercase;">New Enquiries</div>
              </div>
              <div style="flex: 1; min-width: 120px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: white;">${todayEnquiries}</div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-transform: uppercase;">Today</div>
              </div>
              <div style="flex: 1; min-width: 120px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: white;">${weekEnquiries}</div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-transform: uppercase;">This Week</div>
              </div>
            </div>
            
            ${newEnquiries > 0 ? `
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong style="color: #856404;">⚠️ Action Required:</strong>
                <p style="color: #856404; margin: 5px 0 0 0;">You have ${newEnquiries} new enquir${newEnquiries > 1 ? 'ies' : 'y'} waiting for review!</p>
              </div>
            ` : `
              <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong style="color: #155724;">✅ All caught up!</strong>
                <p style="color: #155724; margin: 5px 0 0 0;">No new enquiries to review. Great job staying on top of things!</p>
              </div>
            `}
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Open Dashboard →
              </a>
            </div>
            
            <p style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">
              This is your daily reminder from HostPenny.<br/>
              <a href="${dashboardUrl}" style="color: #667eea;">Manage notification settings</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 11px;">
            <p style="margin: 0;">HostPenny • Professional Web Development</p>
            <p style="margin: 5px 0;">support@hostpenny.co.uk</p>
          </div>
        </body>
        </html>
      `;

      try {
        const result = await resend.emails.send({
          from: `HostPenny <${process.env.EMAIL_FROM || 'notifications@hostpenny.co.uk'}>`,
          to: member.email,
          subject: `📊 Daily Reminder: ${newEnquiries} new enquir${newEnquiries !== 1 ? 'ies' : 'y'} waiting`,
          html: emailHtml,
          headers: {
            'X-Entity-Ref-ID': `daily-reminder-${Date.now()}`,
          },
        });
        emailResults.push({ email: member.email, success: true, id: result.data?.id });
      } catch (err) {
        emailResults.push({ email: member.email, success: false, error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Daily reminder sent to ${emailResults.filter(r => r.success).length}/${teamMembers.length} team members`,
      stats: { totalEnquiries, newEnquiries, todayEnquiries, weekEnquiries },
      results: emailResults,
    });
  } catch (error) {
    console.error('Daily reminder error:', error);
    return res.status(500).json({ error: error.message });
  }
};
