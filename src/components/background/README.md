# Dynamic Background System

A sophisticated WebGL-based particle system built with Three.js and React Three Fiber, featuring GPU-accelerated particle simulation, depth-of-field effects, reveal animations, and interactive hover states.

## Features

- **GPU-Accelerated Simulation**: Uses Frame Buffer Objects (FBO) for high-performance particle position calculation
- **Depth-of-Field Effects**: Realistic focus/blur simulation with configurable aperture and focus distance
- **Reveal Animations**: Smooth particle reveal from center outward with easing
- **Interactive Hover States**: Dynamic transitions when hovering over elements
- **Sparkle Effects**: Subtle per-particle brightness variations for visual richness
- **Post-Processing**: Vignette effect for enhanced visual appeal
- **Responsive Design**: Adapts to different screen sizes and pixel densities
- **Error Boundaries**: Graceful fallback when WebGL is not available

## Architecture

```
src/components/background/
├── DynamicBackground.tsx      # Main component with Leva controls
├── particles/
│   └── Particles.tsx          # Core particle system
├── shaders/
│   ├── simulationMaterial.ts  # GPU particle position simulation
│   ├── pointMaterial.ts       # Depth-of-field rendering
│   ├── vignetteShader.ts      # Post-processing vignette
│   └── utils.ts               # GLSL utility functions
├── ErrorBoundary.tsx          # Error handling
├── types.ts                   # TypeScript definitions
└── index.ts                   # Exports
```

## Usage

### Basic Usage

```tsx
import { DynamicBackground } from '@/components/background';

function MyPage() {
  return (
    <div className='relative min-h-screen'>
      <DynamicBackground />
      <div className='relative z-10'>{/* Your content here */}</div>
    </div>
  );
}
```

### Advanced Usage with Controls

```tsx
import { DynamicBackground } from '@/components/background';
import { useState } from 'react';

function MyPage() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className='relative min-h-screen'>
      <DynamicBackground
        hovering={isHovering}
        showControls={process.env.NODE_ENV === 'development'}
        speed={1.2}
        opacity={0.8}
        pointSize={8.0}
        focus={4.0}
        aperture={1.5}
      />

      <div className='relative z-10'>
        <button
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
          Hover me for particle effects!
        </button>
      </div>
    </div>
  );
}
```

### With Error Boundary

```tsx
import { DynamicBackground, ErrorBoundary } from '@/components/background';

function MyPage() {
  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>
      <div className='relative z-10'>{/* Your content here */}</div>
    </div>
  );
}
```

## Configuration Options

| Prop               | Type                 | Default | Description                                                       |
| ------------------ | -------------------- | ------- | ----------------------------------------------------------------- |
| `hovering`         | `boolean`            | `false` | Whether the background is being hovered (for interactive effects) |
| `showControls`     | `boolean`            | `false` | Show Leva development controls                                    |
| `speed`            | `number`             | `1.0`   | Animation speed multiplier                                        |
| `focus`            | `number`             | `3.8`   | Focus distance for depth-of-field                                 |
| `aperture`         | `number`             | `1.79`  | Aperture size for blur effect                                     |
| `size`             | `256 \| 512 \| 1024` | `512`   | Particle grid resolution                                          |
| `noiseScale`       | `number`             | `0.6`   | Scale of noise input                                              |
| `noiseIntensity`   | `number`             | `0.52`  | Intensity of particle displacement                                |
| `timeScale`        | `number`             | `1`     | Time scale multiplier                                             |
| `pointSize`        | `number`             | `10.0`  | Size of individual particles                                      |
| `opacity`          | `number`             | `0.8`   | Overall opacity of the system                                     |
| `planeScale`       | `number`             | `10.0`  | Scale of the particle plane                                       |
| `vignetteDarkness` | `number`             | `1.5`   | Darkness of vignette effect                                       |
| `vignetteOffset`   | `number`             | `0.4`   | Offset of vignette effect                                         |

## Performance Considerations

- **Particle Count**: Higher `size` values (1024) create more particles but impact performance
- **Pixel Ratio**: Automatically limited to [1, 2] for better performance
- **Adaptive Performance**: Canvas automatically adjusts quality based on frame rate
- **Mobile Optimization**: Consider using lower `size` values on mobile devices

## Browser Support

- **WebGL 1.0**: Required for particle simulation
- **WebGL 2.0**: Recommended for best performance
- **Fallback**: Error boundary provides graceful degradation

## Development

The system includes Leva controls for real-time parameter adjustment during development. Enable them by setting `showControls={true}`.

## Dependencies

- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers and abstractions
- `leva` - Development controls
- `maath` - Math utilities for easing

## License

Part of the HonorarX Invoice Management System.
