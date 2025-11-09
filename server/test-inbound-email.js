// Test script to simulate Resend inbound email webhook
// This helps verify the webhook handler is working before deploying

const testEmailPayload = {
  message_id: 'test-' + Date.now(),
  from: {
    email: 'customer@example.com',
    name: 'Test Customer'
  },
  to: 'hello@hostpenny.co.uk',
  subject: 'Test Inbound Email - Question about your services',
  text: 'Hi,\n\nI am interested in learning more about your web development services.\n\nCould you please send me a quote for building a modern website?\n\nBest regards,\nTest Customer',
  html: '<p>Hi,</p><p>I am interested in learning more about your web development services.</p><p>Could you please send me a quote for building a modern website?</p><p>Best regards,<br>Test Customer</p>',
  reply_to: {
    email: 'customer@example.com',
    name: 'Test Customer'
  }
};

fetch('http://localhost:4000/api/inbound-emails/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testEmailPayload)
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Test email webhook succeeded!');
    console.log('Response:', data);
    console.log('\nCheck your:');
    console.log('1. Server logs - should show email processing');
    console.log('2. Gmail (hostpennyuk@gmail.com) - should have forwarded email');
    console.log('3. Admin Dashboard - should show the email');
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
  });
