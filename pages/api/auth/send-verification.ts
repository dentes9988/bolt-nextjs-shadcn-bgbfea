import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationEmail } from '@/lib/emailService';

const verificationCodes = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email, verificationCode);
    verificationCodes.set(email, verificationCode);

    setTimeout(() => {
      verificationCodes.delete(email);
    }, 10 * 60 * 1000); // 验证码 10 分钟后过期

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ message: 'Error sending verification code' });
  }
}