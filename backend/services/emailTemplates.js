const templates = {
  accountApproval: (name) => ({
    subject: 'Your account has been approved — CICS E-Clearance',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your CICS E-Clearance account has been approved. You may now log in and submit your clearance request.</p>
      <p>— CICS Clearance Office</p>
    `
  }),

  clearanceStatus: (name, stage, officeName, status) => ({
    subject: `Clearance update: ${officeName} — ${status}`,
    html: `
      <h2>Clearance Status Update</h2>
      <p>Hi ${name},</p>
      <p>Your clearance request at <strong>${officeName}</strong> (Stage ${stage}) has been <strong>${status}</strong>.</p>
      <p>Log in to your account to view details.</p>
      <p>— CICS Clearance Office</p>
    `
  }),

  finesReminder: (name, amount) => ({
    subject: 'Outstanding balance — action required',
    html: `
      <h2>Outstanding Balance Reminder</h2>
      <p>Hi ${name},</p>
      <p>You have an outstanding balance of <strong>₱${amount}</strong> that is blocking your clearance.</p>
      <p>Please settle your balance at the Finance Office to continue your clearance process.</p>
      <p>— CICS Clearance Office</p>
    `
  }),

  paymentConfirmation: (name, refNumber, amount) => ({
    subject: `Payment confirmed — ₱${amount}`,
    html: `
      <h2>Payment Confirmed</h2>
      <p>Hi ${name},</p>
      <p>Your payment of <strong>₱${amount}</strong> has been received.</p>
      <p>Reference number: <strong>${refNumber}</strong></p>
      <p>Your clearance process may now continue.</p>
      <p>— CICS Clearance Office</p>
    `
  }),

  approvalPerStage: (name, officeName, status, remarks) => ({
    subject: `${officeName} has ${status} your clearance`,
    html: `
      <h2>Stage Decision: ${status}</h2>
      <p>Hi ${name},</p>
      <p><strong>${officeName}</strong> has <strong>${status}</strong> your clearance request.</p>
      ${remarks ? `<p>Remarks: ${remarks}</p>` : ''}
      <p>Log in to your account for more details.</p>
      <p>— CICS Clearance Office</p>
    `
  }),

  finalClearance: (name) => ({
    subject: 'Your clearance is ready! 🎉',
    html: `
      <h2>Clearance Approved!</h2>
      <p>Hi ${name},</p>
      <p>Congratulations! All stages of your clearance have been approved.</p>
      <p>You may now log in and download your clearance certificate.</p>
      <p>— CICS Clearance Office</p>
    `
  }),
};

module.exports = templates;