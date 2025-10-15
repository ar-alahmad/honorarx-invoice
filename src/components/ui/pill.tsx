import { cn } from '@/lib/utils';
import { px } from '@/lib/utils';
import Link from 'next/link';

interface PillProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Pill component with polygonal styling and corner borders
 * Features:
 * - Polygonal clip-path for unique shape
 * - Four decorative corner borders
 * - Glowing dot indicator
 * - Backdrop blur effect
 * - Monospace font styling
 * - Optional link functionality with hover animations
 */
export const Pill = ({
  children,
  className,
  href,
  onMouseEnter,
  onMouseLeave,
}: PillProps) => {
  // Polygon roundness calculation for clip-path
  const polyRoundness = 6;
  const hypotenuse = polyRoundness * 2;
  const hypotenuseHalf = polyRoundness / 2 - 1.5;

  // Pill content with all the styling and borders
  const pillContent = (
    <>
      {/* Top-left corner border */}
      <span
        style={
          {
            '--h': px(hypotenuse),
            '--hh': px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className='absolute inline-block w-[var(--h)] top-[var(--hh)] left-[var(--hh)] h-[2px] -rotate-45 origin-top -translate-x-1/2 bg-border'
      />

      {/* Top-right corner border */}
      <span
        style={
          {
            '--h': px(hypotenuse),
            '--hh': px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className='absolute w-[var(--h)] top-[var(--hh)] right-[var(--hh)] h-[2px] bg-border rotate-45 translate-x-1/2'
      />

      {/* Bottom-left corner border */}
      <span
        style={
          {
            '--h': px(hypotenuse),
            '--hh': px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className='absolute w-[var(--h)] bottom-[var(--hh)] left-[var(--hh)] h-[2px] bg-border rotate-45 -translate-x-1/2'
      />

      {/* Bottom-right corner border */}
      <span
        style={
          {
            '--h': px(hypotenuse),
            '--hh': px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className='absolute w-[var(--h)] bottom-[var(--hh)] right-[var(--hh)] h-[2px] bg-border -rotate-45 translate-x-1/2'
      />

      {/* Glowing dot indicator */}
      <span className='inline-block size-2.5 rounded-full bg-primary mr-2 shadow-glow shadow-primary/50' />

      {children}
    </>
  );

  // If href is provided, wrap in Link with hover animations
  if (href) {
    return (
      <Link href={href}>
        <div
          style={
            {
              '--poly-roundness': px(polyRoundness),
            } as React.CSSProperties
          }
          className={cn(
            'bg-[#262626]/50 transform-gpu font-medium text-foreground/50 backdrop-blur-xs font-mono text-sm inline-flex items-center justify-center px-3 h-8 border border-border cursor-pointer transition-all duration-300 hover:scale-105 hover:text-primary hover:bg-[#262626]/70 [clip-path:polygon(var(--poly-roundness)_0,calc(100%_-_var(--poly-roundness))_0,100%_var(--poly-roundness),100%_calc(100%_-_var(--poly-roundness)),calc(100%_-_var(--poly-roundness))_100%,var(--poly-roundness)_100%,0_calc(100%_-_var(--poly-roundness)),0_var(--poly-roundness))]',
            className
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          {pillContent}
        </div>
      </Link>
    );
  }

  // Default pill without link
  return (
    <div
      style={
        {
          '--poly-roundness': px(polyRoundness),
        } as React.CSSProperties
      }
      className={cn(
        'bg-[#262626]/50 transform-gpu font-medium text-foreground/50 backdrop-blur-xs font-mono text-sm inline-flex items-center justify-center px-3 h-8 border border-border [clip-path:polygon(var(--poly-roundness)_0,calc(100%_-_var(--poly-roundness))_0,100%_var(--poly-roundness),100%_calc(100%_-_var(--poly-roundness)),calc(100%_-_var(--poly-roundness))_100%,var(--poly-roundness)_100%,0_calc(100%_-_var(--poly-roundness)),0_var(--poly-roundness))]',
        className
      )}>
      {pillContent}
    </div>
  );
};
