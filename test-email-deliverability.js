// Test email deliverability with new improvements
const { Resend } = require('resend');

async function sendTestEmail() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log('📧 Sending test email with improved deliverability settings...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'HostPenny <hello@hostpenny.co.uk>',
      to: 'classmigo1@gmail.com',
      subject: 'Test Email - Deliverability Improvements',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Email Deliverability Test</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #333; margin-top: 0;">Hello!</h2>
            
            <p>This is a test email from HostPenny to verify the new anti-spam improvements are working correctly.</p>
            
            <h3 style="color: #667eea;">✨ New Features Implemented:</h3>
            <ul style="line-height: 1.8;">
              <li>✅ Proper sender name: <code>HostPenny &lt;hello@hostpenny.co.uk&gt;</code></li>
              <li>✅ Unsubscribe headers added</li>
              <li>✅ Professional HTML formatting</li>
              <li>✅ Company footer with address</li>
              <li>✅ Proper email structure</li>
            </ul>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 0;"><strong>📊 Expected Results:</strong></p>
              <p style="margin: 10px 0 0 0;">This email should land in your <strong>Primary</strong> inbox (not Promotions or Spam) because:</p>
              <ul style="margin-top: 10px;">
                <li>Authentication is excellent (9.5/10 score)</li>
                <li>Sender name is professional</li>
                <li>HTML is properly formatted</li>
                <li>Footer includes company info</li>
              </ul>
            </div>
            
            <h3 style="color: #667eea;">🧪 Please Check:</h3>
            <ol style="line-height: 1.8;">
              <li>Did this email arrive in <strong>Primary</strong>, <strong>Promotions</strong>, or <strong>Spam</strong>?</li>
              <li>Does the sender show as "HostPenny" (not just the email address)?</li>
              <li>Is the formatting displaying correctly?</li>
              <li>Can you see the footer with company information?</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hostpenny.co.uk" style="display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Visit HostPenny Website
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you received this email in your spam folder, please mark it as "Not Spam" and add hello@hostpenny.co.uk to your contacts. This helps improve future deliverability.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #666; text-align: center; line-height: 1.8;">
            <p style="margin: 0 0 8px 0; font-weight: 600;">HostPenny</p>
            <p style="margin: 0 0 8px 0;">Professional Web Development & Hosting</p>
            <p style="margin: 0 0 12px 0;">United Kingdom</p>
            <p style="margin: 0 0 8px 0;">
              <a href="https://hostpenny.co.uk" style="color: #667eea; text-decoration: none;">Visit Website</a> | 
              <a href="https://hostpenny.co.uk/unsubscribe" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
              <a href="https://hostpenny.co.uk/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
            </p>
            <p style="margin: 0; color: #999; font-size: 11px;">© ${new Date().getFullYear()} HostPenny. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 11px;">
              This is a test email. You're receiving this because you requested a deliverability test.
            </p>
          </div>
        </body>
        </html>
      `,
      reply_to: 'hello@hostpenny.co.uk',
      headers: {
        'X-Entity-Ref-ID': `test-${Date.now()}`,
        'List-Unsubscribe': '<https://hostpenny.co.uk/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return;
    }

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', data.id);
    console.log('\n📋 Next Steps:');
    console.log('1. Check classmigo1@gmail.com inbox');
    console.log('2. Look in Primary, Promotions, and Spam folders');
    console.log('3. Note which folder it landed in');
    console.log('4. Check if sender shows as "HostPenny"');
    console.log('5. Verify formatting looks professional');
    console.log('\n💡 If in spam: Mark as "Not Spam" and add to contacts');
    console.log('💡 If in Promotions: This is normal for marketing emails');
    console.log('💡 If in Primary: Perfect! Deliverability is excellent');

  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
}

// Load environment variables
require('dotenv').config({ path: './server/.env' });

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in environment variables');
  console.log('Make sure server/.env file exists with RESEND_API_KEY');
  process.exit(1);
}

sendTestEmail();
