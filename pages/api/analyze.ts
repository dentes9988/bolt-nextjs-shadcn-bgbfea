import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, getUserById, updateUser } from '@/lib/auth';
import { analyzeWithAI } from '@/lib/zhipuai-service';
import { calculateCost, ModelName } from '@/lib/modelPricing';

const FREE_DAILY_REQUESTS = 1;

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

    const today = new Date().toDateString();
    const isFreeRequest = user.lastFreeRequest !== today && user.requestCount < FREE_DAILY_REQUESTS;

    if (isFreeRequest) {
      user.lastFreeRequest = today;
      user.requestCount += 1;
    } else if (user.virtualBalance <= 0) {
      return res.status(402).json({ message: 'Insufficient balance' });
    }

    try {
      const { prompt, model = 'GLM-4-AllTools' } = req.body;
      const { result, tokenUsage } = await analyzeWithAI(prompt, model as ModelName);

      const costInYuan = calculateCost(model as ModelName, tokenUsage);
      const costInCents = Math.ceil(costInYuan * 100);

      if (!isFreeRequest) {
        user.virtualBalance -= costInCents;
      }

      // 添加新的请求记录
      if (!user.requests) {
        user.requests = [];
      }
      user.requests.push({
        date: new Date().toISOString(),
        prompt,
        tokenUsage,
        cost: costInCents,
        isFree: isFreeRequest
      });

      updateUser(user);

      res.status(200).json({ 
        result,
        isFreeRequest,
        costInYuan,
        costInCents,
        tokenUsage,
        remainingBalance: user.virtualBalance
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      res.status(500).json({ message: 'An error occurred during analysis' });
    }
  });
}