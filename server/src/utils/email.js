import nodemailer from 'nodemailer';
import { Resend } from 'resend';

let transporter = null;
let resendClient = null;

// Create Resend client (primary email service)
function getResendClient() {
  if (resendClient) return resendClient;
  
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// Create email transporter for Gmail (fallback)
function createTransporter() {
  if (transporter) return transporter;

  // Only create if credentials are provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'your_app_password_here') {
    return null;
  }

  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

// Generate email HTML template
function generateEmailHtml(enquiry) {
  return `
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
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">🆕 New Enquiry Received</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">From:</div>
            <div class="value">${enquiry.fullName}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${enquiry.email}">${enquiry.email}</a></div>
          </div>
          
          ${enquiry.company ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${enquiry.company}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Project Type:</div>
            <div class="value">${enquiry.projectType}</div>
          </div>
          
          <div class="field">
            <div class="label">Budget:</div>
            <div class="value">${enquiry.budget}</div>
          </div>
          
          <div class="field">
            <div class="label">Timeline:</div>
            <div class="value">${enquiry.timeline}</div>
          </div>
          
          <div class="field">
            <div class="label">Project Description:</div>
            <div class="value">${(enquiry.idea || '').replace(/\n/g, '<br>')}</div>
          </div>
          
          ${enquiry.notes ? `
          <div class="field">
            <div class="label">Additional Notes:</div>
            <div class="value">${enquiry.notes.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding: 15px; background: #4c1d95; border-radius: 8px; text-align: center;">
            <a href="http://localhost:5174/admin" style="color: white; text-decoration: none; font-weight: bold;">
              View in Admin Dashboard →
            </a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from HostPenny CRM</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send new enquiry notification to admin
export async function sendEnquiryNotification(enquiry) {
  const adminEmail = process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com';
  const subject = `New Enquiry from ${enquiry.fullName} - ${enquiry.projectType}`;
  const html = generateEmailHtml(enquiry);

  // Try Resend first (primary method)
  const resend = getResendClient();
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: adminEmail,
        subject,
        html,
      });

      if (error) {
        console.warn('⚠️ Resend error, trying Gmail fallback...', error.message);
        // Fall through to Gmail fallback
      } else {
        console.log(`✓ Email sent via Resend (ID: ${data.id})`);
        return;
      }
    } catch (error) {
      console.warn('⚠️ Resend failed, trying Gmail fallback...', error.message);
      // Fall through to Gmail fallback
    }
  }

  // Try Gmail SMTP as fallback
  const transport = createTransporter();
  if (transport) {
    try {
      await transport.sendMail({
        from: `"HostPenny Notifications" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject,
        html,
      });
      console.log(`✓ Email sent via Gmail to ${adminEmail}`);
    } catch (error) {
      console.error('❌ Gmail email failed:', error.message);
    }
  } else {
    console.warn('⚠️ Email notifications disabled: No email service configured');
  }
}
