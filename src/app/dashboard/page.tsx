'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { logoutManager } from '@/lib/logout-manager';
import { useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { SessionManager } from '@/components/auth/SessionManager';
import { SessionExpiryNotification } from '@/components/auth/SessionExpiryNotification';
import { Leva } from 'leva';
import {
  User,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Euro,
  BarChart3,
  LogOut,
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

type ActiveTab = 'overview' | 'profile';

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        setError('Fehler beim Laden der Daten');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Netzwerkfehler beim Laden der Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        await fetchUserData();
        setIsEditing(false);
        setMessage('Profil erfolgreich aktualisiert!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Fehler beim Aktualisieren des Profils');
      }
    } catch {
      setError('Netzwerkfehler beim Aktualisieren des Profils');
    } finally {
      setIsSaving(false);
    }
  };

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
            {message && (
              <div className='p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm'>
                {message}
              </div>
            )}
            {error && (
              <div className='p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm'>
                {error}
              </div>
            )}
            <div className='flex items-center gap-4'>
              <button
                onClick={handleSignOut}
                className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'>
                <LogOut className='h-4 w-4' />
                Abmelden
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='flex gap-2 mb-8 sm:mb-10'>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}>
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}>
              Profil bearbeiten
            </button>
          </div>

          {activeTab === 'overview' && (
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
          )}

          {activeTab === 'profile' && (
            <section className='mb-10'>
              <h2 className='text-2xl font-semibold mb-5 flex items-center'>
                <User className='mr-3 text-blue-300' /> Ihr Profil
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className='ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm'>
                  {isEditing ? 'Abbrechen' : 'Profil bearbeiten'}
                </Button>
                {isEditing && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className='ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center'>
                    {isSaving ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <Save className='h-4 w-4 mr-2' />
                    )}
                    Änderungen speichern
                  </Button>
                )}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>E-Mail</p>
                  <p className='text-lg font-medium'>{profile.email}</p>
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Name</p>
                  {isEditing ? (
                    <div className='flex space-x-2'>
                      <input
                        type='text'
                        value={profile.firstName || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                        placeholder='Vorname'
                        className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                      />
                      <input
                        type='text'
                        value={profile.lastName || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                        placeholder='Nachname'
                        className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                      />
                    </div>
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.firstName} {profile.lastName}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Firma</p>
                  {isEditing ? (
                    <input
                      type='text'
                      value={profile.company || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                      placeholder='Firmenname'
                      className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                    />
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.company || 'N/A'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Telefon</p>
                  {isEditing ? (
                    <input
                      type='text'
                      value={profile.phone || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      placeholder='Telefonnummer'
                      className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                    />
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.phone || 'N/A'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Adresse</p>
                  {isEditing ? (
                    <input
                      type='text'
                      value={profile.address || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      placeholder='Straße und Hausnummer'
                      className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                    />
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.address || 'N/A'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Ort, PLZ</p>
                  {isEditing ? (
                    <div className='flex space-x-2'>
                      <input
                        type='text'
                        value={profile.city || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, city: e.target.value })
                        }
                        placeholder='Ort'
                        className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                      />
                      <input
                        type='text'
                        value={profile.postalCode || ''}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder='Postleitzahl'
                        className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                      />
                    </div>
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.city || 'N/A'}, {profile.postalCode || 'N/A'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Land</p>
                  {isEditing ? (
                    <input
                      type='text'
                      value={profile.country || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      placeholder='Land'
                      className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                    />
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.country || 'Deutschland'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Steuer-ID</p>
                  {isEditing ? (
                    <input
                      type='text'
                      value={profile.taxId || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, taxId: e.target.value })
                      }
                      placeholder='Steuer-ID'
                      className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                    />
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.taxId || 'N/A'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Umsatzsteuer-ID</p>
                  {isEditing ? (
                    <input
                      type='text'
                      value={profile.vatId || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, vatId: e.target.value })
                      }
                      placeholder='Umsatzsteuer-ID'
                      className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                    />
                  ) : (
                    <p className='text-lg font-medium'>
                      {profile.vatId || 'N/A'}
                    </p>
                  )}
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>E-Mail verifiziert</p>
                  <p className='text-lg font-medium'>
                    {profile.isEmailVerified ? (
                      <CheckCircle className='inline-block h-5 w-5 text-green-500 mr-2' />
                    ) : (
                      <AlertCircle className='inline-block h-5 w-5 text-yellow-500 mr-2' />
                    )}
                    {profile.isEmailVerified ? 'Ja' : 'Nein'}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Registriert am</p>
                  <p className='text-lg font-medium'>
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className='bg-gray-800/50 p-4 rounded-md border border-gray-700'>
                  <p className='text-sm text-gray-400'>Zuletzt aktualisiert</p>
                  <p className='text-lg font-medium'>
                    {profile.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <Leva hidden />
      <SessionManager />
      <SessionExpiryNotification onLogout={handleSignOut} />
    </div>
  );
}
