import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, getUserById, updateUser } from '@/lib/auth';
import { createPayment } from '@/lib/paymentService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.user;
    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
      const orderId = `${userId}_${Date.now()}`;
      const paymentUrl = await createPayment(amount, orderId);

      // 保存订单信息到用户记录中
      if (!user.orders) {
        user.orders = [];
      }
      user.orders.push({
        orderId,
        amount,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      updateUser(user);

      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Failed to create payment' });
    }
  });
}