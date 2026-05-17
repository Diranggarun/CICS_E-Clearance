import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  if (!host) return null // email disabled in this environment
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })
  return transporter
}

export async function sendEmail({ to, subject, html }) {
  const t = getTransporter()
  if (!t) {
    console.log(`[email:disabled] would send to ${to}: ${subject}`)
    return { skipped: true }
  }
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || 'CICS E-Clearance <no-reply@cics.edu.ph>',
      to,
      subject,
      html,
    })
    return { sent: true, id: info.messageId }
  } catch (err) {
    console.error('[email] send failed:', err.message)
    return { error: err.message }
  }
}
