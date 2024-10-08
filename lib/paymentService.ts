import crypto from 'crypto';

const PID = '3774'; // 您的商户ID
const KEY = 'fdHAhjUzkHKjaf41Z5oHKv1KKe5hffJs'; // 您的商户密钥

function generateSign(params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key] !== '')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('md5').update(sortedParams + KEY).digest('hex');
}

export async function createPayment(amount: number, orderId: string): Promise<string> {
  const params = {
    pid: PID,
    type: 'alipay',
    out_trade_no: orderId,
    notify_url: `${process.env.NEXT_PUBLIC_API_URL}/api/payment/notify`,
    return_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/result`,
    name: '充值',
    money: amount.toFixed(2),
    sign_type: 'MD5'
  };

  params.sign = generateSign(params);

  const response = await fetch('https://www.ezfp.cn/submit.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(params).toString()
  });

  if (!response.ok) {
    throw new Error('Failed to create payment');
  }

  return response.url;
}

export async function verifyPaymentNotification(params: Record<string, string>): boolean {
  const receivedSign = params.sign;
  const calculatedSign = generateSign(params);

  return receivedSign === calculatedSign;
}

export async function queryOrder(orderId: string): Promise<any> {
  const params = {
    act: 'order',
    pid: PID,
    key: KEY,
    out_trade_no: orderId
  };

  const response = await fetch(`https://www.ezfp.cn/api.php?${new URLSearchParams(params).toString()}`);

  if (!response.ok) {
    throw new Error('Failed to query order');
  }

  return response.json();
}