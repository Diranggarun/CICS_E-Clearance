const { supabase } = require('../lib/supabaseClient'); // adjust path if needed
const { sendEmail } = require('./emailService');
const emailTemplates = require('./emailTemplates');

/**
 * Main function: Save notification to DB AND send email
 */
async function notify({
  userId,
  userEmail,
  userName,
  type,
  title,
  message,
  emailKey, // e.g. "approvalPerStage", "paymentReminder"
  emailArgs = [] // data to fill into email template
}) {
  try {
    // ✅ STEP 1: SAVE TO DATABASE (THIS IS THE PART WE NEED TO UPDATE)
    const { error: dbError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: type,
        title: title,
        message: message,
        read_at: null,           // ✅ VERY IMPORTANT — matches your frontend
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('DB Save Error:', dbError.message);
      return;
    }

    // ✅ STEP 2: SEND EMAIL (uses your emailService.js)
    if (emailKey && userEmail) {
      const template = emailTemplates[emailKey];
      if (template) {
        const emailHtml = template(...emailArgs);
        await sendEmail({
          to: userEmail,
          subject: title,
          html: emailHtml
        });
      }
    }

  } catch (err) {
    console.error('Notification Error:', err.message);
  }
}

module.exports = { notify };