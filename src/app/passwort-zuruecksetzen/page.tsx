'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Leva } from 'leva';
import { Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      setStep('reset');
    }
  }, [token]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          'Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen Link zum Zurücksetzen des Passworts gesendet.'
        );
      } else {
        setError(data.error || 'Fehler beim Senden der E-Mail');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          'Passwort erfolgreich aktualisiert! Sie können sich jetzt anmelden.'
        );
        setTimeout(() => {
          router.push('/anmelden');
        }, 2000);
      } else {
        setError(data.error || 'Fehler beim Aktualisieren des Passworts');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen flex flex-col items-center justify-center p-4'>
        <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 w-full max-w-md'>
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
              {step === 'request' ? (
                <Mail className='w-12 h-12 text-blue-400' />
              ) : (
                <Lock className='w-12 h-12 text-green-400' />
              )}
            </div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              {step === 'request'
                ? 'Passwort zurücksetzen'
                : 'Neues Passwort festlegen'}
            </h1>
            <p className='text-white/70'>
              {step === 'request'
                ? 'Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen des Passworts zu erhalten.'
                : 'Geben Sie Ihr neues Passwort ein.'}
            </p>
          </div>

          {message && (
            <div className='mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-green-400' />
              <p className='text-green-100 text-sm'>{message}</p>
            </div>
          )}

          {error && (
            <div className='mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2'>
              <AlertCircle className='w-5 h-5 text-red-400' />
              <p className='text-red-100 text-sm'>{error}</p>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-white/80 mb-2'>
                  E-Mail-Adresse
                </label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='ihre@email.de'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full'>
                {isLoading ? 'Wird gesendet...' : 'Link senden'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className='space-y-6'>
              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-sm font-medium text-white/80 mb-2'>
                  Neues Passwort
                </label>
                <input
                  type='password'
                  id='newPassword'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Mindestens 8 Zeichen'
                />
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-white/80 mb-2'>
                  Passwort bestätigen
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Passwort wiederholen'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full'>
                {isLoading ? 'Wird aktualisiert...' : 'Passwort aktualisieren'}
              </Button>
            </form>
          )}

          <div className='mt-6 text-center'>
            <button
              onClick={() => router.push('/anmelden')}
              className='text-white/70 hover:text-white text-sm transition-colors'>
              Zurück zur Anmeldung
            </button>
          </div>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense
      fallback={
        <div className='relative min-h-screen flex items-center justify-center'>
          <p className='text-white text-xl'>Laden...</p>
        </div>
      }>
      <PasswordResetForm />
    </Suspense>
  );
}
