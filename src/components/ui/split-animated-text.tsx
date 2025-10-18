'use client';

import { motion } from 'framer-motion';

interface SplitAnimatedTextProps {
  leftText: string;
  rightText: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function SplitAnimatedText({
  leftText,
  rightText,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
}: SplitAnimatedTextProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    }),
  };

  const leftPart = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 100,
        duration: 0.6,
      },
    },
    hidden: {
      opacity: 0,
      x: '-100%', // Responsive: moves from its own width
    },
  };

  const rightPart = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 100,
        duration: 0.6,
      },
    },
    hidden: {
      opacity: 0,
      x: '100%', // Responsive: moves from its own width
    },
  };

  return (
    <motion.span
      className={`${className} inline-block`}
      variants={container}
      initial='hidden'
      animate='visible'
      style={{ overflow: 'visible' }}>
      {/* Left part - animates from left as a unit */}
      <motion.span variants={leftPart} style={{ display: 'inline-block' }}>
        {leftText}
      </motion.span>

      {/* Right part - animates from right as a unit */}
      <motion.span variants={rightPart} style={{ display: 'inline-block' }}>
        {rightText}
      </motion.span>
    </motion.span>
  );
}
