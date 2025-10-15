'use client';

import { useState, useEffect } from 'react';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';
import {
  FileText,
  Scale,
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  BookOpen,
} from 'lucide-react';

const termsSections = [
  {
    icon: FileText,
    title: 'Geltungsbereich',
    description:
      'Diese Nutzungsbedingungen regeln die Nutzung der Webanwendung HonorarX.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    content:
      'Mit der Registrierung oder Nutzung der App erklären Sie sich mit diesen Bedingungen einverstanden.',
  },
  {
    icon: BookOpen,
    title: 'Leistungsbeschreibung',
    description:
      'HonorarX bietet professionelle Rechnungsverwaltung mit modernster Technologie.',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    content:
      'Die App dient der Unterstützung bei der Rechnungsverwaltung – sie ersetzt keine steuerliche oder rechtliche Beratung.',
  },
  {
    icon: Users,
    title: 'Registrierung und Konto',
    description:
      'Für bestimmte Funktionen ist eine Registrierung erforderlich.',
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    content:
      'Nutzer verpflichten sich, wahrheitsgemäße Angaben zu machen und Zugangsdaten vertraulich zu behandeln.',
  },
  {
    icon: Shield,
    title: 'Nutzung und Verantwortung',
    description:
      'Die App darf nur im Rahmen der geltenden Gesetze genutzt werden.',
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    content:
      'Die Verantwortung für die Richtigkeit der eingegebenen Daten liegt bei den Nutzern.',
  },
  {
    icon: AlertTriangle,
    title: 'Haftungsausschluss',
    description:
      'Keine Gewähr für Vollständigkeit oder rechtliche Gültigkeit der Rechnungen.',
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    content:
      'Die Nutzung erfolgt auf eigene Verantwortung. Haftung für Folgeschäden ist ausgeschlossen.',
  },
  {
    icon: Settings,
    title: 'Änderungen der Bedingungen',
    description:
      'Der Betreiber behält sich das Recht vor, die Bedingungen zu ändern.',
    color: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    content:
      'Über wesentliche Änderungen werden Nutzer rechtzeitig informiert.',
  },
  {
    icon: XCircle,
    title: 'Kündigung und Löschung',
    description: 'Nutzer können ihr Konto jederzeit löschen.',
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    content:
      'Der Betreiber kann den Zugang bei Missbrauch oder Sicherheitsverstößen sperren.',
  },
  {
    icon: Scale,
    title: 'Anwendbares Recht',
    description: 'Es gilt das Recht der Bundesrepublik Deutschland.',
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    content:
      'Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz des Betreibers.',
  },
];

