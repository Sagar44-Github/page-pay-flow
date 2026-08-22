import { Float, MeshDistortMaterial, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

function PaymentOrb() {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.15;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.22;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} scale={1.35}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#44ffa4"
          emissive="#9281f7"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.6}
          distort={0.35}
          speed={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#44ffa4" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#9281f7" />
      <Stars radius={40} depth={30} count={1200} factor={3} fade speed={0.5} />
      <PaymentOrb />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

export function HeroScene({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} aria-hidden />;
  }

  return (
    <div className={className} aria-hidden>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
