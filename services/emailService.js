
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000, // Increase connection timeout (10 seconds)
  greetingTimeout: 30000,   // Increase greeting timeout (30 seconds)
});

// General email sending function
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send OTP email for password reset
const sendOtpEmail = async (email, otp) => {
  try {
    const senderEmailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #007bff; color: #fff; padding: 20px; border-bottom: 2px solid #0056b3;">
        <h2 style="text-align: center; margin: 0;">Password Reset Request</h2>
      </div>
      <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 20px auto; max-width: 600px;">
        <p>We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
        
        <h3 style="color: #007bff;">Your OTP: <strong>${otp}</strong></h3>
        
        <p style="color: #555;">This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
        
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>Support Team</strong></p>
      </div>
      <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
        <p>© 2025 Your Company. All rights reserved.</p>
      </div>
    </div>
  `;
    // Send OTP email to the user
    await sendEmail({
      to: email,
      subject: "Password Reset Request - OTP",
      html: senderEmailContent,
    });
  } catch (error) {
    console.error("Error in sending OTP email:", error);
    throw error;
  }
};

module.exports = { sendOtpEmail };
