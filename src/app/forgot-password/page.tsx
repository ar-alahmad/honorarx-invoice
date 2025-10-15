'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Leva } from 'leva';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
        setEmail('');
      } else {
        setError(data.error || 'Fehler beim Senden der E-Mail');
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
        <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-md w-full'>
          <h1 className='text-3xl font-bold text-white mb-6'>
            Passwort vergessen
          </h1>

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

          <form onSubmit={handleSubmit} className='space-y-4'>
            <p className='text-white/70 text-sm mb-4'>
              Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen
              des Passworts zu erhalten.
            </p>
            <div>
              <label htmlFor='email' className='sr-only'>
                E-Mail-Adresse
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70' />
                <input
                  type='email'
                  id='email'
                  placeholder='E-Mail-Adresse'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? 'Senden...' : 'Link senden'}
            </Button>
          </form>

          <button
            onClick={() => router.push('/anmelden')}
            className='mt-6 text-blue-400 hover:text-blue-300 text-sm'>
            Zurück zur Anmeldung
          </button>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}
