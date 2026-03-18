import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { type Object3D, type Vector3 } from 'three'

/**
 * Allow a small amount of accidental "spin" on a click
 * without disabling clicks. This allows users to move
 * the pointer a little while clicking.
 */
const CLICK_DISTANCE_TOLERANCE = 30

export default function Controls({
  isSpinning,
  setIsSpinning,
  selected,
} : {
  isSpinning: boolean,
  setIsSpinning: Function,
  selected: Object3D | null,
}) {

  const { camera } = useThree()
  let lastCameraPos : Vector3 = camera.position.clone()

  return (
    <OrbitControls
      enableDamping={true}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={1}
      maxPolarAngle={1.8}
      onStart={() => {
        lastCameraPos = camera.position.clone()
        setIsSpinning(true)
      }}
      onEnd={() => {
        if (lastCameraPos.distanceTo(camera.position) < CLICK_DISTANCE_TOLERANCE) {
          isSpinning = false
        } else {
          setTimeout(() => {
            isSpinning = false
          }, 1)
        }
      }}
    />
  )
}