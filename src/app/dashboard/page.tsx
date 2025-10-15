'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Leva } from 'leva';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/anmelden');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile();
    }
  }, [status, session, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground />
        </ErrorBoundary>
        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='text-white text-xl'>Laden...</div>
        </div>
        <Leva hidden />
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen p-4'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='flex justify-between items-center mb-8'>
            <div>
              <h1 className='text-4xl font-bold text-white mb-2'>
                Willkommen, {user.firstName}!
              </h1>
              <p className='text-white/70'>
                Ihr HonorarX Dashboard
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              Abmelden
            </Button>
          </div>

          {/* Dashboard Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {/* User Info Card */}
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
              <h3 className='text-xl font-semibold text-white mb-4'>Profil-Informationen</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-white/70 text-sm'>Name</p>
                  <p className='text-white font-medium'>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className='text-white/70 text-sm'>E-Mail</p>
                  <p className='text-white font-medium'>{user.email}</p>
                </div>
                {user.company && (
                  <div>
                    <p className='text-white/70 text-sm'>Unternehmen</p>
                    <p className='text-white font-medium'>{user.company}</p>
                  </div>
                )}
                <div>
                  <p className='text-white/70 text-sm'>E-Mail verifiziert</p>
                  <p className={`font-medium ${user.isEmailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {user.isEmailVerified ? 'Ja' : 'Nein'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
              <h3 className='text-xl font-semibold text-white mb-4'>Schnellaktionen</h3>
              <div className='space-y-3'>
                <Button
                  onClick={() => router.push('/rechnung-erstellen')}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                >
                  Neue Rechnung erstellen
                </Button>
                <Button
                  onClick={() => router.push('/rechnungen')}
                  className='w-full bg-green-600 hover:bg-green-700 text-white'
                >
                  Alle Rechnungen anzeigen
                </Button>
                <Button
                  onClick={() => router.push('/profil')}
                  className='w-full bg-purple-600 hover:bg-purple-700 text-white'
                >
                  Profil bearbeiten
                </Button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
              <h3 className='text-xl font-semibold text-white mb-4'>Statistiken</h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-white/70'>Gesamte Rechnungen</span>
                  <span className='text-white font-medium'>0</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-white/70'>Bezahlte Rechnungen</span>
                  <span className='text-white font-medium'>0</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-white/70'>Ausstehende Rechnungen</span>
                  <span className='text-white font-medium'>0</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-white/70'>Gesamtumsatz</span>
                  <span className='text-white font-medium'>€0,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-4'>Letzte Aktivitäten</h3>
            <div className='text-center py-8'>
              <p className='text-white/70'>Noch keine Aktivitäten vorhanden</p>
              <p className='text-white/50 text-sm mt-2'>
                Erstellen Sie Ihre erste Rechnung, um loszulegen!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}
