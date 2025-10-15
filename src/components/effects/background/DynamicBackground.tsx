'use client';

import { Canvas } from '@react-three/fiber';
import { Effects } from '@react-three/drei';
import { useControls } from 'leva';
import { Particles } from './particles/Particles';
import { VignetteShader } from './shaders/vignetteShader';
import { DynamicBackgroundProps, ParticleSystemConfig } from './types';
import { useEffect, useState } from 'react';

/**
 * DynamicBackground - Main component for the particle background system
 * Provides a sophisticated WebGL-based particle system with depth-of-field effects,
 * reveal animations, and interactive hover states
 */
export const DynamicBackground = ({
  hovering = false,
  showControls = false,
  className = '',
  ...props
}: DynamicBackgroundProps) => {
  // Detect mobile device and WebGL support
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setWebglSupported(!!gl);
      } catch {
        setWebglSupported(false);
      }
    };

    checkMobile();
    checkWebGL();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Default configuration for the particle system
  const defaultConfig: ParticleSystemConfig = {
    speed: isMobile ? 0.5 : 1.0, // Slower animation on mobile
    focus: 3.8,
    aperture: 1.79,
    size: isMobile ? 256 : 512, // Smaller particle grid on mobile
    noiseScale: 0.6,
    noiseIntensity: 0.52,
    timeScale: 1,
    pointSize: isMobile ? 6.0 : 10.0, // Smaller particles on mobile
    opacity: 0.8,
    planeScale: 10.0,
    vignetteDarkness: 1.5,
    vignetteOffset: 0.4,
    useManualTime: false,
    manualTime: 0,
  };

  // Merge default config with props
  const config = { ...defaultConfig, ...props };

  // Leva controls for real-time parameter adjustment (only in development)
  const controls = useControls(
    'Particle System',
    {
      speed: { value: config.speed, min: 0, max: 2, step: 0.01 },
      noiseScale: { value: config.noiseScale, min: 0.1, max: 5, step: 0.1 },
      noiseIntensity: {
        value: config.noiseIntensity,
        min: 0,
        max: 2,
        step: 0.01,
      },
      timeScale: { value: config.timeScale, min: 0, max: 2, step: 0.01 },
      focus: { value: config.focus, min: 0.1, max: 20, step: 0.1 },
      aperture: { value: config.aperture, min: 0, max: 2, step: 0.01 },
      pointSize: { value: config.pointSize, min: 0.1, max: 10, step: 0.1 },
      opacity: { value: config.opacity, min: 0, max: 1, step: 0.01 },
      planeScale: { value: config.planeScale, min: 0.1, max: 10, step: 0.1 },
      size: {
        value: config.size,
        options: [256, 512, 1024],
      },
      showDebugPlane: { value: false },
      vignetteDarkness: {
        value: config.vignetteDarkness,
        min: 0,
        max: 2,
        step: 0.1,
      },
      vignetteOffset: {
        value: config.vignetteOffset,
        min: 0,
        max: 2,
        step: 0.1,
      },
      useManualTime: { value: config.useManualTime },
      manualTime: { value: config.manualTime, min: 0, max: 50, step: 0.01 },
    },
    { collapsed: !showControls }
  );

  // Fallback for devices without WebGL support
  if (!webglSupported) {
    return (
      <div className={`fixed inset-0 w-full h-full ${className}`} id='webgl'>
        <div className='w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800' />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 w-full h-full ${className}`} id='webgl'>
      <Canvas
        camera={{
          position: [
            1.2629783123314589, 2.664606471394044, -1.8178993743288914,
          ],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // More conservative pixel ratio for mobile
        performance={{ min: 0.2 }} // Lower performance threshold for mobile
        gl={{
          antialias: false, // Disable antialiasing on mobile for better performance
          alpha: false,
          powerPreference: 'low-power', // Use integrated GPU on mobile
        }}>
        {/* Background color */}
        <color attach='background' args={['#000']} />

        {/* Main particle system */}
        <Particles
          speed={controls.speed}
          aperture={controls.aperture}
          focus={controls.focus}
          size={controls.size}
          noiseScale={controls.noiseScale}
          noiseIntensity={controls.noiseIntensity}
          timeScale={controls.timeScale}
          pointSize={controls.pointSize}
          opacity={controls.opacity}
          planeScale={controls.planeScale}
          useManualTime={controls.useManualTime}
          manualTime={controls.manualTime}
          introspect={hovering}
        />

        {/* Post-processing effects - disabled on mobile for better performance */}
        {!isMobile && (
          <Effects multisamping={0} disableGamma>
            <shaderPass
              args={[VignetteShader]}
              uniforms-darkness-value={controls.vignetteDarkness}
              uniforms-offset-value={controls.vignetteOffset}
            />
          </Effects>
        )}
      </Canvas>
    </div>
  );
};
