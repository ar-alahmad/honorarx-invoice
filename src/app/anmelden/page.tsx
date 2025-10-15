'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Leva } from 'leva';

const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        // Store remember me preference in localStorage
        callbackUrl: data.rememberMe
          ? '/dashboard?remember=true'
          : '/dashboard',
      });

      if (result?.error) {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          setError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr E-Mail-Postfach.');
        } else {
          setError('Ungültige Anmeldedaten');
        }
      } else if (result?.ok) {
        // Store remember me preference
        if (data.rememberMe) {
          localStorage.setItem('honorarx-remember-me', 'true');
        } else {
          localStorage.removeItem('honorarx-remember-me');
        }

        // Check if user is authenticated
        const session = await getSession();
        if (session) {
          router.push('/dashboard');
        }
      }
    } catch {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Anmelden</h1>
          <p className='text-white/70'>Willkommen zurück bei HonorarX</p>
        </div>

        {successMessage && (
          <div className='mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg'>
            <p className='text-green-200 text-sm'>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className='mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg'>
            <p className='text-red-200 text-sm'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label className='block text-white/80 text-sm font-medium mb-2'>
              E-Mail-Adresse
            </label>
            <input
              {...register('email')}
              type='email'
              className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
              placeholder='max@beispiel.de'
            />
            {errors.email && (
              <p className='text-red-400 text-sm mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-white/80 text-sm font-medium mb-2'>
              Passwort
            </label>
            <input
              {...register('password')}
              type='password'
              className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
              placeholder='Ihr Passwort'
            />
            {errors.password && (
              <p className='text-red-400 text-sm mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <label className='flex items-center'>
              <input
                {...register('rememberMe')}
                type='checkbox'
                className='w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2'
              />
              <span className='ml-2 text-white/70 text-sm'>
                Angemeldet bleiben (24h)
              </span>
            </label>
            <a
              href='/forgot-password'
              className='text-blue-400 hover:text-blue-300 text-sm'>
              Passwort vergessen?
            </a>
          </div>

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
            {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-white/70 text-sm'>
            Noch kein Konto?{' '}
            <a
              href='/registrieren'
              className='text-blue-400 hover:text-blue-300 font-medium'>
              Hier registrieren
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnmeldenPage() {
  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen flex items-center justify-center p-4'>
        <Suspense fallback={<div className='text-white text-xl'>Laden...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <Leva hidden />
    </div>
  );
}
