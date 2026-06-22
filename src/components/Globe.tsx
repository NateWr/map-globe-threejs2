import * as THREE from 'three'
import { SCREEN_WIDTH_LG } from "../utils/constants"
import { EARTH_RADIUS } from "../utils/geojson"
import { useCubeTexture } from '@react-three/drei'
import { Suspense } from 'react'

const GlossyMaterial: React.FC = () => {

  return (
    <meshPhysicalMaterial
      color="#FFFADD"
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
          <meshBasicMaterial color="#FFFADD" />
        ) : (
          <Suspense fallback={<meshBasicMaterial color="#6A9Aff" />}>
            <meshBasicMaterial color="#5879dd" />
          </Suspense>
        )}
      </mesh>

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.005, 64, 64]} />
        <meshStandardMaterial
          color="#6A9Aff"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}