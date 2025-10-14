# HonorarX Invoice

Professional invoice management system with stunning visual experiences.

## Features

- **Dynamic Particle Background**: Sophisticated WebGL-based particle system
- **Modern Tech Stack**: Next.js 15.5.5, React 19.1.0, TypeScript, Tailwind CSS
- **Interactive UI**: Hover effects and smooth animations
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dynamic Background System

The project includes a reusable dynamic background system that can be used on any page:

```tsx
import { DynamicBackground } from '@/components/background';

export default function MyPage() {
  return (
    <div className='relative min-h-screen'>
      <DynamicBackground />
      <div className='relative z-10'>{/* Your content here */}</div>
    </div>
  );
}
```

## Tech Stack

- **Framework**: Next.js 15.5.5 with App Router
- **UI**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS 4.1.14
- **3D Graphics**: Three.js with React Three Fiber
- **Fonts**: Geist font family

## Development

The project includes development tools:

- **Leva Controls**: Real-time parameter adjustment
- **Performance Monitor**: WebGL performance tracking
- **Error Boundaries**: Graceful fallbacks for WebGL issues

## License

Private project - HonorarX Invoice Management System.
