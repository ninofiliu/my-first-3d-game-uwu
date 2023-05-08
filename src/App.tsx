import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Environment, PointerLockControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { PointerLockControls as PointerLockControlsType } from "three-stdlib/controls/PointerLockControls";
import { KernelSize } from "postprocessing";

const SPEED = 0.05;

const pressed = {} as { [key: string]: boolean };
document.addEventListener("keydown", (evt) => (pressed[evt.code] = true));
document.addEventListener("keyup", (evt) => (pressed[evt.code] = false));

export const App = () => {
  const controls = useRef<PointerLockControlsType>(null);

  useFrame(() => {
    if (!controls.current) return;
    const d = new Vector3(0, 0, 0);
    if (pressed.KeyQ) d.y += SPEED;
    if (pressed.KeyW) d.z -= SPEED;
    if (pressed.KeyE) d.y -= SPEED;
    if (pressed.KeyD) d.x += SPEED;
    if (pressed.KeyS) d.z += SPEED;
    if (pressed.KeyA) d.x -= SPEED;
    d.applyEuler(controls.current.camera.rotation);
    controls.current.camera.position.add(d);
  });

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 32]} />
        <meshStandardMaterial roughness={0} metalness={1} />
      </mesh>

      <mesh>
        <boxGeometry args={[20, 20, 20, 20, 20, 20]} />
        <meshBasicMaterial wireframe color={"lime"} />
      </mesh>

      <axesHelper />

      <ambientLight />
      <hemisphereLight />
      <Environment preset="dawn" background />

      <PointerLockControls pointerSpeed={1} ref={controls} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.9}
          intensity={0.2}
          kernelSize={KernelSize.LARGE}
        />
      </EffectComposer>
    </>
  );
};
