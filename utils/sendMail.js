
import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"BTPL" <${process.env.MAIL_USER}>`,   // 👈 shows BTPL in inbox
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("Mail error:", err.message);
  }
};
