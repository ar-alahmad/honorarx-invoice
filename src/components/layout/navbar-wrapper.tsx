'use client';

import { NavBarDemo } from './navbar-demo';

/**
 * NavbarWrapper - Client-side wrapper for the navbar
 * This allows the navbar to be used in server components like the root layout
 */
export function NavbarWrapper() {
  return <NavBarDemo />;
}