export default function NutzungsbedingungenPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate "Faire Nutzungsbedingungen" hero section first
      setTimeout(() => {
        setVisibleSections([0]); // Hero section
      }, 300);

      // Then animate main terms cards
      setTimeout(() => {
        termsSections.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards((prev) => [...prev, index]);
          }, index * 120);
        });
      }, 600);

      // Then animate additional sections
      setTimeout(() => {
        setVisibleSections((prev) => [...prev, 1, 2]); // Datenschutz and Kontakt
      }, termsSections.length * 120 + 900);

      setTimeout(() => {
        setVisibleSections((prev) => [...prev, 3]); // Einverständniserklärung
      }, termsSections.length * 120 + 1200);
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
                  <span className='tracking-wider'>Nutzungsbedingungen</span>
                </h1>
              </div>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono max-w-3xl mx-auto'>
                für die Anwendung HonorarX – Fair, transparent und rechtssicher
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            {/* Hero Section */}
            <div className='text-center mb-16'>
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleSections.includes(0)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '0ms' }}>
                <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 shadow-lg'>
                  <h2 className='text-2xl sm:text-3xl lg:text-4xl font-sentient text-primary tracking-wide mb-6'>
                    Faire Nutzungsbedingungen
                  </h2>
                  <p className='text-lg text-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed'>
                    Diese Nutzungsbedingungen schaffen eine faire und
                    transparente Grundlage für die Nutzung von HonorarX. Wir
                    legen Wert auf Klarheit und gegenseitiges Vertrauen.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <CheckCircle className='w-4 h-4 text-primary' />
                      Rechtssicher
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <Shield className='w-4 h-4 text-primary' />
                      Transparent
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <Scale className='w-4 h-4 text-primary' />
                      Fair
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Sections Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-16'>
              {termsSections.map((section, index) => {
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
                    style={{ transitionDelay: `${index * 120}ms` }}>
                    <div className='bg-[#1A1A1A] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all duration-300 hover:scale-105 hover:border-[#D9B43A]/50 h-full'>
                      <div className='flex flex-col h-full'>
                        {/* Icon and Badge Section */}
                        <div className='flex items-center justify-between mb-4'>
                          <div className='w-14 h-14 bg-[#2B2D31] border border-[#C9A227]/40 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#C9A227]/10'>
                            <Icon className='w-7 h-7 text-[#C9A227]' />
                          </div>
                          <div className='flex items-center text-xs text-[#F5F5F5]/70 font-mono bg-[#2B2D31] px-3 py-1 rounded-full border border-[#C9A227]/30'>
                            <div className='w-2 h-2 bg-[#C9A227] rounded-full mr-2'></div>
                            § {index + 1}
                          </div>
                        </div>

                        {/* Title Section */}
                        <h3 className='text-lg font-sentient text-[#C9A227] tracking-wide mb-3 leading-tight'>
                          {section.title}
                        </h3>

                        {/* Description */}
                        <p className='text-[#F5F5F5]/90 text-sm leading-relaxed mb-4 flex-grow'>
                          {section.description}
                        </p>

                        {/* Content */}
                        <div className='text-[#F5F5F5]/80 text-xs leading-relaxed border-t border-[#C9A227]/20 pt-3'>
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Important Sections */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
              {/* Datenschutz */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleSections.includes(1)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '0ms' }}>
                <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg'>
                  <h3 className='text-xl font-sentient text-primary tracking-wide mb-4 flex items-center'>
                    <Shield className='w-6 h-6 mr-3 text-primary' />
                    Datenschutz
                  </h3>
                  <div className='space-y-3 text-foreground/90 text-sm leading-relaxed'>
                    <p>
                      Die Verarbeitung personenbezogener Daten erfolgt gemäß der
                      <a
                        href='/datenschutz'
                        className='text-primary hover:text-primary/80 transition-colors ml-1'>
                        Datenschutzerklärung
                      </a>
                      .
                    </p>
                    <p>
                      Es werden nur die Daten verarbeitet, die für den Betrieb
                      der App notwendig sind.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kontakt */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleSections.includes(2)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '200ms' }}>
                <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg'>
                  <h3 className='text-xl font-sentient text-primary tracking-wide mb-4 flex items-center'>
                    <Mail className='w-6 h-6 mr-3 text-primary' />
                    Kontakt
                  </h3>
                  <div className='space-y-3 text-foreground/90 text-sm leading-relaxed'>
                    <p>
                      Fragen zu diesen Nutzungsbedingungen oder zur App richten
                      Sie bitte an:
                    </p>
                    <div className='bg-background/50 border border-border/30 rounded-lg p-3'>
                      <a
                        href='mailto:info@honorarx.de'
                        className='text-primary font-mono text-sm hover:text-primary/80 transition-colors'>
                        📧 info@honorarx.de
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Section */}
            <div
              className={`transform transition-all duration-700 ease-out ${
                visibleSections.includes(3)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: '0ms' }}>
              <div className='bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-xl p-8 shadow-lg'>
                <div className='text-center'>
                  <h3 className='text-2xl font-sentient text-primary tracking-wide mb-4'>
                    Einverständniserklärung
                  </h3>
                  <p className='text-foreground/90 leading-relaxed mb-6 max-w-3xl mx-auto'>
                    Durch die Nutzung von HonorarX bestätigen Sie, dass Sie
                    diese Nutzungsbedingungen gelesen, verstanden und akzeptiert
                    haben.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <CheckCircle className='w-4 h-4 text-primary' />
                      Ich habe die Nutzungsbedingungen gelesen
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                      <CheckCircle className='w-4 h-4 text-primary' />
                      Ich stimme den Bedingungen zu
                    </div>
                  </div>
                  <div className='mt-6 pt-6 border-t border-border/30'>
                    <p className='text-xs text-foreground/60 font-mono'>
                      Stand: Oktober 2024 • Alle Angaben ohne Gewähr
                    </p>
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
