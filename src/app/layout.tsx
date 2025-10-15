import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { NavbarWrapper } from '@/components/layout';
import { SessionProvider } from '@/components/providers/SessionProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HonorarX Invoice - Professional Invoice Management',
  description:
    'Professional invoice management system with stunning visual experiences. Create, manage, and track invoices with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          {/* Navigation Bar - appears on all pages */}
          <NavbarWrapper />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
