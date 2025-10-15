'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  name: string;
  url: string;
  icon?: LucideIcon;
}

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  dropdown?: DropdownItem[];
}

interface DropdownNavBarProps {
  items: NavItem[];
  className?: string;
  isLoggedIn?: boolean;
  userFamilyName?: string;
}

/**
 * DropdownNavBar - Professional navigation component with dropdown menus
 * Features:
 * - Responsive design (mobile icons, desktop text)
 * - Smooth dropdown animations with Framer Motion
 * - Hover and click interactions
 * - Backdrop blur and glass morphism
 * - Active state management
 * - Professional dropdown styling
 */
export function DropdownNavBar({
  items,
  className,
  isLoggedIn = false,
  userFamilyName = '',
}: DropdownNavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [clickOpenedDropdown, setClickOpenedDropdown] = useState<string | null>(
    null
  );
  const [activeDropdownItem, setActiveDropdownItem] = useState<string | null>(
    null
  );
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isDropdownClick = target.closest('[data-dropdown]');
      if (!isDropdownClick) {
        setActiveDropdown(null);
        setClickOpenedDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (itemName: string) => {
    if (activeDropdown === itemName) {
      setActiveDropdown(null);
      setClickOpenedDropdown(null);
    } else {
      setActiveDropdown(itemName);
      setClickOpenedDropdown(itemName);
      setActiveDropdownItem(null);
    }
  };

  const handleItemClick = (itemName: string) => {
    setActiveTab(itemName);
    setActiveDropdown(null);
    setClickOpenedDropdown(null);
    setActiveDropdownItem(null);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 pt-6',
        className
      )}>
      <div className='flex items-center gap-2 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg'>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          const hasDropdown = item.dropdown && item.dropdown.length > 0;
          const isDropdownOpen = activeDropdown === item.name;
          const isHovered = hoveredDropdown === item.name;

          return (
            <div
              key={item.name}
              className='relative'
              data-dropdown
              onMouseEnter={() => hasDropdown && setHoveredDropdown(item.name)}
              onMouseLeave={() => {
                if (hasDropdown) {
                  setHoveredDropdown(null);
                  // Only close if it wasn't opened by click
                  if (clickOpenedDropdown !== item.name) {
                    setActiveDropdown(null);
                  }
                }
              }}>
              {/* Main Navigation Item */}
              {hasDropdown ? (
                <div
                  onClick={() => handleDropdownToggle(item.name)}
                  className={cn(
                    'relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors flex items-center gap-2',
                    'text-foreground/80 hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}>
                  <span className='hidden md:inline'>{item.name}</span>
                  <span className='md:hidden'>
                    {item.name === 'USER' && isLoggedIn ? (
                      <span className='w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                        {userFamilyName.charAt(0)}
                      </span>
                    ) : (
                      <Icon size={18} strokeWidth={2.5} />
                    )}
                  </span>

                  {/* Dropdown Arrow */}
                  <ChevronDown
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      (isDropdownOpen || isHovered) && 'rotate-180'
                    )}
                  />

                  {/* Active State Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId='lamp'
                      className='absolute inset-0 w-full bg-primary/5 rounded-full -z-10'
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}>
                      <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full'>
                        <div className='absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2' />
                        <div className='absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1' />
                        <div className='absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2' />
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.url}
                  onClick={() => handleItemClick(item.name)}
                  className={cn(
                    'relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors flex items-center gap-2',
                    'text-foreground/80 hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}>
                  <span className='hidden md:inline'>{item.name}</span>
                  <span className='md:hidden'>
                    {item.name === 'USER' && isLoggedIn ? (
                      <span className='w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                        {userFamilyName.charAt(0)}
                      </span>
                    ) : (
                      <Icon size={18} strokeWidth={2.5} />
                    )}
                  </span>

                  {/* Active State Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId='lamp'
                      className='absolute inset-0 w-full bg-primary/5 rounded-full -z-10'
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}>
                      <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full'>
                        <div className='absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2' />
                        <div className='absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1' />
                        <div className='absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2' />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {hasDropdown &&
                  (isDropdownOpen ||
                    (isHovered && clickOpenedDropdown !== item.name)) && (
                    <motion.div
                      ref={(el) => {
                        dropdownRefs.current[item.name] = el;
                      }}
                      variants={dropdownVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-background/95 border border-border backdrop-blur-lg rounded-xl shadow-xl overflow-hidden'
                      style={{ zIndex: 1000 }}>
                      {/* Dropdown Items */}
                      <div className='py-2'>
                        {item.dropdown?.map((dropdownItem) => {
                          const isActiveDropdownItem =
                            activeDropdownItem === dropdownItem.name;
                          return (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.url}
                              onClick={() => {
                                setActiveTab(item.name);
                                setActiveDropdown(null);
                                setClickOpenedDropdown(null);
                                setActiveDropdownItem(dropdownItem.name);
                              }}
                              className={cn(
                                'flex items-center px-4 py-2 text-sm transition-colors group relative',
                                isActiveDropdownItem
                                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                                  : 'text-foreground/80 hover:bg-muted/50 hover:text-primary'
                              )}>
                              <span className='flex-1'>
                                {dropdownItem.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
