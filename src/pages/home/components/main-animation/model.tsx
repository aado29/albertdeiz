import { ReactElement, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { a as three } from "@react-spring/three";

import type { GroupProps } from "@react-three/fiber";
import type { Interpolation } from "@react-spring/core";
import type { Group, Object3DEventMap } from "three";

interface ModelProps extends GroupProps {
  open: boolean;
  hinge: Interpolation<number, number>;
}

export function Model({ open, hinge, ...props }: ModelProps): ReactElement {
  const groupRef = useRef<Group<Object3DEventMap>>(null);
  // Load model
  const { nodes, materials } = useGLTF("./models/mac-draco.glb");
  // Take care of cursor state on hover
  const [hovered, setHovered] = useState(false);
  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered]
  );
  // Make it float in the air when it's opened
  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      open ? Math.cos(t / 10) / 10 + 0.25 : 0,
      0.1
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      open ? Math.sin(t / 10) / 4 : 0,
      0.1
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      open ? Math.sin(t / 10) / 10 : 0,
      0.1
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      open ? (-2 + Math.sin(t)) / 3 : -4.3,
      0.1
    );
  });
  // The view was auto-generated by: https://github.com/pmndrs/gltfjsx
  // Events and spring animations were added afterwards
  return (
    <group
      ref={groupRef}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    >
      <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            material={materials.aluminium}
            geometry={
              nodes["Cube008"] instanceof THREE.Mesh
                ? nodes["Cube008"].geometry
                : undefined
            }
          />
          <mesh
            material={materials["matte.001"]}
            geometry={
              nodes["Cube008_1"] instanceof THREE.Mesh
                ? nodes["Cube008_1"].geometry
                : undefined
            }
          />
          <mesh
            material={materials["screen.001"]}
            geometry={
              nodes["Cube008_2"] instanceof THREE.Mesh
                ? nodes["Cube008_2"].geometry
                : undefined
            }
          />
        </group>
      </three.group>
      <mesh
        material={materials.keys}
        geometry={
          nodes.keyboard instanceof THREE.Mesh
            ? nodes.keyboard.geometry
            : undefined
        }
        position={[1.79, 0, 3.45]}
      />
      <group position={[0, -0.1, 3.39]}>
        <mesh
          material={materials.aluminium}
          geometry={
            nodes["Cube002"] instanceof THREE.Mesh
              ? nodes["Cube002"].geometry
              : undefined
          }
        />
        <mesh
          material={materials.trackpad}
          geometry={
            nodes["Cube002_1"] instanceof THREE.Mesh
              ? nodes["Cube002_1"].geometry
              : undefined
          }
        />
      </group>
      <mesh
        material={materials.touchbar}
        geometry={
          nodes.touchbar instanceof THREE.Mesh
            ? nodes.touchbar.geometry
            : undefined
        }
        position={[0, -0.03, 1.2]}
      />
    </group>
  );
}