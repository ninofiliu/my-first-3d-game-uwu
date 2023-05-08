import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { x } from "./shorts";

export const App = () => {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    x(mesh.current).rotation.x += delta;
  });
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={mesh}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
};
