'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
 * - Mobile-optimized dropdown behavior (auto-closes on navigation, proper touch handling)
 * - Smart dropdown positioning (prevents edge overflow on mobile)
 * - Responsive dropdown width (USER dropdown narrower on mobile for better fit)
 */
export function DropdownNavBar({
  items,
  className,
  isLoggedIn = false,
  userFamilyName = '',
}: DropdownNavBarProps) {
  const pathname = usePathname();
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
  const [dropdownPosition, setDropdownPosition] = useState<{
    [key: string]: 'left' | 'center' | 'right';
  }>({});

  // Update active state based on current pathname
  useEffect(() => {
    // Reset dropdown states when pathname changes (fixes mobile dropdown staying open)
    setActiveDropdown(null);
    setClickOpenedDropdown(null);
    setHoveredDropdown(null);

    // Find the main nav item that matches the current path
    const currentItem = items.find((item) => {
      if (item.url === pathname) return true;
      // Check if any dropdown item matches the current path
      if (item.dropdown) {
        return item.dropdown.some(
          (dropdownItem) => dropdownItem.url === pathname
        );
      }
      return false;
    });

    if (currentItem) {
      setActiveTab(currentItem.name);

      // If the current path matches a dropdown item, set it as active
      if (currentItem.dropdown) {
        const activeDropdownItem = currentItem.dropdown.find(
          (dropdownItem) => dropdownItem.url === pathname
        );
        if (activeDropdownItem) {
          setActiveDropdownItem(activeDropdownItem.name);
        }
      }
    }
  }, [pathname, items]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isDropdownClick = target.closest('[data-dropdown]');
      if (!isDropdownClick) {
        setActiveDropdown(null);
        setClickOpenedDropdown(null);
        setHoveredDropdown(null);
      }
    };

    // Handle touch events for mobile devices
    const handleTouchOutside = (event: TouchEvent) => {
      const target = event.target as Element;
      const isDropdownClick = target.closest('[data-dropdown]');
      if (!isDropdownClick) {
        setActiveDropdown(null);
        setClickOpenedDropdown(null);
        setHoveredDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, []);

  // Calculate optimal dropdown position based on viewport and item position
  const calculateDropdownPosition = useCallback(
    (itemName: string, itemIndex: number) => {
      const totalItems = items.length;
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 192; // w-48 = 192px (default)

      // On mobile (below md breakpoint), use smart positioning
      if (viewportWidth < 768) {
        // For the last item (USER), position it to the right
        if (itemIndex === totalItems - 1) {
          return 'right';
        }
        // For the first item, position it to the left
        if (itemIndex === 0) {
          return 'left';
        }
        // For middle items, try to center but adjust if needed
        const itemCenter = (itemIndex + 0.5) * (viewportWidth / totalItems);
        const dropdownLeft = itemCenter - dropdownWidth / 2;
        const dropdownRight = itemCenter + dropdownWidth / 2;

        if (dropdownLeft < 16) return 'left'; // 16px margin
        if (dropdownRight > viewportWidth - 16) return 'right'; // 16px margin
        return 'center';
      }

      // On desktop, always center
      return 'center';
    },
    [items]
  );

  // Initialize and recalculate dropdown positions on window resize
  useEffect(() => {
    const calculateAllPositions = () => {
      // Calculate positions for all items
      const newPositions: { [key: string]: 'left' | 'center' | 'right' } = {};
      items.forEach((item, index) => {
        if (item.dropdown) {
          newPositions[item.name] = calculateDropdownPosition(item.name, index);
        }
      });
      setDropdownPosition(newPositions);
    };

    // Initial calculation
    calculateAllPositions();

    // Recalculate on resize
    const handleResize = () => {
      calculateAllPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items, calculateDropdownPosition]);

  const handleDropdownToggle = (itemName: string) => {
    if (activeDropdown === itemName) {
      // Close dropdown and reset all related states
      setActiveDropdown(null);
      setClickOpenedDropdown(null);
      setHoveredDropdown(null);
    } else {
      // Open dropdown and set states
      setActiveDropdown(itemName);
      setClickOpenedDropdown(itemName);
      setHoveredDropdown(null); // Clear hover state to prevent conflicts
      setActiveDropdownItem(null);

      // Calculate and set dropdown position
      const itemIndex = items.findIndex((item) => item.name === itemName);
      const position = calculateDropdownPosition(itemName, itemIndex);
      setDropdownPosition((prev) => ({ ...prev, [itemName]: position }));
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
              onMouseEnter={() => {
                // Only handle hover on desktop (not mobile)
                if (hasDropdown && window.innerWidth >= 768) {
                  setHoveredDropdown(item.name);
                }
              }}
              onMouseLeave={() => {
                // Only handle hover on desktop (not mobile)
                if (hasDropdown && window.innerWidth >= 768) {
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownToggle(item.name);
                  }}
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
                      className={cn(
                        'absolute top-full mt-2 bg-background/95 border border-border backdrop-blur-lg rounded-xl shadow-xl overflow-hidden',
                        // Responsive width: narrower for USER dropdown on mobile only
                        item.name === 'USER' ? 'w-40 md:w-48' : 'w-48',
                        // Smart positioning based on calculated position
                        dropdownPosition[item.name] === 'left' && 'left-0',
                        dropdownPosition[item.name] === 'center' &&
                          'left-1/2 -translate-x-1/2',
                        dropdownPosition[item.name] === 'right' && 'right-0',
                        // Fallback to center if no position calculated yet
                        !dropdownPosition[item.name] &&
                          'left-1/2 -translate-x-1/2'
                      )}
                      style={{ zIndex: 9999 }}>
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
                                // Immediately close dropdown and set states before navigation
                                setActiveTab(item.name);
                                setActiveDropdown(null);
                                setClickOpenedDropdown(null);
                                setHoveredDropdown(null);
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
