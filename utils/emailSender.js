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
    console.error("FULL EMAIL ERROR:", error); // 👈 important
    throw new Error("Unable to send email");
  }
};
