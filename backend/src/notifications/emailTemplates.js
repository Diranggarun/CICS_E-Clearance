// ESM port of the 6 email templates Ed authored. Each template returns
// { subject, html } so the caller never builds the subject line by hand.

export const templates = {
  accountApproval: (name) => ({
    subject: 'Your account has been approved — CICS E-Clearance',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your CICS E-Clearance account has been approved. You may now log in and submit your clearance request.</p>
      <p>— CICS Clearance Office</p>
    `,
  }),

  accountDenial: (name, reason) => ({
    subject: 'Your account application was denied',
    html: `
      <h2>Account Application Update</h2>
      <p>Hi ${name},</p>
      <p>Your CICS E-Clearance account application was not approved.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>Please contact the BYTES Office for assistance.</p>
    `,
  }),

  stageDecision: (name, officeName, status, reason) => ({
    subject: `${officeName} has ${status} your clearance`,
    html: `
      <h2>Clearance Stage: ${status}</h2>
      <p>Hi ${name},</p>
      <p><strong>${officeName}</strong> has <strong>${status}</strong> your clearance request.</p>
      ${reason ? `<p>Remarks: ${reason}</p>` : ''}
      <p>Log in to view full status.</p>
    `,
  }),

  finalClearance: (name) => ({
    subject: 'Your clearance is ready!',
    html: `
      <h2>Clearance Approved</h2>
      <p>Hi ${name},</p>
      <p>Congratulations! All stages of your clearance have been approved.</p>
      <p>You may now log in and download your clearance certificate.</p>
    `,
  }),

  paymentConfirmation: (name, refNumber, amount) => ({
    subject: `Payment confirmed — ₱${amount}`,
    html: `
      <h2>Payment Confirmed</h2>
      <p>Hi ${name},</p>
      <p>Your payment of <strong>₱${amount}</strong> has been received.</p>
      <p>Reference number: <strong>${refNumber}</strong></p>
    `,
  }),

  finesReminder: (name, amount) => ({
    subject: 'Outstanding balance — action required',
    html: `
      <h2>Outstanding Balance Reminder</h2>
      <p>Hi ${name},</p>
      <p>You have an outstanding balance of <strong>₱${amount}</strong> that is blocking your clearance.</p>
      <p>Please settle your balance at the Finance Office to continue.</p>
    `,
  }),
}
