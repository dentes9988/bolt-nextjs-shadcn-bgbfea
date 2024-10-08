import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, getUserById } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.user;
    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      balance: user.virtualBalance,
      freeRequestsRemaining: Math.max(0, 1 - user.requestCount)
    });
  });
}