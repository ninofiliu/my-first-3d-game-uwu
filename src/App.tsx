import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Environment, PointerLockControls } from "@react-three/drei";
import type { Mesh, Raycaster } from "three";
import { Vector2 } from "three";
import { Vector3 } from "three";
import type { PointerLockControls as PointerLockControlsType } from "three-stdlib/controls/PointerLockControls";
import { x } from "./shorts";
import { KernelSize } from "postprocessing";

const SPEED = 0.2;
const SIZE = 20;

const rpos = () =>
  new Vector3(
    SIZE * (-0.5 + Math.random()),
    SIZE * (-0.5 + Math.random()),
    SIZE * (-0.5 + Math.random())
  );

const pressed = {} as { [key: string]: boolean };
document.addEventListener("keydown", (evt) => (pressed[evt.code] = true));
document.addEventListener("keyup", (evt) => (pressed[evt.code] = false));

export const App = () => {
  const controls = useRef<PointerLockControlsType>(null);
  const raycaster = useRef<Raycaster>(null);

  const [boxes, setBoxes] = useState(
    Array(10)
      .fill(null)
      .map((_, key) => ({
        ref: null as null | Mesh,
        key,
        pointed: false,
        position: rpos(),
      }))
  );

  useFrame(() => {
    if (!controls.current || !raycaster.current) return;
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
    for (const box of boxes) box.pointed = false;
    const intersections = raycaster.current.intersectObjects(
      boxes.map((box) => x(box.ref))
    );
    for (const { object } of intersections) {
      for (const box of boxes) if (box.ref === object) box.pointed = true;
    }

    if (pressed.Space) {
      for (const box of boxes) {
        if (box.pointed) {
          box.position = rpos();
        }
      }
    }

    setBoxes([...boxes]);
  });

  return (
    <>
      {boxes.map((box) => (
        <mesh
          key={box.key}
          ref={(ref) => (box.ref = ref)}
          position={box.position}
        >
          <sphereGeometry args={[1, 4, 2]} />
          <meshStandardMaterial
            color={box.pointed ? "yellow" : "lime"}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
      ))}

      <ambientLight />
      <hemisphereLight />
      <Environment preset="forest" background />

      <PointerLockControls pointerSpeed={1} ref={controls} />
      <raycaster ref={raycaster} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.05} kernelSize={KernelSize.LARGE} />
      </EffectComposer>
    </>
  );
};
