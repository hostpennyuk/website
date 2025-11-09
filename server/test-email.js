import 'dotenv/config';
import { sendEnquiryNotification } from './src/utils/email.js';

// Test enquiry data
const testEnquiry = {
  fullName: 'John Smith',
  email: 'john.smith@example.com',
  company: 'Tech Solutions Ltd',
  projectType: 'Website Development',
  budget: '£5,000 - £10,000',
  timeline: '2-3 months',
  idea: 'We need a modern website for our growing tech consultancy business. Looking for a responsive design with a blog section and contact forms.',
  notes: 'This is a test email from HostPenny email system.',
};

console.log('🧪 Testing email notification system...\n');
console.log('Configuration:');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Not set');
console.log('- SMTP_USER:', process.env.SMTP_USER ? '✓ Configured' : '✗ Not set');
console.log('- SMTP_PASS:', process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your_app_password_here' ? '✓ Configured' : '✗ Not set');
console.log('- ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'hostpennyuk@gmail.com');
console.log('\nSending test email...\n');

sendEnquiryNotification(testEnquiry)
  .then(() => {
    console.log('\n✅ Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
