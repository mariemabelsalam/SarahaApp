import nodemailer from "nodemailer";

export async function sendEmail({
  from = process.env.APP_USER,
  to,
  subject,
  text,
  html,
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: `"SARAHA APP" <${from}>`,
    to,
    subject,
    text,
    html,
  });
}
