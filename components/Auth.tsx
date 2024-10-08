"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from '@/lib/LanguageContext'
import { translations } from '@/lib/translations'

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleSendVerification = async () => {
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setIsVerificationSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { username, password }
      : { username, email, password, verificationCode };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? t.login : t.register}</CardTitle>
        <CardDescription>{isLogin ? t.loginDescription : t.registerDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder={t.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <Input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <Input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <>
              <Input
                type="text"
                placeholder={t.verificationCode}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <Button type="button" onClick={handleSendVerification} disabled={isVerificationSent}>
                {isVerificationSent ? t.verificationSent : t.sendVerification}
              </Button>
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">{isLogin ? t.login : t.register}</Button>
        </form>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="mt-4">
          {isLogin ? t.needAccount : t.haveAccount}
        </Button>
      </CardContent>
    </Card>
  );
}