import prisma from '../lib/prisma.js'
import { sendEmail } from './email.js'
import { templates } from './emailTemplates.js'

// Persist an in-app notification AND (optionally) send an email. Best-effort:
// failures are logged but never thrown — notifications must never break the
// surrounding business flow (e.g. an approval transaction).
export async function notify({
  userId,
  userEmail,
  type = 'system',
  title,
  message,
  emailKey,
  emailArgs = [],
}) {
  try {
    if (userId) {
      await prisma.notification.create({
        data: { userId, type, title, message },
      })
    }
  } catch (err) {
    console.error('[notify] DB insert failed:', err.message)
  }

  if (emailKey && userEmail && templates[emailKey]) {
    try {
      const { subject, html } = templates[emailKey](...emailArgs)
      await sendEmail({ to: userEmail, subject, html })
    } catch (err) {
      console.error('[notify] email failed:', err.message)
    }
  }
}
