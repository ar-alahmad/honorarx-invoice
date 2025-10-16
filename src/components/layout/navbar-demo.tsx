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
import { useSession } from 'next-auth/react';
import { secureLogout } from '@/lib/logout-manager';

/**
 * NavBarDemo - Professional navigation component for HonorarX Invoice
 * Features clean dropdown menus for organized navigation:
 * - HOME: Dashboard/Overview
 * - RECHNUNG: Invoice management with dropdown (Create, List)
 * - INFO: Company information with dropdown (About, Contact, Legal)
 * - USER: User account with authentication-aware dropdown
 */
export function NavBarDemo() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const userFamilyName =
    session?.user?.name?.split(' ').pop()?.toUpperCase() || 'USER';

  console.log(
    'NavBarDemo: Component rendered, isLoggedIn:',
    isLoggedIn,
    'userFamilyName:',
    userFamilyName
  );

  const navItems = [
    {
      name: 'HOME',
      url: '/',
      icon: Home,
    },
    // RECHNUNG menu item - only visible when user is logged in
    ...(isLoggedIn
      ? [
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
        ]
      : []),
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
              name: 'Dashboard',
              url: '/dashboard',
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
              onClick: async (e?: React.MouseEvent) => {
                e?.preventDefault();
                e?.stopPropagation();
                console.log('Navbar: Logout button clicked');
                console.log('Navbar: About to call secureLogout');
                try {
                  await secureLogout('/');
                  console.log('Navbar: secureLogout completed');
                } catch (error) {
                  console.error('Navbar: secureLogout error:', error);
                }
              },
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
