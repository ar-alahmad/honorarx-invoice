/**
 * Dynamic Background System
 *
 * A sophisticated WebGL-based particle system with:
 * - GPU-accelerated particle simulation
 * - Depth-of-field effects
 * - Reveal animations
 * - Interactive hover states
 * - Sparkle effects
 * - Post-processing vignette
 *
 * Usage:
 * ```tsx
 * import { DynamicBackground } from '@/components/background';
 *
 * <DynamicBackground
 *   hovering={isHovering}
 *   showControls={isDevelopment}
 *   speed={1.2}
 *   opacity={0.8}
 * />
 * ```
 */

export { DynamicBackground } from './DynamicBackground';
export { Particles } from './particles/Particles';
export { SimulationMaterial } from './shaders/simulationMaterial';
export { DofPointsMaterial } from './shaders/pointMaterial';
export { VignetteShader } from './shaders/vignetteShader';
export { ErrorBoundary } from './ErrorBoundary';
export * from './types';
