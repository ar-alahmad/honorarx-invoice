import { Home, User, FileText, Settings, CreditCard } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

/**
 * NavBarDemo - Navigation component for HonorarX Invoice
 * Features navigation items relevant to an invoice management system:
 * - Home: Dashboard/Overview
 * - Profile: User account management
 * - Invoices: Invoice management and creation
 * - Payments: Payment tracking and processing
 * - Settings: Application configuration
 */
export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Profile', url: '/profile', icon: User },
    { name: 'Invoices', url: '/invoices', icon: FileText },
    { name: 'Payments', url: '/payments', icon: CreditCard },
    { name: 'Settings', url: '/settings', icon: Settings },
  ];

  return <NavBar items={navItems} />;
}
