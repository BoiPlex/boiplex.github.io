"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import * as THREE from "three";

function updateWaves(geometry: THREE.BufferGeometry, time: number) {
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const wave =
      Math.sin(y * 0.48 - time * 1.25) * 0.34 +
      Math.sin(x * 0.72 + y * 0.18 + time * 0.8) * 0.18 +
      Math.cos(x * 0.35 - y * 0.28 - time * 0.55) * 0.12;

    positions.setZ(index, wave * 1);
  }

  positions.needsUpdate = true;
}

function PolygonOcean() {
  const surface = useRef<THREE.Mesh>(null!);
  const wireframe = useRef<THREE.Mesh>(null!);

  useFrame(({ clock, camera }, delta) => {
    const time = clock.elapsedTime;
    updateWaves(surface.current.geometry, time);
    updateWaves(wireframe.current.geometry, time);
    surface.current.geometry.computeVertexNormals();

    const cameraX = Math.sin(time * 0.18) * 5.8;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      cameraX,
      1.2,
      delta,
    );
    camera.lookAt(camera.position.x * 0.15, -0.5, -8);
  });

  return (
    <group
      position={[0, -1.3, -10]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <mesh ref={surface}>
        <planeGeometry args={[40, 34, 34, 58]} />
        <meshStandardMaterial
          color="#063d68"
          emissive="#021c38"
          roughness={0.4}
          metalness={0.25}
          flatShading
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wireframe} position={[0, 0, 0.012]}>
        <planeGeometry args={[40, 34, 34, 58]} />
        <meshBasicMaterial
          color="#42d9ff"
          wireframe
          transparent
          opacity={0.72}
        />
      </mesh>
    </group>
  );
}

function Scanner() {
  const beam = useRef<THREE.Mesh>(null!);
  const material = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(({ clock }) => {
    beam.current.position.z = 5 - ((clock.elapsedTime * 5) % 31);
    material.current.opacity =
      0.35 + Math.sin(clock.elapsedTime * 5) * 0.15;
  });

  return (
    <mesh ref={beam} position={[0, -0.48, 4]}>
      <boxGeometry args={[36, 0.018, 0.08]} />
      <meshBasicMaterial
        ref={material}
        color="#a8efff"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function TheMatrix() {
  const path = usePathname();
  const isRoot = path === "/";

  if (!isRoot) {
    return;
  }

  return (
    <div className="absolute -z-1 h-full w-full overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 2.5, 6.5], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#010a16"]} />
        <fog attach="fog" args={["#010a16", 8, 29]} />
        <ambientLight intensity={0.8} color="#5ecbff" />
        <directionalLight position={[-3, 6, 4]} intensity={2.4} color="#bcefff" />
        <PolygonOcean />
        <Scanner />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,transparent_25%,rgba(0,5,15,0.8)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cyan-200/50 shadow-[0_0_20px_4px_rgba(34,211,238,0.35)]" />
    </div>
  );
}
