const emailTemplate = ({ name, heading, message, otp, link, footer }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${name},</h2>
      <h3>${heading}</h3>
      <p>${message}</p>

      ${otp ? `<h1 style="letter-spacing: 5px;">${otp}</h1>` : ""}

      ${link ? `<a href="${link}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Now</a>` : ""}

      <p style="margin-top:20px; color:gray;">${footer || "This message is auto-generated. Please do not reply."}</p>
    </div>
  `;
};

export default emailTemplate
