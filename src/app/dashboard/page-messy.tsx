'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { secureLogout } from '@/lib/logout-manager';
import { useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { SessionManager } from '@/components/auth/SessionManager';
import { SessionExpiryNotification } from '@/components/auth/SessionExpiryNotification';
import { Leva } from 'leva';
import {
  User,
  Mail,
  Building2,
  MapPin,
  Save,
  Edit3,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Clock,
  Euro,
  Calendar,
  Phone,
  Globe,
  BarChart3,
  Activity,
  Bell,
  LogOut,
  Zap,
  Target,
  Award,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  taxId: string;
  vatId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
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

  // Test if secureLogout is available
  console.log(
    'Dashboard: secureLogout function available:',
    typeof secureLogout
  );
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
  const abmeldenButtonRef = useRef<HTMLButtonElement>(null);
  const testLogoutButtonRef = useRef<HTMLButtonElement>(null);

  // Debug log after state declarations
  console.log(
    'Dashboard: Component rendered, profile:',
    !!profile,
    'isLoading:',
    isLoading
  );

  // Add direct event listeners to buttons when they mount
  useEffect(() => {
    const addDirectEventListeners = () => {
      if (abmeldenButtonRef.current) {
        console.log(
          'Dashboard: Adding direct event listener to Abmelden button'
        );
        const handleDirectClick = (e: Event) => {
          console.log('Dashboard: DIRECT CLICK on Abmelden button!', e);
          e.preventDefault();
          e.stopPropagation();
          handleSignOut();
        };
        abmeldenButtonRef.current.addEventListener(
          'click',
          handleDirectClick,
          true
        );

        return () => {
          if (abmeldenButtonRef.current) {
            abmeldenButtonRef.current.removeEventListener(
              'click',
              handleDirectClick,
              true
            );
          }
        };
      }
    };

    const cleanup = addDirectEventListeners();
    return cleanup;
  }, [profile, isLoading]);

  useEffect(() => {
    const addDirectEventListeners = () => {
      if (testLogoutButtonRef.current) {
        console.log(
          'Dashboard: Adding direct event listener to Test Logout button'
        );
        const handleDirectClick = (e: Event) => {
          console.log('Dashboard: DIRECT CLICK on Test Logout button!', e);
          e.preventDefault();
          e.stopPropagation();
          secureLogout('/')
            .then(() => {
              console.log('Dashboard: secureLogout completed');
            })
            .catch((error) => {
              console.error('Dashboard: secureLogout error:', error);
            });
        };
        testLogoutButtonRef.current.addEventListener(
          'click',
          handleDirectClick,
          true
        );

        return () => {
          if (testLogoutButtonRef.current) {
            testLogoutButtonRef.current.removeEventListener(
              'click',
              handleDirectClick,
              true
            );
          }
        };
      }
    };

    const cleanup = addDirectEventListeners();
    return cleanup;
  }, [profile, isLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    console.log(
      'Dashboard: Status:',
      status,
      'Session:',
      !!session,
      'User ID:',
      session?.user?.id
    );

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
      console.log('Dashboard: Fetching user data...');
      setIsLoading(true);
      const response = await fetch('/api/users/profile');
      console.log('Dashboard: Profile response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard: Profile data received:', data);
        console.log('Dashboard: User data:', data.data?.user);
        console.log('Dashboard: User data type:', typeof data.data?.user);
        console.log(
          'Dashboard: User data keys:',
          data.data?.user ? Object.keys(data.data.user) : 'No user data'
        );

        if (data.data?.user) {
          setProfile(data.data.user);
          console.log('Dashboard: Profile set successfully');
        } else {
          console.error('Dashboard: No user data found in response');
        }
        // Fetch actual stats from invoices API (placeholder for future implementation)
        // For now, using mock data
        setStats({
          totalInvoices: 12,
          paidInvoices: 8,
          pendingInvoices: 3,
          totalRevenue: 15420.5,
          thisMonthRevenue: 3200.0,
          overdueInvoices: 1,
        });
      } else {
        console.error('Failed to fetch user profile:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
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
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          company: profile.company,
          taxId: profile.taxId,
          vatId: profile.vatId,
          address: profile.address,
          city: profile.city,
          postalCode: profile.postalCode,
          country: profile.country,
          phone: profile.phone,
        }),
      });

      if (response.ok) {
        setMessage('Profil erfolgreich aktualisiert!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Fehler beim Speichern des Profils');
      }
    } catch {
      setError('Netzwerkfehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleSignOut = async () => {
    await secureLogout('/');
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

  // Show loading if profile is not loaded yet but user is authenticated
  if (status === 'authenticated' && !profile && !isLoading) {
    console.log(
      'Dashboard: Showing profile not found - Status:',
      status,
      'Profile:',
      profile,
      'IsLoading:',
      isLoading
    );
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

  // Ensure profile exists before rendering dashboard
  if (!profile) {
    console.log(
      'Dashboard: Profile is null/undefined, showing loading spinner'
    );
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
            <div className='flex items-center gap-4 sm:gap-6'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10'>
                <User className='h-8 w-8 sm:h-10 sm:w-10 text-primary' />
              </div>
              <div>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight'>
                  Willkommen zurück, {profile.firstName}!
                </h1>
                <p className='text-white/70 text-base sm:text-lg'>
                  Hier ist Ihr HonorarX Dashboard
                </p>
                {profile.isEmailVerified && (
                  <div className='flex items-center gap-2 mt-2'>
                    <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 text-green-400' />
                    <span className='text-green-400 text-xs sm:text-sm font-medium'>
                      E-Mail verifiziert
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div
              className='flex items-center gap-4'
              style={{ position: 'relative', zIndex: 10000 }}>
              {console.log('Dashboard: Rendering logout buttons section')}
              {console.log(
                'Dashboard: Container div rendered with high z-index'
              )}
              <button
                ref={abmeldenButtonRef}
                onMouseDown={() =>
                  console.log('Dashboard: Abmelden button mouse down')
                }
                onMouseUp={() =>
                  console.log('Dashboard: Abmelden button mouse up')
                }
                onMouseEnter={() => {
                  console.log('Dashboard: Abmelden button mouse enter');
                  console.log(
                    'Dashboard: Abmelden button ref:',
                    abmeldenButtonRef.current
                  );
                  console.log(
                    'Dashboard: Abmelden button in DOM:',
                    !!abmeldenButtonRef.current
                  );
                }}
                onMouseLeave={() =>
                  console.log('Dashboard: Abmelden button mouse leave')
                }
                onClick={(e) => {
                  console.log('Dashboard: Abmelden button onClick triggered');
                  console.log('Dashboard: Abmelden button element:', e.target);
                  handleSignOut();
                }}
                style={{
                  pointerEvents: 'auto',
                  zIndex: 9999,
                  position: 'relative',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '2px solid #3b82f6',
                  color: '#3b82f6',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                className='flex items-center gap-2'>
                <LogOut className='h-4 w-4' />
                Abmelden
              </button>

              {/* Debug: Test Logout Button */}
              <button
                ref={testLogoutButtonRef}
                onMouseDown={() =>
                  console.log('Dashboard: Test logout button mouse down')
                }
                onMouseUp={() =>
                  console.log('Dashboard: Test logout button mouse up')
                }
                onMouseEnter={() => {
                  console.log('Dashboard: Test logout button mouse enter');
                  console.log(
                    'Dashboard: Test logout button ref:',
                    testLogoutButtonRef.current
                  );
                  console.log(
                    'Dashboard: Test logout button in DOM:',
                    !!testLogoutButtonRef.current
                  );
                }}
                onMouseLeave={() =>
                  console.log('Dashboard: Test logout button mouse leave')
                }
                onClick={(e) => {
                  console.log(
                    'Dashboard: Test logout button onClick triggered'
                  );
                  console.log(
                    'Dashboard: Test logout button element:',
                    e.target
                  );
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Dashboard: Test logout button clicked');
                  console.log('Dashboard: About to call secureLogout');
                  secureLogout('/')
                    .then(() => {
                      console.log('Dashboard: secureLogout completed');
                    })
                    .catch((error) => {
                      console.error('Dashboard: secureLogout error:', error);
                    });
                }}
                onFocus={() =>
                  console.log('Dashboard: Test logout button focused')
                }
                onBlur={() =>
                  console.log('Dashboard: Test logout button blurred')
                }
                style={{
                  pointerEvents: 'auto',
                  zIndex: 9999,
                  position: 'relative',
                  backgroundColor: '#ea580c',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: 'none',
                }}
                className='text-sm'>
                Test Logout
              </button>

              {/* Debug: Simple Test Button */}
              {console.log('Dashboard: About to render simple test button')}
              <button
                onClick={() =>
                  console.log('Dashboard: Simple test button clicked')
                }
                className='bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm ml-2'>
                Simple Test
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='flex gap-2 mb-8 sm:mb-10'>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}>
              <BarChart3 className='h-4 w-4 sm:h-5 sm:w-5' />
              <span className='hidden sm:inline'>Übersicht</span>
              <span className='sm:hidden'>Stats</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
                activeTab === 'profile'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}>
              <User className='h-4 w-4 sm:h-5 sm:w-5' />
              Profil
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className='flex items-center gap-3 bg-green-500/20 text-green-300 p-4 rounded-xl mb-6 border border-green-500/30'>
              <CheckCircle className='h-6 w-6' />
              <span className='font-medium'>{message}</span>
            </div>
          )}

          {error && (
            <div className='flex items-center gap-3 bg-red-500/20 text-red-300 p-4 rounded-xl mb-6 border border-red-500/30'>
              <AlertCircle className='h-6 w-6' />
              <span className='font-medium'>{error}</span>
            </div>
          )}

          {/* Main Content */}
          {activeTab === 'overview' ? (
            <div className='space-y-8'>
              {/* Stats Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300'>
                      <FileText className='h-5 w-5 sm:h-6 sm:w-6 text-blue-400' />
                    </div>
                    <span className='text-xl sm:text-2xl font-bold text-white'>
                      {stats.totalInvoices}
                    </span>
                  </div>
                  <h3 className='text-white/70 text-sm font-medium mb-1'>
                    Gesamte Rechnungen
                  </h3>
                  <p className='text-white/50 text-xs'>
                    Alle erstellten Rechnungen
                  </p>
                </div>

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300'>
                      <CheckCircle className='h-5 w-5 sm:h-6 sm:w-6 text-green-400' />
                    </div>
                    <span className='text-xl sm:text-2xl font-bold text-white'>
                      {stats.paidInvoices}
                    </span>
                  </div>
                  <h3 className='text-white/70 text-sm font-medium mb-1'>
                    Bezahlte Rechnungen
                  </h3>
                  <p className='text-white/50 text-xs'>
                    Erfolgreich abgeschlossen
                  </p>
                </div>

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors duration-300'>
                      <Clock className='h-5 w-5 sm:h-6 sm:w-6 text-yellow-400' />
                    </div>
                    <span className='text-xl sm:text-2xl font-bold text-white'>
                      {stats.pendingInvoices}
                    </span>
                  </div>
                  <h3 className='text-white/70 text-sm font-medium mb-1'>
                    Ausstehende Rechnungen
                  </h3>
                  <p className='text-white/50 text-xs'>Warten auf Zahlung</p>
                </div>

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300'>
                      <Euro className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
                    </div>
                    <span className='text-xl sm:text-2xl font-bold text-white'>
                      €
                      {stats.totalRevenue.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <h3 className='text-white/70 text-sm font-medium mb-1'>
                    Gesamtumsatz
                  </h3>
                  <p className='text-white/50 text-xs'>Alle Zeiten</p>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
                {/* Quick Actions */}
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center'>
                      <Zap className='h-5 w-5 text-primary' />
                    </div>
                    <h3 className='text-lg sm:text-xl font-semibold text-white'>
                      Schnellaktionen
                    </h3>
                  </div>
                  <div className='space-y-3 sm:space-y-4'>
                    <Button
                      onClick={() => router.push('/rechnung-erstellen')}
                      className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 sm:h-14 text-base sm:text-lg font-medium shadow-lg shadow-blue-600/25'>
                      <Plus className='h-4 w-4 sm:h-5 sm:w-5' />
                      <span className='hidden sm:inline'>
                        Neue Rechnung erstellen
                      </span>
                      <span className='sm:hidden'>Neue Rechnung</span>
                    </Button>
                    <Button
                      onClick={() => router.push('/rechnungen')}
                      variant='outline'
                      className='w-full h-12 sm:h-14 text-base sm:text-lg font-medium'>
                      <Eye className='h-4 w-4 sm:h-5 sm:w-5' />
                      <span className='hidden sm:inline'>
                        Alle Rechnungen anzeigen
                      </span>
                      <span className='sm:hidden'>Rechnungen</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('profile')}
                      variant='outline'
                      className='w-full h-12 sm:h-14 text-base sm:text-lg font-medium'>
                      <Settings className='h-4 w-4 sm:h-5 sm:w-5' />
                      <span className='hidden sm:inline'>
                        Profil bearbeiten
                      </span>
                      <span className='sm:hidden'>Profil</span>
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center'>
                      <Activity className='h-5 w-5 text-primary' />
                    </div>
                    <h3 className='text-lg sm:text-xl font-semibold text-white'>
                      Letzte Aktivitäten
                    </h3>
                  </div>
                  <div className='space-y-3 sm:space-y-4'>
                    <div className='flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300'>
                      <div className='w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 text-green-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-white font-medium text-sm sm:text-base truncate'>
                          Rechnung #INV-2024-001 bezahlt
                        </p>
                        <p className='text-white/50 text-xs sm:text-sm'>
                          Vor 2 Stunden
                        </p>
                      </div>
                      <span className='text-green-400 font-semibold text-sm sm:text-base flex-shrink-0'>
                        €1,200.00
                      </span>
                    </div>
                    <div className='flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300'>
                      <div className='w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <FileText className='h-4 w-4 sm:h-5 sm:w-5 text-blue-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-white font-medium text-sm sm:text-base truncate'>
                          Neue Rechnung erstellt
                        </p>
                        <p className='text-white/50 text-xs sm:text-sm'>
                          Gestern
                        </p>
                      </div>
                      <span className='text-white/70 font-semibold text-sm sm:text-base flex-shrink-0'>
                        #INV-2024-002
                      </span>
                    </div>
                    <div className='flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300'>
                      <div className='w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <Bell className='h-4 w-4 sm:h-5 sm:w-5 text-yellow-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-white font-medium text-sm sm:text-base truncate'>
                          Rechnung überfällig
                        </p>
                        <p className='text-white/50 text-xs sm:text-sm'>
                          Vor 3 Tagen
                        </p>
                      </div>
                      <span className='text-yellow-400 font-semibold text-sm sm:text-base flex-shrink-0'>
                        #INV-2024-003
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center'>
                    <TrendingUp className='h-5 w-5 text-primary' />
                  </div>
                  <h3 className='text-lg sm:text-xl font-semibold text-white'>
                    Performance Insights
                  </h3>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                  <div className='text-center p-4 sm:p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Target className='h-6 w-6 sm:h-8 sm:w-8 text-primary' />
                    </div>
                    <h4 className='text-white font-semibold mb-2 text-sm sm:text-base'>
                      Zahlungsrate
                    </h4>
                    <p className='text-2xl sm:text-3xl font-bold text-primary mb-1'>
                      {Math.round(
                        (stats.paidInvoices / stats.totalInvoices) * 100
                      )}
                      %
                    </p>
                    <p className='text-white/50 text-xs sm:text-sm'>
                      Erfolgreiche Zahlungen
                    </p>
                  </div>
                  <div className='text-center p-4 sm:p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Calendar className='h-6 w-6 sm:h-8 sm:w-8 text-green-400' />
                    </div>
                    <h4 className='text-white font-semibold mb-2 text-sm sm:text-base'>
                      Diesen Monat
                    </h4>
                    <p className='text-2xl sm:text-3xl font-bold text-green-400 mb-1'>
                      €
                      {stats.thisMonthRevenue.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className='text-white/50 text-xs sm:text-sm'>
                      Monatsumsatz
                    </p>
                  </div>
                  <div className='text-center p-4 sm:p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300 sm:col-span-2 lg:col-span-1'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Award className='h-6 w-6 sm:h-8 sm:w-8 text-blue-400' />
                    </div>
                    <h4 className='text-white font-semibold mb-2 text-sm sm:text-base'>
                      Durchschnitt
                    </h4>
                    <p className='text-2xl sm:text-3xl font-bold text-blue-400 mb-1'>
                      €
                      {Math.round(
                        stats.totalRevenue / stats.totalInvoices
                      ).toLocaleString('de-DE')}
                    </p>
                    <p className='text-white/50 text-xs sm:text-sm'>
                      Pro Rechnung
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Profile Tab */
            <div className='max-w-4xl mx-auto'>
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-white/30 transition-all duration-300'>
                {/* Profile Header */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4'>
                  <div className='flex items-center gap-3 sm:gap-4'>
                    <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10'>
                      <User className='h-8 w-8 sm:h-10 sm:w-10 text-primary' />
                    </div>
                    <div>
                      <h2 className='text-2xl sm:text-3xl font-bold text-white leading-tight'>
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className='text-white/70 text-base sm:text-lg'>
                        {profile.email}
                      </p>
                      {profile.isEmailVerified && (
                        <div className='flex items-center gap-2 mt-2'>
                          <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 text-green-400' />
                          <span className='text-green-400 text-xs sm:text-sm font-medium'>
                            E-Mail verifiziert
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'outline' : 'default'}
                    className='flex items-center gap-2'>
                    <Edit3 className='h-4 w-4' />
                    {isEditing ? 'Abbrechen' : 'Bearbeiten'}
                  </Button>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSave} className='space-y-6 sm:space-y-8'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
                    {/* Personal Information */}
                    <div className='space-y-4 sm:space-y-6'>
                      <div className='flex items-center gap-3 mb-4 sm:mb-6'>
                        <div className='w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center'>
                          <User className='h-4 w-4 text-primary' />
                        </div>
                        <h3 className='text-lg sm:text-xl font-semibold text-white'>
                          Persönliche Informationen
                        </h3>
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Vorname
                        </label>
                        <input
                          type='text'
                          value={profile.firstName || ''}
                          onChange={(e) =>
                            handleInputChange('firstName', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Nachname
                        </label>
                        <input
                          type='text'
                          value={profile.lastName || ''}
                          onChange={(e) =>
                            handleInputChange('lastName', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          E-Mail
                        </label>
                        <div className='flex items-center gap-3'>
                          <Mail className='h-5 w-5 text-white/50' />
                          <input
                            type='email'
                            value={profile.email}
                            disabled
                            className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 cursor-not-allowed'
                          />
                        </div>
                        <p className='text-white/50 text-xs mt-2'>
                          E-Mail kann nicht geändert werden
                        </p>
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Telefon
                        </label>
                        <div className='flex items-center gap-3'>
                          <Phone className='h-5 w-5 text-white/50' />
                          <input
                            type='tel'
                            value={profile.phone || ''}
                            onChange={(e) =>
                              handleInputChange('phone', e.target.value)
                            }
                            disabled={!isEditing}
                            className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className='space-y-4 sm:space-y-6'>
                      <div className='flex items-center gap-3 mb-4 sm:mb-6'>
                        <div className='w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center'>
                          <Building2 className='h-4 w-4 text-primary' />
                        </div>
                        <h3 className='text-lg sm:text-xl font-semibold text-white'>
                          Geschäftsinformationen
                        </h3>
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Unternehmen
                        </label>
                        <input
                          type='text'
                          value={profile.company || ''}
                          onChange={(e) =>
                            handleInputChange('company', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Steuernummer
                        </label>
                        <input
                          type='text'
                          value={profile.taxId || ''}
                          onChange={(e) =>
                            handleInputChange('taxId', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Umsatzsteuer-ID
                        </label>
                        <input
                          type='text'
                          value={profile.vatId || ''}
                          onChange={(e) =>
                            handleInputChange('vatId', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className='space-y-4 sm:space-y-6'>
                    <div className='flex items-center gap-3 mb-4 sm:mb-6'>
                      <div className='w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center'>
                        <MapPin className='h-4 w-4 text-primary' />
                      </div>
                      <h3 className='text-lg sm:text-xl font-semibold text-white'>
                        Adressinformationen
                      </h3>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
                      <div className='sm:col-span-2'>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Straße und Hausnummer
                        </label>
                        <input
                          type='text'
                          value={profile.address || ''}
                          onChange={(e) =>
                            handleInputChange('address', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          PLZ
                        </label>
                        <input
                          type='text'
                          value={profile.postalCode || ''}
                          onChange={(e) =>
                            handleInputChange('postalCode', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Stadt
                        </label>
                        <input
                          type='text'
                          value={profile.city || ''}
                          onChange={(e) =>
                            handleInputChange('city', e.target.value)
                          }
                          disabled={!isEditing}
                          className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                        />
                      </div>

                      <div>
                        <label className='block text-white/70 text-sm mb-2 font-medium'>
                          Land
                        </label>
                        <div className='flex items-center gap-3'>
                          <Globe className='h-5 w-5 text-white/50' />
                          <input
                            type='text'
                            value={profile.country || 'Deutschland'}
                            onChange={(e) =>
                              handleInputChange('country', e.target.value)
                            }
                            disabled={!isEditing}
                            className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 transition-all duration-300 text-sm sm:text-base'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className='flex justify-end pt-8 border-t border-white/20'>
                      <Button
                        type='submit'
                        disabled={isSaving}
                        className='flex items-center gap-3 px-8 py-4 text-lg font-medium'>
                        {isSaving ? (
                          <>
                            <Loader2 className='h-5 w-5 animate-spin' />
                            Speichern...
                          </>
                        ) : (
                          <>
                            <Save className='h-5 w-5' />
                            Änderungen speichern
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Leva hidden />
      <SessionManager />
      <SessionExpiryNotification onLogout={handleSignOut} />
    </div>
  );
}
