"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PALETTES = [
  { core: "#fff1c7", glow: "#ff5c7a", edge: "#5cf2ff" },
  { core: "#e8ddff", glow: "#9d66ff", edge: "#72f1b8" },
  { core: "#d9fff5", glow: "#19d3ae", edge: "#ffca58" },
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function ParticleHalo({ color }: { color: string }) {
  const points = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const result = new Float32Array(220 * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < 220; index += 1) {
      const y = 1 - (index / 219) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;
      const distance = 3.15 + 0.38 * Math.sin(index * 12.9898);
      result[index * 3] = Math.cos(angle) * radius * distance;
      result[index * 3 + 1] = y * distance;
      result[index * 3 + 2] = Math.sin(angle) * radius * distance;
    }

    return result;
  }, []);

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.025;
    points.current.rotation.x -= delta * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.026}
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Orbit({
  radius,
  tilt,
  speed,
  color,
  offset,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  offset: number;
}) {
  const satellite = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const angle = clock.elapsedTime * speed + offset;
    satellite.current.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0,
    );
    satellite.current.rotation.x = angle * 1.7;
    satellite.current.rotation.y = angle * 2.1;
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 6, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={satellite}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={3}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function EnergyCore() {
  const root = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const shell = useRef<THREE.Mesh>(null!);
  const impulse = useRef(0);
  const reducedMotion = useReducedMotion();
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const palette = PALETTES[paletteIndex];

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const motion = reducedMotion ? 0.15 : 1;
    const targetX = state.pointer.y * 0.22;
    const targetY = state.pointer.x * 0.32;

    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      targetX,
      4,
      delta,
    );
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      targetY + time * 0.08 * motion,
      4,
      delta,
    );
    root.current.position.y = Math.sin(time * 0.9) * 0.12 * motion;
    core.current.rotation.x += delta * 0.16 * motion;
    core.current.rotation.z -= delta * 0.11 * motion;
    shell.current.rotation.x -= delta * 0.1 * motion;
    shell.current.rotation.y += delta * 0.18 * motion;

    impulse.current = THREE.MathUtils.damp(impulse.current, 0, 3.5, delta);
    const pulse =
      1 + Math.sin(time * 1.8) * 0.025 * motion + impulse.current;
    core.current.scale.setScalar(pulse);
  });

  const cyclePalette = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    impulse.current = 0.22;
    setPaletteIndex((current) => (current + 1) % PALETTES.length);
  };

  return (
    <group ref={root}>
      <ParticleHalo color={palette.edge} />
      <group
        onClick={cyclePalette}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={core}>
          <icosahedronGeometry args={[1.12, 2]} />
          <meshPhysicalMaterial
            color={palette.core}
            emissive={palette.glow}
            emissiveIntensity={hovered ? 1.45 : 0.85}
            metalness={0.25}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
        <mesh ref={shell} scale={1.27}>
          <icosahedronGeometry args={[1.12, 1]} />
          <meshBasicMaterial
            color={palette.edge}
            wireframe
            transparent
            opacity={hovered ? 0.72 : 0.34}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      <Orbit
        radius={1.85}
        tilt={[Math.PI / 2.8, 0.15, 0.25]}
        speed={0.72}
        color={palette.glow}
        offset={0}
      />
      <Orbit
        radius={2.25}
        tilt={[Math.PI / 2.15, -0.4, -0.55]}
        speed={-0.48}
        color={palette.edge}
        offset={2.2}
      />
      <Orbit
        radius={2.62}
        tilt={[Math.PI / 1.75, 0.35, 0.7]}
        speed={0.32}
        color={palette.core}
        offset={4.1}
      />
    </group>
  );
}

export default function FloatingThing() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#18194a_0%,#090a20_48%,#03040d_100%)]">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 3, 4]} intensity={42} color="#80eaff" />
        <pointLight position={[-3, -2, 3]} intensity={34} color="#ff477e" />
        <EnergyCore />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[10px] tracking-[0.32em] text-white/45 uppercase">
        Move your cursor · click to shift
      </div>
    </div>
  );
}
