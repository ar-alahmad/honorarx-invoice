'use client';

import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';

/**
 * Datenschutz (Privacy Policy) Page
 *
 * This page displays the comprehensive privacy policy for HonorarX.
 * Features:
 * - GDPR-compliant privacy policy
 * - Professional legal document layout
 * - Responsive design for all devices
 * - Proper typography hierarchy
 * - Dynamic background integration
 * - Accessible content structure
 * - Functional contact links
 */
export default function DatenschutzPage() {
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
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-8 sm:mb-12'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                <span className='tracking-wider'>Datenschutzerklärung</span>
              </h1>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono'>
                Schutz Ihrer personenbezogenen Daten
              </p>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              {/* Section 1: Verantwortlicher */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>1</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Verantwortlicher
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p className='text-xs text-foreground/70 mb-2'>
                    Verantwortlich für die Datenverarbeitung:
                  </p>
                  <p className='font-semibold text-foreground'>
                    Abdul Rhman Alahmad
                  </p>
                  <div className='space-y-1'>
                    <p>Luisenstraße 9B</p>
                    <p>79410 Badenweiler</p>
                    <p>Deutschland</p>
                  </div>
                  <div className='space-y-2 mt-4'>
                    <div className='flex items-center gap-2'>
                      <span>📧</span>
                      <a
                        href='mailto:info@honorarx.de'
                        className='text-primary hover:text-primary/80 transition-colors duration-200 text-xs'>
                        info@honorarx.de
                      </a>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>🌐</span>
                      <a
                        href='https://honorarx.de'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-primary/80 transition-colors duration-200 text-xs'>
                        https://honorarx.de
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Allgemeine Hinweise */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>2</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Allgemeine Hinweise
                  </h2>
                </div>
                <div className='space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Der Schutz Ihrer personenbezogenen Daten ist uns wichtig.
                    Wir verarbeiten personenbezogene Daten ausschließlich im
                    Einklang mit der Datenschutz-Grundverordnung (DSGVO) und den
                    geltenden Datenschutzgesetzen der Bundesrepublik
                    Deutschland.
                  </p>
                  <p>
                    Personenbezogene Daten sind alle Informationen, die sich auf
                    eine identifizierte oder identifizierbare Person beziehen
                    (z. B. Name, E-Mail-Adresse, IP-Adresse).
                  </p>
                </div>
              </div>

              {/* Section 3: Rechtsgrundlage */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>3</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Rechtsgrundlage
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Die Datenverarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. b
                    DSGVO zur Erfüllung des Nutzungsvertrags (Bereitstellung der
                    App) sowie gemäß Art. 6 Abs. 1 lit. <br /> f DSGVO auf
                    Grundlage unseres berechtigten Interesses an der Sicherheit
                    und Verbesserung unseres Online-Angebots.
                  </p>
                </div>
              </div>

              {/* Section 4: Erhebung und Nutzung */}
              <div className='col-span-full bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>4</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Erhebung und Nutzung personenbezogener Daten
                  </h2>
                </div>
                <div className='space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed'>
                  <p>
                    Wir verarbeiten personenbezogene Daten nur, soweit dies zur
                    Bereitstellung einer funktionsfähigen Website und unserer
                    Leistungen erforderlich ist.
                  </p>

                  <div className='space-y-4'>
                    <div>
                      <h3 className='font-semibold text-foreground mb-2'>
                        A. Beim Besuch der Website
                      </h3>
                      <p className='mb-2'>
                        Beim Aufruf unserer Website werden automatisch
                        technische Informationen durch Ihren Browser
                        übermittelt:
                      </p>
                      <ul className='list-disc list-inside space-y-1 ml-4 text-xs sm:text-sm'>
                        <li>IP-Adresse (anonymisiert gespeichert)</li>
                        <li>Datum und Uhrzeit des Zugriffs</li>
                        <li>Browsertyp und Version</li>
                        <li>Betriebssystem</li>
                        <li>Referrer-URL</li>
                      </ul>
                      <p className='mt-2 text-xs text-foreground/70'>
                        Diese Daten dienen der Sicherstellung des Betriebs, der
                        Systemsicherheit und der statistischen Auswertung und
                        werden nach 7 Tagen automatisch gelöscht.
                      </p>
                    </div>

                    <div>
                      <h3 className='font-semibold text-foreground mb-2'>
                        B. Bei der Registrierung / Nutzung der App
                      </h3>
                      <p className='mb-2'>
                        Wenn Sie sich in der App registrieren oder anmelden,
                        speichern wir:
                      </p>
                      <ul className='list-disc list-inside space-y-1 ml-4 text-xs sm:text-sm'>
                        <li>Ihren Namen (sofern angegeben)</li>
                        <li>Ihre E-Mail-Adresse</li>
                        <li>Ihr Passwort (verschlüsselt)</li>
                      </ul>
                      <p className='mt-2 text-xs text-foreground/70'>
                        Diese Daten werden ausschließlich zur Bereitstellung
                        Ihres Benutzerkontos und zur Generierung Ihrer
                        Rechnungen verwendet.
                      </p>
                    </div>

                    <div>
                      <h3 className='font-semibold text-foreground mb-2'>
                        C. Bei der Rechnungserstellung
                      </h3>
                      <p className='text-sm text-foreground/70'>
                        Alle eingegebenen Rechnungsdaten (Zeiträume,
                        Arbeitsorte, Beträge, Leistungsbeschreibungen) werden
                        lokal verarbeitet und nur gespeichert, soweit dies für
                        die Nutzung der App notwendig ist. Die Verantwortung für
                        die Inhalte der eingegebenen Daten liegt bei den
                        Nutzer:innen selbst.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Weitergabe von Daten */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-10'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>5</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Weitergabe von Daten
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Eine Weitergabe personenbezogener Daten an Dritte erfolgt
                    nur, wenn:
                  </p>
                  <ul className='list-disc list-inside space-y-1 ml-4 text-xs sm:text-sm'>
                    <li>Sie ausdrücklich eingewilligt haben</li>
                    <li>dies zur Vertragserfüllung erforderlich ist</li>
                    <li>wir gesetzlich dazu verpflichtet sind</li>
                  </ul>
                  <p className='text-xs text-foreground/70'>
                    Es findet keine Datenweitergabe an Drittländer oder zu
                    Werbezwecken statt.
                  </p>
                </div>
              </div>

              {/* Section 6: Speicherung und Löschung */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-6'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>6</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Speicherung und Löschung
                  </h2>
                </div>
                <div className='space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Personenbezogene Daten werden nur so lange gespeichert, wie
                    es für die genannten Zwecke erforderlich ist oder
                    gesetzliche Aufbewahrungsfristen bestehen.
                  </p>
                  <p>
                    Nach Wegfall des Zweckes oder Ablauf der Frist werden die
                    Daten gelöscht oder anonymisiert.
                  </p>
                </div>
              </div>

              {/* Section 7: Ihre Rechte */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-10'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>7</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Ihre Rechte
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>Sie haben jederzeit das Recht auf:</p>
                  <ul className='list-disc list-inside space-y-1 ml-4 text-xs'>
                    <li>Auskunft (Art. 15 DSGVO)</li>
                    <li>Berichtigung (Art. 16 DSGVO)</li>
                    <li>Löschung (Art. 17 DSGVO)</li>
                    <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                    <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                  </ul>
                  <p className='text-xs text-foreground/70'>
                    Zur Ausübung dieser Rechte genügt eine formlose Mitteilung
                    per E-Mail an info@honorarx.de.
                  </p>
                </div>
              </div>

              {/* Section 8: Sicherheit der Daten */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>8</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Sicherheit der Daten
                  </h2>
                </div>
                <div className='space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Wir treffen geeignete technische und organisatorische
                    Maßnahmen, um Ihre Daten gegen Verlust, Missbrauch und
                    unbefugten Zugriff zu schützen.
                  </p>
                  <p>
                    Die Übertragung sensibler Daten erfolgt ausschließlich über
                    verschlüsselte SSL-/TLS-Verbindungen.
                  </p>
                </div>
              </div>

              {/* Section 9: Cookies und Tracking */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>9</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Cookies und Tracking
                  </h2>
                </div>
                <div className='space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Honorar X verwendet derzeit keine Tracking-Cookies oder
                    Analysedienste.
                  </p>
                  <p>
                    Lediglich technisch notwendige Cookies werden eingesetzt, um
                    die Nutzung der App zu ermöglichen (z. B. Sitzungscookies
                    für Login-Status).
                  </p>
                </div>
              </div>

              {/* Section 10: Änderungen */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>10</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Änderungen
                  </h2>
                </div>
                <div className='space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf
                    zu aktualisieren.
                  </p>
                  <p>
                    Es gilt stets die jeweils aktuelle Version, abrufbar unter{' '}
                    <a
                      href='https://honorarx.de/datenschutz'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary hover:text-primary/80 transition-colors duration-200'>
                      https://honorarx.de/datenschutz
                    </a>
                  </p>
                </div>
              </div>

              {/* Section 11: Kontakt zum Datenschutz */}
              <div className='col-span-full bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>11</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Kontakt zum Datenschutz
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed text-center'>
                  <p>Für Fragen zum Datenschutz wenden Sie sich bitte an:</p>
                  <div className='flex items-center justify-center gap-2'>
                    <span>📧</span>
                    <a
                      href='mailto:datenschutz@honorarx.de'
                      className='text-primary hover:text-primary/80 transition-colors duration-200'>
                      datenschutz@honorarx.de
                    </a>
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
