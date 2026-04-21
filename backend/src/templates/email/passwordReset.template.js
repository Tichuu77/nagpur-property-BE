export const passwordResetTemplate = (to, resetLink) => ({
  subject: 'Password Reset Request',
  html: `
    <p>Hello ${to},</p>
    <h3>Password Reset Request</h3>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
  `,
});