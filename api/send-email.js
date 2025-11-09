module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@hostpenny.co.uk',
      to: to,
      subject: subject,
      html: html,
      reply_to: process.env.EMAIL_FROM || 'hello@hostpenny.co.uk',
    });

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ error: error.message });
  }
};
