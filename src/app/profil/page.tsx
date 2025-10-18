'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { logoutManager } from '@/lib/logout-manager';
import { useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { SessionExpiryNotification } from '@/components/auth/SessionExpiryNotification';
import { Leva } from 'leva';
import {
  User,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
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
              Bitte melden Sie sich an, um Ihr Profil zu sehen.
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
        <div className='max-w-4xl mx-auto pt-28 sm:pt-32 lg:pt-36'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 lg:mb-12 gap-6'>
            <div className='flex items-center gap-4'>
              <Link
                href='/dashboard'
                className='flex items-center gap-2 text-white/70 hover:text-white transition-colors'>
                <ArrowLeft className='h-5 w-5' />
                Zurück zum Dashboard
              </Link>
            </div>
            <div className='flex items-center gap-4'>
              <button
                onClick={handleSignOut}
                className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'>
                <LogOut className='h-4 w-4' />
                Abmelden
              </button>
            </div>
          </div>

          {/* Page Title */}
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-white mb-2 flex items-center'>
              <User className='mr-3 text-blue-400' />
              Ihr Profil
            </h1>
            <p className='text-white/70 text-lg'>
              Verwalten Sie Ihre persönlichen Informationen und Kontaktdaten.
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className='mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200'>
              {message}
            </div>
          )}
          {error && (
            <div className='mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200'>
              {error}
            </div>
          )}

          {/* Profile Section */}
          <section className='mb-10'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold text-white'>
                Persönliche Informationen
              </h2>
              <div className='flex gap-3'>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm'>
                  {isEditing ? 'Abbrechen' : 'Profil bearbeiten'}
                </Button>
                {isEditing && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center'>
                    {isSaving ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <Save className='h-4 w-4 mr-2' />
                    )}
                    Änderungen speichern
                  </Button>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Basic Information */}
              <div className='bg-gray-800/50 p-6 rounded-lg border border-gray-700'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Grunddaten
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>E-Mail</p>
                    <p className='text-lg font-medium text-white'>
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Name</p>
                    {isEditing ? (
                      <div className='flex space-x-2'>
                        <input
                          type='text'
                          value={profile.firstName || ''}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                          placeholder='Vorname'
                          className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                          type='text'
                          value={profile.lastName || ''}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                          placeholder='Nachname'
                          className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      </div>
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.firstName} {profile.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>
                      E-Mail verifiziert
                    </p>
                    <p className='text-lg font-medium text-white'>
                      {profile.isEmailVerified ? (
                        <span className='flex items-center'>
                          <CheckCircle className='inline-block h-5 w-5 text-green-500 mr-2' />
                          Ja
                        </span>
                      ) : (
                        <span className='flex items-center'>
                          <AlertCircle className='inline-block h-5 w-5 text-yellow-500 mr-2' />
                          Nein
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className='bg-gray-800/50 p-6 rounded-lg border border-gray-700'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Firmeninformationen
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Firma</p>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profile.company || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, company: e.target.value })
                        }
                        placeholder='Firmenname'
                        className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.company || 'Nicht angegeben'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Telefon</p>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profile.phone || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder='Telefonnummer'
                        className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.phone || 'Nicht angegeben'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className='bg-gray-800/50 p-6 rounded-lg border border-gray-700'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Adressinformationen
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Adresse</p>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profile.address || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                        placeholder='Straße und Hausnummer'
                        className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.address || 'Nicht angegeben'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Ort, PLZ</p>
                    {isEditing ? (
                      <div className='flex space-x-2'>
                        <input
                          type='text'
                          value={profile.city || ''}
                          onChange={(e) =>
                            setProfile({ ...profile, city: e.target.value })
                          }
                          placeholder='Ort'
                          className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                          className='w-1/2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      </div>
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.city || 'Nicht angegeben'},{' '}
                        {profile.postalCode || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Land</p>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profile.country || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, country: e.target.value })
                        }
                        placeholder='Land'
                        className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.country || 'Deutschland'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className='bg-gray-800/50 p-6 rounded-lg border border-gray-700'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Steuerinformationen
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Steuer-ID</p>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profile.taxId || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, taxId: e.target.value })
                        }
                        placeholder='Steuer-ID'
                        className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.taxId || 'Nicht angegeben'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>
                      Umsatzsteuer-ID
                    </p>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profile.vatId || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, vatId: e.target.value })
                        }
                        placeholder='Umsatzsteuer-ID'
                        className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <p className='text-lg font-medium text-white'>
                        {profile.vatId || 'Nicht angegeben'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className='bg-gray-800/50 p-6 rounded-lg border border-gray-700'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Kontoinformationen
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>Registriert am</p>
                    <p className='text-lg font-medium text-white'>
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            'de-DE'
                          )
                        : 'Nicht verfügbar'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-1'>
                      Zuletzt aktualisiert
                    </p>
                    <p className='text-lg font-medium text-white'>
                      {profile.updatedAt
                        ? new Date(profile.updatedAt).toLocaleDateString(
                            'de-DE'
                          )
                        : 'Nicht verfügbar'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Leva hidden />
      <SessionExpiryNotification onLogout={handleSignOut} />
    </div>
  );
}
