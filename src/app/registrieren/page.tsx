'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Leva } from 'leva';

const registerSchema = z
  .object({
    email: z.string().email('Ungültige E-Mail-Adresse'),
    password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'Vorname ist erforderlich'),
    lastName: z.string().min(1, 'Nachname ist erforderlich'),
    company: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegistrierenPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registrierung fehlgeschlagen');
      }

      // Redirect to login page with success message
      router.push(
        '/anmelden?message=Registrierung erfolgreich! Bitte melden Sie sich an.'
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-white mb-2'>
                Registrieren
              </h1>
              <p className='text-white/70'>Erstellen Sie Ihr HonorarX Konto</p>
            </div>

            {error && (
              <div className='mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg'>
                <p className='text-red-200 text-sm'>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-white/80 text-sm font-medium mb-2'>
                    Vorname *
                  </label>
                  <input
                    {...register('firstName')}
                    type='text'
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
                    placeholder='Max'
                  />
                  {errors.firstName && (
                    <p className='text-red-400 text-sm mt-1'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-white/80 text-sm font-medium mb-2'>
                    Nachname *
                  </label>
                  <input
                    {...register('lastName')}
                    type='text'
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
                    placeholder='Mustermann'
                  />
                  {errors.lastName && (
                    <p className='text-red-400 text-sm mt-1'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-white/80 text-sm font-medium mb-2'>
                  E-Mail-Adresse *
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
                  Unternehmen (optional)
                </label>
                <input
                  {...register('company')}
                  type='text'
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
                  placeholder='Mein Unternehmen GmbH'
                />
              </div>

              <div>
                <label className='block text-white/80 text-sm font-medium mb-2'>
                  Passwort *
                </label>
                <input
                  {...register('password')}
                  type='password'
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
                  placeholder='Mindestens 8 Zeichen'
                />
                {errors.password && (
                  <p className='text-red-400 text-sm mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-white/80 text-sm font-medium mb-2'>
                  Passwort bestätigen *
                </label>
                <input
                  {...register('confirmPassword')}
                  type='password'
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent'
                  placeholder='Passwort wiederholen'
                />
                {errors.confirmPassword && (
                  <p className='text-red-400 text-sm mt-1'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? 'Registrierung läuft...' : 'Konto erstellen'}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-white/70 text-sm'>
                Bereits ein Konto?{' '}
                <a
                  href='/anmelden'
                  className='text-blue-400 hover:text-blue-300 font-medium'>
                  Hier anmelden
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}
