<<<<<<< HEAD
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
=======
transporter = require("../config/nodemail")

exports.sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"CloudBox Admin" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    });

    console.log("Email sent:", info.response);

  } catch (error) {
    console.error("FULL EMAIL ERROR:", error); 
    throw new Error("Unable to send email");
  }
};
>>>>>>> 8984496cca173c7b30c44b04d430f7d0e6aa774b
