import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: '19034647@qq.com',
    pass: 'mqepckubmjbdcaab'
  }
});

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: '19034647@qq.com',
    to: to,
    subject: '验证您的邮箱',
    text: `您的验证码是: ${code}`,
    html: `<p>您的验证码是: <strong>${code}</strong></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}