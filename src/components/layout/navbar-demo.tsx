import {
  Home,
  User,
  FileText,
  Info,
  LogIn,
  UserPlus,
  Plus,
  List,
  Building2,
  Mail,
  Shield,
  FileCheck,
  Settings,
  LogOut,
} from 'lucide-react';
import { DropdownNavBar } from '@/components/ui/dropdown-navbar';

/**
 * NavBarDemo - Professional navigation component for HonorarX Invoice
 * Features clean dropdown menus for organized navigation:
 * - HOME: Dashboard/Overview
 * - RECHNUNG: Invoice management with dropdown (Create, List)
 * - INFO: Company information with dropdown (About, Contact, Legal)
 * - USER: User account with authentication-aware dropdown
 */
export function NavBarDemo() {
  // TODO: Replace with actual authentication state
  const isLoggedIn = false; // This will be dynamic later
  const userFamilyName = 'MÜLLER'; // This will be dynamic later

  const navItems = [
    {
      name: 'HOME',
      url: '/',
      icon: Home,
    },
    {
      name: 'RECHNUNG',
      url: '#',
      icon: FileText,
      dropdown: [
        {
          name: 'Rechnung erstellen',
          url: '/rechnung-erstellen',
          icon: Plus,
        },
        {
          name: 'Rechnungen',
          url: '/rechnungen',
          icon: List,
        },
      ],
    },
    {
      name: 'INFO',
      url: '#',
      icon: Info,
      dropdown: [
        {
          name: 'Über HonorarX',
          url: '/ueber-honorarx',
          icon: Building2,
        },
        {
          name: 'Kontakt',
          url: '/kontakt',
          icon: Mail,
        },
        {
          name: 'Impressum',
          url: '/impressum',
          icon: FileCheck,
        },
        {
          name: 'Datenschutz',
          url: '/datenschutz',
          icon: Shield,
        },
        {
          name: 'Nutzungsbedingungen',
          url: '/nutzungsbedingungen',
          icon: FileCheck,
        },
      ],
    },
    {
      name: isLoggedIn ? userFamilyName : 'USER',
      url: '#',
      icon: User,
      dropdown: isLoggedIn
        ? [
            {
              name: 'Profil',
              url: '/profil',
              icon: User,
            },
            {
              name: 'Einstellungen',
              url: '/einstellungen',
              icon: Settings,
            },
            {
              name: 'Abmelden',
              url: '#',
              icon: LogOut,
            },
          ]
        : [
            {
              name: 'Anmelden',
              url: '/anmelden',
              icon: LogIn,
            },
            {
              name: 'Registrieren',
              url: '/registrieren',
              icon: UserPlus,
            },
          ],
    },
  ];

  return (
    <DropdownNavBar
      items={navItems}
      isLoggedIn={isLoggedIn}
      userFamilyName={userFamilyName}
    />
  );
}
