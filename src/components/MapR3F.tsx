import * as THREE from 'three'
import { type Object3D } from 'three'
import { Canvas } from "@react-three/fiber";
import { EARTH_RADIUS } from "../utils/geojson";
import { useEffect, useState } from "react";
import debounce from "debounce";
import { Countries } from './Countries';
import Globe from './Globe';
import Controls from './Controls';

const CAMERA_DISTANCE = EARTH_RADIUS * 3
const LIGHT_1_POS = [EARTH_RADIUS * 2, EARTH_RADIUS * 2, EARTH_RADIUS * 2]
const LIGHT_2_POS = [- EARTH_RADIUS * 2, - EARTH_RADIUS, - EARTH_RADIUS]

export default function App() {

  const [isSpinning, setIsSpinning] = useState(false)
  const [screen, setScreen] = useState<[number, number]>([0, 0])
  const [selected, setSelected] = useState<Object3D | null>(null)

  useEffect(() => {
    const updateScreen = () => {
      setScreen([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', debounce(updateScreen, 500))
    updateScreen()
  }, [])

  return (
    <Canvas
      camera={{
        fov: 45,
        near: 1,
        position: [0, 20, CAMERA_DISTANCE],
      }}
      frameloop='demand'
      onPointerMissed={() => {
        setSelected(null)
      }}
    >
      <color attach="background" args={['#1a1100']} />
      <Controls
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
        selected={selected}
      />
      <ambientLight intensity={0.2} />
      <pointLight position={LIGHT_1_POS} color="#ffffff" intensity={3.0} />
      <pointLight position={LIGHT_2_POS} color="#0xe54600" intensity={1.0} />
      <Globe
        screen={screen}
      />
      <Countries
        selected={selected}
        setSelected={setSelected}
      />
    </Canvas>
  );
}