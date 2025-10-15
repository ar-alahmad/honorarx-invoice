'use client';

import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';

/**
 * Nutzungsbedingungen (Terms of Service) Page
 *
 * This page displays the comprehensive terms of service for HonorarX.
 * Features:
 * - Professional legal document layout
 * - Responsive design for all devices
 * - Proper typography hierarchy
 * - Dynamic background integration
 * - Accessible content structure
 */
export default function NutzungsbedingungenPage() {
  return (
    <div className='relative min-h-screen'>
      {/* Dynamic particle background with error boundary */}
      <ErrorBoundary>
        <DynamicBackground
          showControls={process.env.NODE_ENV === 'development'}
          speed={0.5}
          opacity={0.3}
          pointSize={4.0}
        />
      </ErrorBoundary>

      {/* Main content container */}
      <div className='relative z-10 min-h-screen'>
        {/* Header section */}
        <div className='pt-48 sm:pt-52 lg:pt-56 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-8 sm:mb-12'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                <span className='tracking-wider'>Nutzungsbedingungen</span>
              </h1>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono'>
                für die Anwendung Honorar X
              </p>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              {/* Section 1: Geltungsbereich */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-6'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>1</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Geltungsbereich
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Diese Nutzungsbedingungen regeln die Nutzung der
                    Webanwendung Honorar X (nachfolgend &ldquo;Anwendung&rdquo;
                    oder &ldquo;App&rdquo; genannt).
                  </p>
                  <p>
                    Mit der Registrierung oder Nutzung der App erklären Sie sich
                    mit diesen Bedingungen einverstanden.
                  </p>
                </div>
              </div>

              {/* Section 2: Leistungsbeschreibung */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-6'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>2</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Leistungsbeschreibung
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Honorar X bietet Nutzer:innen die Möglichkeit, auf einfache
                    Weise Rechnungen zu erstellen, herunterzuladen und zu
                    verwalten.
                  </p>
                  <p>
                    Die App dient ausschließlich der Unterstützung bei der
                    Rechnungsverwaltung – sie ersetzt keine steuerliche oder
                    rechtliche Beratung.
                  </p>
                  <p>
                    Alle generierten Rechnungen basieren auf den von den
                    Nutzer:innen eingegebenen Daten.
                  </p>
                </div>
              </div>

              {/* Section 3: Registrierung und Konto */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-6'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>3</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Registrierung und Konto
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Für bestimmte Funktionen ist eine Registrierung
                    erforderlich.
                  </p>
                  <p>
                    Die Nutzer:innen verpflichten sich, bei der Registrierung
                    wahrheitsgemäße und vollständige Angaben zu machen und ihre
                    Zugangsdaten vertraulich zu behandeln.
                  </p>
                  <p>
                    Der Betreiber behält sich vor, Konten zu sperren oder zu
                    löschen, wenn gegen diese Nutzungsbedingungen verstoßen
                    wird.
                  </p>
                </div>
              </div>

              {/* Section 4: Nutzung und Verantwortung */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-6'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>4</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Nutzung und Verantwortung
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Die App darf nur im Rahmen der geltenden Gesetze und dieser
                    Bedingungen genutzt werden.
                  </p>
                  <p>
                    Die Verantwortung für die Richtigkeit der eingegebenen Daten
                    und der erstellten Rechnungen liegt bei den Nutzer:innen.
                  </p>
                  <p>
                    Eine missbräuchliche Nutzung (z. B. Eingabe falscher Daten,
                    unrechtmäßige Nutzung fremder Informationen) ist untersagt.
                  </p>
                </div>
              </div>

              {/* Section 5: Haftungsausschluss */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-8'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>5</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Haftungsausschluss
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Der Betreiber übernimmt keine Gewähr für die
                    Vollständigkeit, Richtigkeit oder rechtliche Gültigkeit der
                    durch die App erstellten Rechnungen.
                  </p>
                  <p>Die Nutzung erfolgt auf eigene Verantwortung.</p>
                  <p>
                    Eine Haftung für entgangenen Gewinn, Datenverlust oder
                    Folgeschäden ist ausgeschlossen, soweit gesetzlich zulässig.
                  </p>
                </div>
              </div>

              {/* Section 6: Datenschutz */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-8'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>6</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Datenschutz
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Die Verarbeitung personenbezogener Daten erfolgt gemäß der
                    Datenschutzerklärung.
                  </p>
                  <p>
                    Es werden nur die Daten verarbeitet, die für den Betrieb der
                    App notwendig sind.
                  </p>
                </div>
              </div>

              {/* Section 7: Änderungen der App oder der Bedingungen */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-6'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>7</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Änderungen der App oder der Bedingungen
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Der Betreiber behält sich das Recht vor, die App oder diese
                    Nutzungsbedingungen jederzeit zu ändern, soweit dies
                    zumutbar ist.
                  </p>
                  <p>
                    Über wesentliche Änderungen werden Nutzer:innen rechtzeitig
                    informiert.
                  </p>
                </div>
              </div>

              {/* Section 8: Kündigung und Löschung */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-8'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>8</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Kündigung und Löschung
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>Nutzer:innen können ihr Konto jederzeit löschen.</p>
                  <p>
                    Der Betreiber kann den Zugang zur App aus wichtigem Grund
                    sperren oder kündigen (z. B. bei Missbrauch oder
                    Sicherheitsverstößen).
                  </p>
                </div>
              </div>

              {/* Section 9: Anwendbares Recht */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-8'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>9</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Anwendbares Recht
                  </h2>
                </div>
                <div className='space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>Es gilt das Recht der Bundesrepublik Deutschland.</p>
                  <p>
                    Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz
                    des Betreibers.
                  </p>
                </div>
              </div>

              {/* Section 10: Kontakt */}
              <div className='col-span-full bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>10</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Kontakt
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed text-center'>
                  <p>
                    Fragen zu diesen Nutzungsbedingungen oder zur App richten
                    Sie bitte an:
                  </p>
                  <div className='flex justify-center mt-3'>
                    <div className='bg-background/50 border border-border/30 rounded-lg p-3 sm:p-4'>
                      <a
                        href='mailto:info@honorarx.de'
                        className='text-primary font-mono text-sm sm:text-base hover:text-primary/80 transition-colors duration-200 inline-flex items-center gap-2'>
                        📧 info@honorarx.de
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='col-span-full bg-background/60 backdrop-blur-sm border border-border/30 rounded-xl p-4 sm:p-6 shadow-md'>
                <p className='text-foreground/60 text-xs sm:text-sm font-mono text-center'>
                  (Stand: Oktober 2025)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leva controls (hidden in production) */}
      <Leva hidden />
    </div>
  );
}
