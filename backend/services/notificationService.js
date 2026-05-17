const { createClient } = require('@supabase/supabase-js');
const { sendEmail } = require('./emailService');
const templates = require('./emailTemplates');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function notify({
  userId,
  userEmail,
  userName,
  type,
  title,
  message,
  emailKey,
  emailArgs,
}) {
  try {
    // 1. Save to in-app notification feed
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      type,
      title,
      message,
    });

    if (error) console.error('Notification insert error:', error.message);

    // 2. Send email if a matching template exists
    if (emailKey && templates[emailKey]) {
      const args = emailArgs || [userName];
      const { subject, html } = templates[emailKey](...args);
      await sendEmail({ to: userEmail, subject, html });
    }
  } catch (err) {
    console.error('Notification service error:', err.message);
  }
}

module.exports = { notify };