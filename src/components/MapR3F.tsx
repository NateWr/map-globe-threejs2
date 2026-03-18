import * as THREE from 'three'
import { type Object3D } from 'three'
import { Canvas } from "@react-three/fiber";
import { EARTH_RADIUS } from "../utils/geojson";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import debounce from "debounce";
import { CountriesModel } from './CountriesModel';

const CAMERA_DISTANCE = EARTH_RADIUS * 3
const LIGHT_1_POS = [EARTH_RADIUS * 2, EARTH_RADIUS * 2, EARTH_RADIUS * 2]
const LIGHT_2_POS = [- EARTH_RADIUS * 2, - EARTH_RADIUS, - EARTH_RADIUS]
const SCREEN_WIDTH_LG = 1200

export default function App() {

  const [screen, setScreen] = useState([0, 0])
  const [selected, setSelected] = useState<Object3D>(null)

  useEffect(() => {
    const updateScreen = () => {
      setScreen([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', debounce(updateScreen, 500))
    updateScreen()
  }, [])

  // useEffect(() => {
  //   console.log(selected)
  // }, [selected])

  return (
    <Canvas
      camera={{
        fov: 45,
        near: 1,
        position: [0, 20, CAMERA_DISTANCE],
      }}
      frameloop='demand'
    >
      <color attach="background" args={['#1a1100']} />

      <OrbitControls
        enableDamping={true}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={1}
        maxPolarAngle={1.8}
      />

      <ambientLight intensity={0.2} />
      <pointLight position={LIGHT_1_POS} color="#ffffff" intensity={3.0} />
      <pointLight position={LIGHT_2_POS} color="#0xe54600" intensity={1.0} />

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        {screen[0] < SCREEN_WIDTH_LG ? (
          <meshBasicMaterial color={'#000000'} />
        ) : (
          <meshPhysicalMaterial
            color={0xbb9900}
            roughness={0.75}
            metalness={1}
            thickness={15}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            ior={1.5}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.05, 32, 32]} />
        <meshBasicMaterial
          color="#ffea00"
          wireframe
          transparent
          opacity={0.035}
        />
      </mesh>

      <CountriesModel
        selected={selected}
        setSelected={setSelected}
      />
    </Canvas>
  );
}