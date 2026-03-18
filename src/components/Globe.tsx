import * as THREE from 'three'
import { SCREEN_WIDTH_LG } from "../utils/constants"
import { EARTH_RADIUS } from "../utils/geojson"
import { useCubeTexture } from '@react-three/drei'
import { Suspense } from 'react'

const GlossyMaterial: React.FC = () => {
  let envMap = null
  envMap = useCubeTexture(
    [
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ],
    {
      path: 'milky-way-cube-map/',
    }
  )

  return (
    <meshPhysicalMaterial
      color="#bb9900"
      roughness={0.75}
      metalness={1}
      thickness={15}
      clearcoat={1.0}
      clearcoatRoughness={0.0}
      ior={1.5}
      transparent
      opacity={0.5}
      side={THREE.DoubleSide}
      envMap={envMap}
      envMapIntensity={0.5}
    />
  )
}

export default function Globe({
  screen,
} : {
  screen: [number, number],
}) {

  return (
    <>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        {screen[0] < SCREEN_WIDTH_LG ? (
          <meshBasicMaterial color="#000000" />
        ) : (
          <Suspense fallback={<meshBasicMaterial color="#000000" />}>
            <GlossyMaterial />
          </Suspense>
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

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.005, 64, 64]} />
        <meshStandardMaterial
          color="#bb9900"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}