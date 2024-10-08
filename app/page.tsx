"use client"

import { useState, useEffect } from 'react'
import { ProductManagerDashboard } from '@/components/ProductManagerDashboard'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { useLanguage } from '@/lib/LanguageContext'
import { translations } from '@/lib/translations'
import { Auth } from '@/components/Auth'
import { AccountInfo } from '@/components/AccountInfo'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <LanguageSwitch />
          {isLoggedIn && (
            <Button onClick={handleLogout}>{t.logout}</Button>
          )}
        </div>
      </div>
      {isLoggedIn ? (
        <>
          <AccountInfo />
          <ProductManagerDashboard />
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </main>
  )
}