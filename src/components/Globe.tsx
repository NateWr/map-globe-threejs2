import * as THREE from 'three'
import { SCREEN_WIDTH_LG } from "../utils/constants"
import { EARTH_RADIUS } from "../utils/geojson"

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
    </>
  )
}