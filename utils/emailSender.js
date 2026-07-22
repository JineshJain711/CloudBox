const nodemailer = require("nodemailer");

exports.sendMail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS || process.env.BREVO_API_KEY,
      },
    });

    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME || 'CloudBox Admin'}" <${process.env.SENDER_EMAIL || process.env.MAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || text || "",
    });

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw new Error("Email sending failed");
  }
};
