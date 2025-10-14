import * as THREE from 'three';
import { useMemo, useState, useRef } from 'react';
import { createPortal, useFrame } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';

import { DofPointsMaterial } from '../shaders/pointMaterial';
import { SimulationMaterial } from '../shaders/simulationMaterial';
import * as easing from 'maath/easing';
import { ParticlesProps } from '../types';

/**
 * Particles - Core particle system component
 * Handles dual-pass rendering: simulation pass + rendering pass
 * Features reveal animations, interactive hover effects, and sparkle animations
 */
export function Particles({
  speed,
  aperture,
  focus,
  size = 512,
  noiseScale = 1.0,
  noiseIntensity = 0.5,
  timeScale = 0.5,
  pointSize = 2.0,
  opacity = 1.0,
  planeScale = 1.0,
  useManualTime = false,
  manualTime = 0,
  introspect = false,
  ...props
}: ParticlesProps) {
  // Reveal animation state
  const revealStartTime = useRef<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(true);
  const revealDuration = 3.5; // seconds

  // Create simulation material with scale parameter
  const simulationMaterial = useMemo(() => {
    return new SimulationMaterial(planeScale);
  }, [planeScale]);

  // Frame Buffer Object for GPU-based particle position simulation
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  // Depth-of-field points material
  const dofPointsMaterial = useMemo(() => {
    const m = new DofPointsMaterial();
    m.uniforms.positions.value = target.texture;
    m.uniforms.initialPositions.value =
      simulationMaterial.uniforms.positions.value;
    return m;
  }, [simulationMaterial]);

  // Orthographic camera for simulation pass
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  );

  // Quad geometry for simulation pass
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );

  // Generate particle positions
  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  // Animation frame loop
  useFrame((state, delta) => {
    if (!dofPointsMaterial || !simulationMaterial) return;

    // Render simulation pass to FBO
    state.gl.setRenderTarget(target);
    state.gl.clear();
    // @ts-ignore
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);

    // Use manual time if enabled, otherwise use elapsed time
    const currentTime = useManualTime ? manualTime : state.clock.elapsedTime;

    // Initialize reveal start time on first frame
    if (revealStartTime.current === null) {
      revealStartTime.current = currentTime;
    }

    // Calculate reveal progress
    const revealElapsed = currentTime - revealStartTime.current;
    const revealProgress = Math.min(revealElapsed / revealDuration, 1.0);

    // Ease out the reveal animation
    const easedProgress = 1 - Math.pow(1 - revealProgress, 3);

    // Map progress to reveal factor (0 = fully hidden, higher values = more revealed)
    const revealFactor = easedProgress * 4.0; // Doubled the radius for larger coverage

    if (revealProgress >= 1.0 && isRevealing) {
      setIsRevealing(false);
    }

    // Update depth-of-field material uniforms
    dofPointsMaterial.uniforms.uTime.value = currentTime;
    dofPointsMaterial.uniforms.uFocus.value = focus;
    dofPointsMaterial.uniforms.uBlur.value = aperture;

    // Smooth transition for hover effects
    easing.damp(
      dofPointsMaterial.uniforms.uTransition,
      'value',
      introspect ? 1.0 : 0.0,
      introspect ? 0.35 : 0.2,
      delta
    );

    // Update simulation material uniforms
    simulationMaterial.uniforms.uTime.value = currentTime;
    simulationMaterial.uniforms.uNoiseScale.value = noiseScale;
    simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity;
    simulationMaterial.uniforms.uTimeScale.value = timeScale * speed;

    // Update point material uniforms
    dofPointsMaterial.uniforms.uPointSize.value = pointSize;
    dofPointsMaterial.uniforms.uOpacity.value = opacity;
    dofPointsMaterial.uniforms.uRevealFactor.value = revealFactor;
    dofPointsMaterial.uniforms.uRevealProgress.value = easedProgress;
  });

  return (
    <>
      {/* Simulation pass - renders particle positions to FBO */}
      {createPortal(
        // @ts-ignore
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              args={[positions, 3]}
            />
            <bufferAttribute attach='attributes-uv' args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        // @ts-ignore
        scene
      )}

      {/* Main particle system - renders using FBO texture */}
      {/* @ts-ignore */}
      <points material={dofPointsMaterial} {...props}>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' args={[particles, 3]} />
        </bufferGeometry>
      </points>

      {/* Plane showing simulation texture */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={target.texture} />
      </mesh> */}
    </>
  );
}
