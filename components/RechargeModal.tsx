"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from '@/lib/LanguageContext'
import { translations } from '@/lib/translations'

const RECHARGE_OPTIONS = [10, 20, 50, 100, 300]

export function RechargeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]

  const handleRecharge = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error('Error creating payment:', error);
      alert(t.paymentCreationError);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t.recharge}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.selectRechargeAmount}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {RECHARGE_OPTIONS.map((amount) => (
            <Button key={amount} onClick={() => handleRecharge(amount)}>
              {amount} {t.currency}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}