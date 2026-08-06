/**
 * The one signature 3D moment: a stack of translucent "page" planes that settle
 * on load and compress into a single glowing card as the hero scrolls away.
 * R3F + drei only. Neutral glass materials; Action Blue used as a rim light only.
 */
import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PAGE_COUNT = 7;
const ACTION_BLUE = "#0066cc";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function Pages({
  scrollRef,
  animate,
}: {
  scrollRef: { current: number };
  animate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pages = useRef<THREE.Mesh[]>([]);
  const elapsed = useRef(animate ? 0 : 3);

  const geometry = useMemo(() => new THREE.BoxGeometry(2.1, 2.85, 0.035), []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const intro = Math.min(1, elapsed.current / 1.6);
    const settle = easeOutCubic(intro);
    const collapse = Math.min(1, Math.max(0, scrollRef.current));

    pages.current.forEach((mesh, index) => {
      if (!mesh) return;
      const stagger = Math.max(0, Math.min(1, (intro - index * 0.06) / 0.7));
      const appear = easeOutCubic(stagger);
      const spread = 0.26 * (1 - collapse);
      const target = (index - (PAGE_COUNT - 1) / 2) * spread;
      mesh.position.y = target + (1 - appear) * 1.6;
      mesh.position.x = (index - (PAGE_COUNT - 1) / 2) * 0.05 * (1 - collapse);
      mesh.rotation.z = (1 - collapse) * (index % 2 === 0 ? 0.02 : -0.02);
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.opacity = appear * (index === PAGE_COUNT - 1 ? 1 : 1 - collapse * 0.55);
    });

    if (group.current) {
      const idle = animate ? Math.sin(elapsed.current * 0.25) * 0.09 : 0;
      group.current.rotation.y = -0.5 + settle * 0.5 + idle - collapse * 0.35;
      group.current.rotation.x = 0.26 - collapse * 0.2;
      group.current.position.y = -0.2 * collapse;
      group.current.scale.setScalar(0.94 + settle * 0.06 + collapse * 0.06);
    }
  });

  return (
    <group ref={group} rotation={[0.26, -0.5, 0]}>
      {Array.from({ length: PAGE_COUNT }).map((_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) pages.current[index] = mesh;
          }}
          geometry={geometry}
          castShadow
        >
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            transmission={0.82}
            thickness={0.6}
            roughness={0.18}
            metalness={0}
            ior={1.42}
            clearcoat={1}
            clearcoatRoughness={0.12}
            reflectivity={0.4}
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene({
  scrollRef,
  animate,
}: {
  scrollRef: { current: number };
  animate: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={animate ? "always" : "demand"}
      camera={{ position: [0, 0.2, 6.2], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#fafafc"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-4, -1, -2]} intensity={0.4} color="#ffffff" />
      {/* the single Action Blue accent in the scene: a rim light, never a body color */}
      <spotLight
        position={[-3.4, 1.4, 2.6]}
        angle={0.7}
        penumbra={1}
        intensity={18}
        color={ACTION_BLUE}
      />
      <Environment resolution={128}>
        <Lightformer intensity={1.2} position={[0, 3, 2]} scale={[6, 3, 1]} color="#ffffff" />
        <Lightformer intensity={0.6} position={[-3, 0, 2]} scale={[3, 4, 1]} color="#ffffff" />
        <Lightformer intensity={0.4} position={[3, -1, 1]} scale={[3, 4, 1]} color="#f5f5f7" />
      </Environment>
      <Pages scrollRef={scrollRef} animate={animate} />
    </Canvas>
  );
}
