'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Leva } from 'leva';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

function EmailVerificationForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('E-Mail-Adresse erfolgreich bestätigt!');
        setIsVerified(true);
        setTimeout(() => {
          router.push('/anmelden?message=E-Mail-Adresse erfolgreich bestätigt. Sie können sich jetzt anmelden.');
        }, 2000);
      } else {
        setError(data.error || 'Fehler bei der E-Mail-Bestätigung');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }

    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Neuer Verifizierungscode wurde an Ihre E-Mail-Adresse gesendet.');
      } else {
        setError(data.error || 'Fehler beim Senden des Codes');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground />
        </ErrorBoundary>

        <div className='relative z-10 min-h-screen flex flex-col items-center justify-center p-4'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-md w-full'>
            <CheckCircle className='w-16 h-16 text-green-400 mx-auto mb-4' />
            <h1 className='text-3xl font-bold text-white mb-6'>E-Mail bestätigt!</h1>
            <p className='text-white/70 mb-6'>
              Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie werden zur Anmeldeseite weitergeleitet...
            </p>
            <div className='w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto'></div>
          </div>
        </div>

        <Leva hidden />
      </div>
    );
  }

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen flex flex-col items-center justify-center p-4'>
        <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-md w-full'>
          <Mail className='w-16 h-16 text-blue-400 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-white mb-6'>E-Mail bestätigen</h1>
          
          <p className='text-white/70 text-sm mb-6'>
            Wir haben einen 6-stelligen Verifizierungscode an Ihre E-Mail-Adresse gesendet. 
            Geben Sie den Code unten ein, um Ihr Konto zu aktivieren.
          </p>

          {message && (
            <div className='flex items-center justify-center bg-green-500/20 text-green-300 p-3 rounded-lg mb-4'>
              <CheckCircle className='h-5 w-5 mr-2' />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className='flex items-center justify-center bg-red-500/20 text-red-300 p-3 rounded-lg mb-4'>
              <AlertCircle className='h-5 w-5 mr-2' />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-white/80 text-sm font-medium mb-2'>
                E-Mail-Adresse
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
                placeholder='max@beispiel.de'
              />
            </div>

            <div>
              <label htmlFor='code' className='block text-white/80 text-sm font-medium mb-2'>
                Verifizierungscode
              </label>
              <input
                type='text'
                id='code'
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-center text-2xl font-mono tracking-widest'
                placeholder='123456'
              />
            </div>

            <Button
              type='submit'
              disabled={isLoading || code.length !== 6}
              className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Wird bestätigt...' : 'E-Mail bestätigen'}
            </Button>
          </form>

          <div className='mt-6 space-y-3'>
            <button
              onClick={handleResendCode}
              disabled={isResending || !email}
              className='w-full py-2 text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isResending ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  Wird gesendet...
                </>
              ) : (
                'Code erneut senden'
              )}
            </button>

            <button
              onClick={() => router.push('/anmelden')}
              className='w-full py-2 text-white/60 hover:text-white/80 text-sm'
            >
              Zurück zur Anmeldung
            </button>
          </div>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className='relative min-h-screen flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin'></div>
      </div>
    }>
      <EmailVerificationForm />
    </Suspense>
  );
}
