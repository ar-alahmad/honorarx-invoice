import {
  Home,
  User,
  FileText,
  Info,
  LogIn,
  Plus,
  List,
  Building2,
  Mail,
  Shield,
  FileCheck,
} from 'lucide-react';
import { DropdownNavBar } from '@/components/ui/dropdown-navbar';

/**
 * NavBarDemo - Professional navigation component for HonorarX Invoice
 * Features dropdown menus for organized navigation:
 * - HOME: Dashboard/Overview
 * - RECHNUNG: Invoice management with dropdown (Create, List)
 * - PROFILE: User profile page (direct link)
 * - ANMELDEN: Login page (direct link)
 * - INFO: Company information with dropdown (About, Contact, Legal)
 */
export function NavBarDemo() {
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
      name: 'PROFILE',
      url: '/profil',
      icon: User,
    },
    {
      name: 'ANMELDEN',
      url: '/anmelden',
      icon: LogIn,
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
  ];

  return <DropdownNavBar items={navItems} />;
}
