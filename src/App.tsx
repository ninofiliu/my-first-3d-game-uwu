import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Environment, PointerLockControls } from "@react-three/drei";
import type { Mesh, Raycaster } from "three";
import { Vector2 } from "three";
import { Vector3 } from "three";
import type { PointerLockControls as PointerLockControlsType } from "three-stdlib/controls/PointerLockControls";

const SPEED = 0.05;

const pressed = {} as { [key: string]: boolean };
document.addEventListener("keydown", (evt) => (pressed[evt.code] = true));
document.addEventListener("keyup", (evt) => (pressed[evt.code] = false));

export const App = () => {
  const controls = useRef<PointerLockControlsType>(null);
  const raycaster = useRef<Raycaster>(null);
  const box = useRef<Mesh>(null);
  const [pointed, setPointed] = useState(false);

  useFrame(() => {
    if (!controls.current || !raycaster.current || !box.current) return;
    const d = new Vector3(0, 0, 0);
    if (pressed.KeyQ) d.y += SPEED;
    if (pressed.KeyW) d.z -= SPEED;
    if (pressed.KeyE) d.y -= SPEED;
    if (pressed.KeyD) d.x += SPEED;
    if (pressed.KeyS) d.z += SPEED;
    if (pressed.KeyA) d.x -= SPEED;
    d.applyEuler(controls.current.camera.rotation);
    controls.current.camera.position.add(d);

    raycaster.current.setFromCamera(new Vector2(0, 0), controls.current.camera);
    setPointed(!!raycaster.current.intersectObject(box.current).length);
  });

  return (
    <>
      <mesh ref={box}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={pointed ? "red" : "white"} />
      </mesh>

      <axesHelper />

      <ambientLight />
      <hemisphereLight />
      <Environment preset="dawn" />

      <PointerLockControls pointerSpeed={1} ref={controls} />
      <raycaster ref={raycaster} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} />
      </EffectComposer>
    </>
  );
};
