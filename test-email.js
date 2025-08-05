const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "davidadeagbo99@gmail.com",
    pass: "wctuheityueprxiy", // replace here for test
  },
  connectionTimeout: 10000, // 10s timeout
});

(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    await transporter.sendMail({
      from: '"David A." <davidadeagbo99@gmail.com>',
      to: "davidewaoluwa@gmail.com",
      subject: "Nodemailer Test",
      text: "Hello! This is a test email using Nodemailer and Gmail SMTP.",
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
})();
