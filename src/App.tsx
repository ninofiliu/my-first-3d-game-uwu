import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { PerspectiveCamera } from "@react-three/drei";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import { Euler } from "three";
import { Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils.js";

const MAP_SIZE = 11;
const FORWARD_SPEED = 0.05;
const ROTATION_SPEED = 0.03;

const presssed = {} as { [key: string]: boolean };

document.addEventListener("keydown", (evt) => (presssed[evt.key] = true));
document.addEventListener("keyup", (evt) => (presssed[evt.key] = false));

export const App = () => {
  const cam = useRef<PerspectiveCameraType>(null);

  const [position, setPosition] = useState(new Vector3(0, 0, 0.5));
  const [rotation, setRotation] = useState(new Euler(Math.PI / 2, 0, 0));

  useFrame(() => {
    if (!cam.current) return;

    const d = new Vector3(0, 0, -FORWARD_SPEED);
    d.applyEuler(rotation);
    if (presssed.z || presssed.ArrowUp) position.add(d);
    if (presssed.d || presssed.ArrowRight) rotation.y -= ROTATION_SPEED;
    if (presssed.s || presssed.ArrowDown) position.sub(d);
    if (presssed.q || presssed.ArrowLeft) rotation.y += ROTATION_SPEED;

    position.x = clamp(position.x, -MAP_SIZE / 2, MAP_SIZE / 2);
    position.y = clamp(position.y, -MAP_SIZE / 2, MAP_SIZE / 2);

    setPosition(position.clone());
    setRotation(rotation.clone());
  });

  return (
    <>
      <mesh>
        <planeGeometry args={[MAP_SIZE, MAP_SIZE, MAP_SIZE, MAP_SIZE]} />
        <meshStandardMaterial color="white" wireframe />
      </mesh>

      <ambientLight />

      <PerspectiveCamera
        ref={cam}
        makeDefault
        position={position}
        rotation={rotation}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} />
      </EffectComposer>
    </>
  );
};
