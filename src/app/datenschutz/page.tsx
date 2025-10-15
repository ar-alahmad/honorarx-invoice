'use client';

import { useState, useEffect } from 'react';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';
import {
  Shield,
  Lock,
  Eye,
  Database,
  User,
  Mail,
  Settings,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

const privacySections = [
  {
    icon: Shield,
    title: 'Datenschutz-Grundsätze',
    description:
      'Ihre Privatsphäre steht an erster Stelle. Wir schützen Ihre Daten nach höchsten Standards.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    content:
      'Wir verpflichten uns, Ihre persönlichen Daten mit größter Sorgfalt zu behandeln und nur für die angegebenen Zwecke zu verwenden.',
  },
  {
    icon: Lock,
    title: 'Datensicherheit',
    description:
      'Moderne Verschlüsselung und sichere Server schützen Ihre Informationen.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    content:
      'Alle Datenübertragungen erfolgen über verschlüsselte Verbindungen (SSL/TLS). Ihre Daten werden auf sicheren Servern in Deutschland gespeichert.',
  },
  {
    icon: Eye,
    title: 'Datenerhebung',
    description: 'Transparenz darüber, welche Daten wir erheben und warum.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    content:
      'Wir erheben nur die Daten, die für die Bereitstellung unserer Dienstleistungen erforderlich sind. Keine unnötige Datensammlung.',
  },
  {
    icon: Database,
    title: 'Datenverarbeitung',
    description:
      'Klare Informationen über die Verarbeitung Ihrer persönlichen Daten.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    content:
      'Ihre Daten werden ausschließlich für die Rechnungsverwaltung und den Service-Betrieb verarbeitet. Keine Weitergabe an Dritte.',
  },
  {
    icon: User,
    title: 'Ihre Rechte',
    description: 'Vollständige Kontrolle über Ihre persönlichen Daten.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    content:
      'Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch. Kontaktieren Sie uns jederzeit.',
  },
  {
    icon: Mail,
    title: 'Kontakt & Beschwerden',
    description: 'Direkter Kontakt für alle datenschutzrechtlichen Anliegen.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    content:
      'Bei Fragen zum Datenschutz wenden Sie sich an: datenschutz@honorarx.de oder nutzen Sie unser Kontaktformular.',
  },
];

export default function DatenschutzPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate privacy sections first
      privacySections.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 150);
      });

      // Animate other sections after privacy sections
      setTimeout(() => {
        setVisibleSections([0]); // Hero section
      }, privacySections.length * 150 + 300);

      setTimeout(() => {
        setVisibleSections((prev) => [...prev, 1, 2]); // Detailed info boxes
      }, privacySections.length * 150 + 600);

      setTimeout(() => {
        setVisibleSections((prev) => [...prev, 3]); // Important notice
      }, privacySections.length * 150 + 900);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground
          showControls={process.env.NODE_ENV === 'development'}
          speed={0.5}
          opacity={0.3}
          pointSize={4.0}
        />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen'>
        {/* Header section */}
        <div className='pt-48 sm:pt-52 lg:pt-56 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-8 sm:mb-12'>
              <div className='flex items-center justify-center mb-4'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                  <span className='tracking-wider'>Datenschutzerklärung</span>
                </h1>
              </div>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono max-w-3xl mx-auto'>
                Schutz Ihrer personenbezogenen Daten – Transparenz und Vertrauen
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            {/* Privacy Sections Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16'>
              {privacySections.map((section, index) => {
                const Icon = section.icon;
                const isVisible = visibleCards.includes(index);

                return (
                  <div
                    key={index}
                    className={`transform transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}>
                    <div
                      className={`bg-gradient-to-br ${section.color} backdrop-blur-sm border ${section.borderColor} rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-[#C9A227]/20 hover:border-[#D9B43A] transition-all duration-300 hover:scale-105 h-full group`}>
                      <div className='flex flex-col h-full'>
                        <div className='flex items-center mb-4'>
                          <div
                            className={`w-12 h-12 bg-[#2B2D31] border ${section.borderColor} rounded-lg flex items-center justify-center mr-4 group-hover:border-[#D9B43A] transition-colors duration-300`}>
                            <Icon
                              className={`w-6 h-6 ${section.iconColor} group-hover:text-[#D9B43A] transition-colors duration-300`}
                            />
                          </div>
                          <h3 className='text-lg font-sentient text-[#F5F5F5] tracking-wide'>
                            {section.title}
                          </h3>
                        </div>
                        <p className='text-[#F5F5F5]/90 text-sm leading-relaxed mb-4 flex-grow'>
                          {section.description}
                        </p>
                        <div className='text-[#F5F5F5]/80 text-xs leading-relaxed border-t border-[#C9A227]/30 pt-3'>
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hero Section */}
            <div className='text-center mb-16'>
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleSections.includes(0)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '0ms' }}>
                <div className='bg-gradient-to-r from-[#2B2D31] to-[#2B2D31]/80 backdrop-blur-sm border border-[#C9A227]/30 rounded-2xl p-8 lg:p-12 shadow-lg shadow-[#C9A227]/10'>
                  <h2 className='text-2xl sm:text-3xl lg:text-4xl font-sentient text-primary tracking-wide mb-6'>
                    Ihr Datenschutz ist unser Anliegen
                  </h2>
                  <p className='text-lg text-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed'>
                    Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                    Diese Datenschutzerklärung informiert Sie über die Art, den
                    Umfang und Zweck der Verarbeitung von personenbezogenen
                    Daten durch HonorarX.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <CheckCircle className='w-4 h-4 text-primary' />
                      DSGVO-konform
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <Lock className='w-4 h-4 text-primary' />
                      SSL-verschlüsselt
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <Shield className='w-4 h-4 text-primary' />
                      Transparent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
              {/* Verantwortlicher */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleSections.includes(1)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '0ms' }}>
                <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg h-full flex flex-col'>
                  <h3 className='text-xl font-sentient text-primary tracking-wide mb-4 flex items-center'>
                    <Settings className='w-6 h-6 mr-3 text-primary' />
                    Verantwortlicher
                  </h3>
                  <div className='space-y-3 text-foreground/90 text-sm leading-relaxed flex-grow'>
                    <p>
                      <strong>HonorarX GmbH</strong>
                    </p>
                    <p>
                      Luisenstraße 9B
                      <br />
                      79410 Badenweiler
                      <br />
                      Deutschland
                    </p>
                    <p>
                      E-Mail: datenschutz@honorarx.de
                      <br />
                      Telefon: +49 (0) 123 456 789
                    </p>
                  </div>
                </div>
              </div>

              {/* Betroffenenrechte */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleSections.includes(2)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '200ms' }}>
                <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg h-full flex flex-col'>
                  <h3 className='text-xl font-sentient text-primary tracking-wide mb-4 flex items-center'>
                    <User className='w-6 h-6 mr-3 text-primary' />
                    Ihre Rechte
                  </h3>
                  <div className='space-y-3 text-foreground/90 text-sm leading-relaxed flex-grow'>
                    <div className='flex items-start gap-2'>
                      <CheckCircle className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                      <span>Recht auf Auskunft über verarbeitete Daten</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <CheckCircle className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                      <span>Recht auf Berichtigung unrichtiger Daten</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <CheckCircle className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                      <span>Recht auf Löschung Ihrer Daten</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <CheckCircle className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                      <span>Recht auf Widerspruch gegen die Verarbeitung</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div
              className={`transform transition-all duration-700 ease-out ${
                visibleSections.includes(3)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: '0ms' }}>
              <div className='bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-xl p-8 shadow-lg'>
                <div className='flex items-start gap-4'>
                  <AlertTriangle className='w-8 h-8 text-primary flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='text-xl font-sentient text-primary tracking-wide mb-4'>
                      Wichtiger Hinweis
                    </h3>
                    <p className='text-foreground/90 leading-relaxed mb-4'>
                      Diese Datenschutzerklärung entspricht den Anforderungen
                      der DSGVO und wird regelmäßig aktualisiert. Bei Änderungen
                      informieren wir Sie rechtzeitig über unsere Website.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 items-center'>
                      <a
                        href='/kontakt'
                        className='flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm'>
                        <Mail className='w-4 h-4' />
                        Datenschutz-Fragen stellen
                        <ArrowRight className='w-4 h-4' />
                      </a>
                      <p className='text-xs text-foreground/60 font-mono'>
                        Letzte Aktualisierung: Oktober 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}
