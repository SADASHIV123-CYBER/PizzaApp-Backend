import serverConfig from "../config/serverConfig"

export const emailService = {
  sendEmail: async ({ to, subject, html, text }) => {
    const mailOptions = {
      from: `"Alchemy Food World" <${serverConfig.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    };
    return emailTransporter.sendMail(mailOptions);
  },

  sendOTPEmail: async ({ to, name, otp, expiresInMinutes = 10 }) => {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.4">
        <h2>Hi ${name}</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:6px">${otp}</h1>
        <p>This code expires in ${expiresInMinutes} minutes.</p>
        <p>If you didn't request this, please ignore.</p>
      </div>
    `;
    return emailService.sendEmail({ to, subject: "Verify your alchemy food world account", html });
  }
};
