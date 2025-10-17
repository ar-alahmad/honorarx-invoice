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
      // CRITICAL: Set remember-me preference BEFORE calling signIn
      // so the JWT callback can read it during token creation
      if (data.rememberMe) {
        localStorage.setItem('honorarx-remember-me', 'true');
        localStorage.setItem('honorarx-session-duration', '30d');
        
        // Set the server-side httpOnly cookie BEFORE signIn
        try {
          const cookieResponse = await fetch('/api/auth/remember-me', {
            method: 'POST',
            credentials: 'include',
          });
          const cookieResult = await cookieResponse.json();
          console.log('✅ Login: Remember-me cookie API response:', cookieResult);
          console.log('✅ Login: Cookie should now be set on server');
          
          // Verify cookie was set by checking document.cookie (won't show httpOnly, but we can check response)
          console.log('✅ Login: All cookies visible to client:', document.cookie);
        } catch (error) {
          console.error('❌ Login: Failed to set remember-me cookie:', error);
        }
      } else {
        localStorage.setItem('honorarx-remember-me', 'false');
        localStorage.setItem('honorarx-session-duration', '2h');
        
        // Ensure remember-me cookie is cleared BEFORE signIn
        try {
          await fetch('/api/auth/remember-me', {
            method: 'DELETE',
            credentials: 'include',
          });
          console.log('Login: Remember-me cookie cleared BEFORE signIn');
        } catch (error) {
          console.error('Login: Failed to clear remember-me cookie:', error);
        }
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe, // Pass remember me preference
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          setError(
            'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr E-Mail-Postfach.'
          );
        } else {
          setError('Ungültige Anmeldedaten');
        }
      } else if (result?.ok) {
        // Login successful - localStorage and cookie already set above
        console.log('✅ Login: Session created successfully');
        
        // Verify session and cookie status
        try {
          const checkResponse = await fetch('/api/auth/check-session');
          const checkData = await checkResponse.json();
          console.log('📊 Login: Session verification:', checkData);
          
          if (data.rememberMe && !checkData.rememberMeCookie.exists) {
            console.error('❌ WARNING: Remember-me cookie NOT found on server!');
          } else if (data.rememberMe && checkData.rememberMeCookie.exists) {
            console.log('✅ Login: Remember-me cookie CONFIRMED on server');
          }
        } catch (error) {
          console.error('❌ Login: Failed to verify session:', error);
        }
        
        console.log('🔄 Login: Redirecting to dashboard');
        router.push('/dashboard');
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
                Angemeldet bleiben (30 Tage statt 2h)
              </span>
            </label>
            <a
              href='/forgot-password'
              className='text-blue-400 hover:text-blue-300 text-sm'>
              Passwort vergessen?
            </a>
          </div>

          <Button type='submit' disabled={isLoading} className='w-full'>
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
