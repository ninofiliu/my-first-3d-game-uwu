import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { PerspectiveCamera } from "@react-three/drei";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";

const MAP_SIZE = 10;

const presssed = {} as { [key: string]: boolean };

document.addEventListener("keydown", (evt) => (presssed[evt.key] = true));
document.addEventListener("keyup", (evt) => (presssed[evt.key] = false));

export const App = () => {
  const cam = useRef<PerspectiveCameraType>(null);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useFrame(() => {
    if (!cam.current) return;
    if (presssed.ArrowUp) setY(y + 0.01);
    if (presssed.ArrowRight) setX(x + 0.01);
    if (presssed.ArrowDown) setY(y - 0.01);
    if (presssed.ArrowLeft) setX(x - 0.01);
  });

  return (
    <>
      <mesh>
        <planeGeometry
          args={[MAP_SIZE + 1, MAP_SIZE + 1, MAP_SIZE + 1, MAP_SIZE + 1]}
        />
        <meshStandardMaterial color="white" wireframe />
      </mesh>

      <ambientLight />

      <PerspectiveCamera ref={cam} makeDefault position={[x, y, 2]} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} />
      </EffectComposer>
    </>
  );
};
