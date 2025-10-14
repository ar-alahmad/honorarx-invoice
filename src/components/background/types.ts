/**
 * TypeScript definitions for the dynamic background system
 */

export interface DynamicBackgroundProps {
  /** Whether the background is currently being hovered (for interactive effects) */
  hovering?: boolean;
  /** Speed multiplier for particle animation */
  speed?: number;
  /** Focus distance for depth-of-field effect */
  focus?: number;
  /** Aperture size for depth-of-field blur */
  aperture?: number;
  /** Size of the particle grid (256, 512, or 1024) */
  size?: 256 | 512 | 1024;
  /** Scale of noise input for particle movement */
  noiseScale?: number;
  /** Intensity of noise displacement */
  noiseIntensity?: number;
  /** Time scale multiplier for animation speed */
  timeScale?: number;
  /** Size of individual particles */
  pointSize?: number;
  /** Opacity of the particle system */
  opacity?: number;
  /** Scale of the particle plane */
  planeScale?: number;
  /** Darkness of the vignette effect */
  vignetteDarkness?: number;
  /** Offset of the vignette effect */
  vignetteOffset?: number;
  /** Whether to use manual time control */
  useManualTime?: boolean;
  /** Manual time value (when useManualTime is true) */
  manualTime?: number;
  /** Whether to show debug controls */
  showControls?: boolean;
  /** Custom className for styling */
  className?: string;
}

export interface ParticleSystemConfig {
  speed: number;
  focus: number;
  aperture: number;
  size: 256 | 512 | 1024;
  noiseScale: number;
  noiseIntensity: number;
  timeScale: number;
  pointSize: number;
  opacity: number;
  planeScale: number;
  vignetteDarkness: number;
  vignetteOffset: number;
  useManualTime: boolean;
  manualTime: number;
}

export interface ParticlesProps {
  speed: number;
  aperture: number;
  focus: number;
  size: number;
  noiseScale?: number;
  noiseIntensity?: number;
  timeScale?: number;
  pointSize?: number;
  opacity?: number;
  planeScale?: number;
  useManualTime?: boolean;
  manualTime?: number;
  introspect?: boolean;
}
