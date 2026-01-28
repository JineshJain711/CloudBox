transporter = require("../config/nodemail")

exports.sendMail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"Avengers Admin" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Unable to send email");
  }
};