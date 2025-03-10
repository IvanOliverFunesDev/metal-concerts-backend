import nodemailer from 'nodemailer';
import config from '../config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.USER,
    pass: config.email.PASS,
  },
});

export const sendApprovalEmail = async (email, bandName) => {
  const mailOptions = {
    from: `"Metal Souls" <${config.email.USER}>`,
    to: email,
    subject: '✅ Your Band Has Been Approved!',
    html: `
      <h2>Congratulations, ${bandName}!</h2>
      <p>Your band has been successfully approved by our admins.</p>
      <p>You can now log in and start managing your concerts.</p>
      <a href="${config.app.FRONTEND_URL}/login" style="color: blue; text-decoration: underline;">Login Now</a>
      <p>Thanks for joining Metal Souls 🤘🔥</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending approval email: ${error.message}`);
  }
};

export const sendRejectionEmail = async (email, bandName) => {
  const mailOptions = {
    from: `"Metal Souls" <${config.email.USER}>`,
    to: email,
    subject: '❌ Your Band Registration Was Rejected',
    html: `
      <h2>We're sorry, ${bandName}.</h2>
      <p>Unfortunately, your band registration request was not approved.</p>
      <p>If you believe this was a mistake, you can contact support for further assistance.</p>
      <p>Best regards,</p>
      <p>Metal Souls Team 🤘</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending rejection email: ${error.message}`);
  }
};

export const sendResetCodeEmail = async (email, username, resetCode) => {
  const mailOptions = {
    from: `"Metal Souls" <${config.email.USER}>`,
    to: email,
    subject: '🔑 Password Reset Code',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi <b>${username}</b>,</p>
      <p>We've received a request to reset your password.</p>
      <p>Your verification code is: <b style="font-size: 18px; color: red;">${resetCode}</b></p>
      <p>This code is valid for <b>10 minutes</b>.</p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p>Stay secure,</p>
      <p><b>Metal Souls Team 🤘</b></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending password reset email: ${error.message}`);
  }
};
