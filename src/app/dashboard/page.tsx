'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui/button';
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
  CreditCard,
  BarChart3,
  Activity,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
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
        setProfile(data.user);
        // TODO: Fetch actual stats from invoices API
        // For now, using mock data
        setStats({
          totalInvoices: 12,
          paidInvoices: 8,
          pendingInvoices: 3,
          totalRevenue: 15420.50,
          thisMonthRevenue: 3200.00,
          overdueInvoices: 1,
        });
      } else {
        setError('Fehler beim Laden der Daten');
      }
    } catch {
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
    await signOut({ callbackUrl: '/' });
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

  if (!session || !profile) {
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

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen p-4'>
        <div className='max-w-7xl mx-auto pt-8'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6'>
            <div className='flex items-center gap-6'>
              <div className='w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20'>
                <User className='h-10 w-10 text-primary' />
              </div>
              <div>
                <h1 className='text-4xl font-bold text-white mb-2'>
                  Willkommen zurück, {profile.firstName}!
                </h1>
                <p className='text-white/70 text-lg'>
                  Hier ist Ihr HonorarX Dashboard
                </p>
                {profile.isEmailVerified && (
                  <div className='flex items-center gap-2 mt-2'>
                    <CheckCircle className='h-5 w-5 text-green-400' />
                    <span className='text-green-400 text-sm font-medium'>
                      E-Mail verifiziert
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <Button
                onClick={handleSignOut}
                variant='outline'
                className='flex items-center gap-2'>
                <LogOut className='h-4 w-4' />
                Abmelden
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='flex gap-2 mb-8'>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-primary text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}>
              <BarChart3 className='h-5 w-5' />
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-primary text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}>
              <User className='h-5 w-5' />
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
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center'>
                      <FileText className='h-6 w-6 text-blue-400' />
                    </div>
                    <span className='text-2xl font-bold text-white'>
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

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center'>
                      <CheckCircle className='h-6 w-6 text-green-400' />
                    </div>
                    <span className='text-2xl font-bold text-white'>
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

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center'>
                      <Clock className='h-6 w-6 text-yellow-400' />
                    </div>
                    <span className='text-2xl font-bold text-white'>
                      {stats.pendingInvoices}
                    </span>
                  </div>
                  <h3 className='text-white/70 text-sm font-medium mb-1'>
                    Ausstehende Rechnungen
                  </h3>
                  <p className='text-white/50 text-xs'>
                    Warten auf Zahlung
                  </p>
                </div>

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center'>
                      <Euro className='h-6 w-6 text-primary' />
                    </div>
                    <span className='text-2xl font-bold text-white'>
                      €{stats.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <h3 className='text-white/70 text-sm font-medium mb-1'>
                    Gesamtumsatz
                  </h3>
                  <p className='text-white/50 text-xs'>
                    Alle Zeiten
                  </p>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Quick Actions */}
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                  <div className='flex items-center gap-3 mb-6'>
                    <Zap className='h-6 w-6 text-primary' />
                    <h3 className='text-xl font-semibold text-white'>
                      Schnellaktionen
                    </h3>
                  </div>
                  <div className='space-y-4'>
                    <Button
                      onClick={() => router.push('/rechnung-erstellen')}
                      className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-14 text-lg font-medium'>
                      <Plus className='h-5 w-5' />
                      Neue Rechnung erstellen
                    </Button>
                    <Button
                      onClick={() => router.push('/rechnungen')}
                      variant='outline'
                      className='w-full h-14 text-lg font-medium'>
                      <Eye className='h-5 w-5' />
                      Alle Rechnungen anzeigen
                    </Button>
                    <Button
                      onClick={() => setActiveTab('profile')}
                      variant='outline'
                      className='w-full h-14 text-lg font-medium'>
                      <Settings className='h-5 w-5' />
                      Profil bearbeiten
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                  <div className='flex items-center gap-3 mb-6'>
                    <Activity className='h-6 w-6 text-primary' />
                    <h3 className='text-xl font-semibold text-white'>
                      Letzte Aktivitäten
                    </h3>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-4 p-4 bg-white/5 rounded-xl'>
                      <div className='w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center'>
                        <CheckCircle className='h-5 w-5 text-green-400' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-white font-medium'>
                          Rechnung #INV-2024-001 bezahlt
                        </p>
                        <p className='text-white/50 text-sm'>
                          Vor 2 Stunden
                        </p>
                      </div>
                      <span className='text-green-400 font-semibold'>
                        €1,200.00
                      </span>
                    </div>
                    <div className='flex items-center gap-4 p-4 bg-white/5 rounded-xl'>
                      <div className='w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center'>
                        <FileText className='h-5 w-5 text-blue-400' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-white font-medium'>
                          Neue Rechnung erstellt
                        </p>
                        <p className='text-white/50 text-sm'>
                          Gestern
                        </p>
                      </div>
                      <span className='text-white/70 font-semibold'>
                        #INV-2024-002
                      </span>
                    </div>
                    <div className='flex items-center gap-4 p-4 bg-white/5 rounded-xl'>
                      <div className='w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center'>
                        <Bell className='h-5 w-5 text-yellow-400' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-white font-medium'>
                          Rechnung überfällig
                        </p>
                        <p className='text-white/50 text-sm'>
                          Vor 3 Tagen
                        </p>
                      </div>
                      <span className='text-yellow-400 font-semibold'>
                        #INV-2024-003
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <div className='flex items-center gap-3 mb-6'>
                  <TrendingUp className='h-6 w-6 text-primary' />
                  <h3 className='text-xl font-semibold text-white'>
                    Performance Insights
                  </h3>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='text-center p-6 bg-white/5 rounded-xl'>
                    <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Target className='h-8 w-8 text-primary' />
                    </div>
                    <h4 className='text-white font-semibold mb-2'>
                      Zahlungsrate
                    </h4>
                    <p className='text-3xl font-bold text-primary mb-1'>
                      {Math.round((stats.paidInvoices / stats.totalInvoices) * 100)}%
                    </p>
                    <p className='text-white/50 text-sm'>
                      Erfolgreiche Zahlungen
                    </p>
                  </div>
                  <div className='text-center p-6 bg-white/5 rounded-xl'>
                    <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Calendar className='h-8 w-8 text-green-400' />
                    </div>
                    <h4 className='text-white font-semibold mb-2'>
                      Diesen Monat
                    </h4>
                    <p className='text-3xl font-bold text-green-400 mb-1'>
                      €{stats.thisMonthRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className='text-white/50 text-sm'>
                      Monatsumsatz
                    </p>
                  </div>
                  <div className='text-center p-6 bg-white/5 rounded-xl'>
                    <div className='w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Award className='h-8 w-8 text-blue-400' />
                    </div>
                    <h4 className='text-white font-semibold mb-2'>
                      Durchschnitt
                    </h4>
                    <p className='text-3xl font-bold text-blue-400 mb-1'>
                      €{Math.round(stats.totalRevenue / stats.totalInvoices).toLocaleString('de-DE')}
                    </p>
                    <p className='text-white/50 text-sm'>
                      Pro Rechnung
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Profile Tab */
            <div className='max-w-4xl mx-auto'>
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'>
                {/* Profile Header */}
                <div className='flex items-center justify-between mb-8'>
                  <div className='flex items-center gap-4'>
                    <div className='w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20'>
                      <User className='h-10 w-10 text-primary' />
                    </div>
                    <div>
                      <h2 className='text-3xl font-bold text-white'>
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className='text-white/70 text-lg'>{profile.email}</p>
                      {profile.isEmailVerified && (
                        <div className='flex items-center gap-2 mt-2'>
                          <CheckCircle className='h-5 w-5 text-green-400' />
                          <span className='text-green-400 text-sm font-medium'>
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
                <form onSubmit={handleSave} className='space-y-8'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Personal Information */}
                    <div className='space-y-6'>
                      <div className='flex items-center gap-3 mb-6'>
                        <User className='h-6 w-6 text-primary' />
                        <h3 className='text-xl font-semibold text-white'>
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className='space-y-6'>
                      <div className='flex items-center gap-3 mb-6'>
                        <Building2 className='h-6 w-6 text-primary' />
                        <h3 className='text-xl font-semibold text-white'>
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className='space-y-6'>
                    <div className='flex items-center gap-3 mb-6'>
                      <MapPin className='h-6 w-6 text-primary' />
                      <h3 className='text-xl font-semibold text-white'>
                        Adressinformationen
                      </h3>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                      <div className='lg:col-span-2'>
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
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
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-300'
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
    </div>
  );
}