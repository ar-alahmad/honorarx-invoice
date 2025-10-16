'use client';

import { NavBar } from './navbar';

/**
 * NavbarClient - Client-side wrapper for the navbar
 * This allows the navbar to be used in server components like the root layout
 */
export function NavbarClient() {
  return <NavBar />;
}
