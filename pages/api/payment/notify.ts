import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPaymentNotification } from '@/lib/paymentService';
import { getUserById, updateUser } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const params = req.query as Record<string, string>;

  if (await verifyPaymentNotification(params)) {
    const [userId] = params.out_trade_no.split('_');
    const user = getUserById(parseInt(userId));

    if (user) {
      const orderIndex = user.orders.findIndex(order => order.orderId === params.out_trade_no);
      if (orderIndex !== -1) {
        user.orders[orderIndex].status = 'completed';
        user.virtualBalance += parseFloat(params.money) * 100; // 转换为分
        updateUser(user);
      }
    }

    res.status(200).send('success');
  } else {
    res.status(400).send('fail');
  }
}