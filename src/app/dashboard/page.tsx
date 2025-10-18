'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { logoutManager } from '@/lib/logout-manager';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { SessionExpiryNotification } from '@/components/auth/SessionExpiryNotification';
import { Leva } from 'leva';
import {
  AlertCircle,
  Loader2,
  Euro,
  BarChart3,
  LogOut,
  User,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  taxId?: string;
  vatId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  overdueInvoices: number;
}

// Removed ActiveTab type as we no longer have tabs

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    overdueInvoices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/anmelden');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session, router]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users/profile');

      if (response.ok) {
        const data = await response.json();
        if (data.data?.user) {
          setProfile(data.data.user);
        }
        // Mock stats for now
        setStats({
          totalInvoices: 12,
          paidInvoices: 8,
          pendingInvoices: 3,
          totalRevenue: 15420.5,
          thisMonthRevenue: 3200.0,
          overdueInvoices: 1,
        });
      } else {
        console.error('Error loading user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed handleSave function as profile editing is now on separate page

  const handleSignOut = async () => {
    await logoutManager.logout('/');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground />
        </ErrorBoundary>
        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-8 w-8 animate-spin text-white' />
            <span className='text-white text-2xl font-medium'>Laden...</span>
          </div>
        </div>
        <Leva hidden />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground />
        </ErrorBoundary>
        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <AlertCircle className='h-16 w-16 text-red-400 mx-auto mb-6' />
            <h1 className='text-3xl font-bold text-white mb-4'>
              Nicht angemeldet
            </h1>
            <p className='text-white/70 mb-8 text-lg'>
              Bitte melden Sie sich an, um Ihr Dashboard zu sehen.
            </p>
            <Button onClick={() => router.push('/anmelden')} size='default'>
              Zur Anmeldung
            </Button>
          </div>
        </div>
        <Leva hidden />
      </div>
    );
  }

  if (status === 'authenticated' && !profile && !isLoading) {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground />
        </ErrorBoundary>
        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <AlertCircle className='h-16 w-16 text-yellow-400 mx-auto mb-6' />
            <h1 className='text-3xl font-bold text-white mb-4'>
              Profil nicht gefunden
            </h1>
            <p className='text-white/70 mb-8 text-lg'>
              Ihr Benutzerprofil konnte nicht geladen werden.
            </p>
            <Button onClick={() => fetchUserData()} size='default'>
              Erneut versuchen
            </Button>
          </div>
        </div>
        <Leva hidden />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground />
        </ErrorBoundary>
        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-8 w-8 animate-spin text-white' />
            <span className='text-white text-2xl font-medium'>
              Lade Profil...
            </span>
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

      <div className='relative z-10 min-h-screen p-4 sm:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto pt-28 sm:pt-32 lg:pt-36'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 lg:mb-12 gap-6'>
            <div>
              <h1 className='text-4xl font-bold text-white mb-2'>
                Willkommen zurück,{' '}
                <span className='text-blue-400'>
                  {profile.firstName || profile.email}!
                </span>
              </h1>
              <p className='text-white/70 text-lg'>
                Hier ist Ihr Dashboard. Verwalten Sie Ihre Rechnungen und Ihr
                Profil.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='/profil'
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md'>
                <User className='h-4 w-4' />
                Profil bearbeiten
              </Link>
              <button
                onClick={handleSignOut}
                className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'>
                <LogOut className='h-4 w-4' />
                Abmelden
              </button>
            </div>
          </div>

          {/* Dashboard Overview */}
          <section className='mb-10'>
            <h2 className='text-2xl font-semibold mb-5 flex items-center'>
              <BarChart3 className='mr-3 text-blue-300' /> Ihre Statistiken
            </h2>
            {stats ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700'>
                  <p className='text-sm text-gray-400 mb-2'>
                    Gesamtzahl der Rechnungen
                  </p>
                  <p className='text-4xl font-bold text-blue-400'>
                    {stats.totalInvoices}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700'>
                  <p className='text-sm text-gray-400 mb-2'>
                    Bezahlte Rechnungen
                  </p>
                  <p className='text-4xl font-bold text-green-400'>
                    {stats.paidInvoices}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700'>
                  <p className='text-sm text-gray-400 mb-2'>
                    Ausstehende Rechnungen
                  </p>
                  <p className='text-4xl font-bold text-yellow-400'>
                    {stats.pendingInvoices}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700'>
                  <p className='text-sm text-gray-400 mb-2'>Gesamtumsatz</p>
                  <p className='text-4xl font-bold text-purple-400'>
                    <Euro className='inline-block h-8 w-8 mr-2' />
                    {stats.totalRevenue.toLocaleString('de-DE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700'>
                  <p className='text-sm text-gray-400 mb-2'>
                    Umsatz diesen Monat
                  </p>
                  <p className='text-4xl font-bold text-cyan-400'>
                    <Euro className='inline-block h-8 w-8 mr-2' />
                    {stats.thisMonthRevenue.toLocaleString('de-DE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700'>
                  <p className='text-sm text-gray-400 mb-2'>
                    Überfällige Rechnungen
                  </p>
                  <p className='text-4xl font-bold text-red-400'>
                    {stats.overdueInvoices}
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-gray-400'>
                Keine Rechnungsstatistiken verfügbar.
              </p>
            )}
          </section>
        </div>
      </div>

      <Leva hidden />
      <SessionExpiryNotification onLogout={handleSignOut} />
    </div>
  );
}
