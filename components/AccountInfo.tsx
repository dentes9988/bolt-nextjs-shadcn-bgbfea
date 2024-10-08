"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from '@/lib/LanguageContext'
import { translations } from '@/lib/translations'
import { RechargeModal } from './RechargeModal'

export function AccountInfo() {
  const [balance, setBalance] = useState(0);
  const [freeRequests, setFreeRequests] = useState(0);
  const [orders, setOrders] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/account/balance', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setBalance(data.balance);
      setFreeRequests(data.freeRequestsRemaining);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching account info:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.accountInfo}</CardTitle>
        <CardDescription>{t.accountInfoDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{t.virtualBalance}: ¥{(balance / 100).toFixed(2)}</p>
        <p>{t.freeRequestsRemaining}: {freeRequests}</p>
        <div className="mt-4">
          <RechargeModal />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">{t.transactionHistory}</h3>
          <ul>
            {orders.map((order, index) => (
              <li key={index}>
                {order.orderId}: ¥{(order.amount / 100).toFixed(2)} - {order.status}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}