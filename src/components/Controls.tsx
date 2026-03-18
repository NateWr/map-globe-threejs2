import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { type Mesh, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/**
 * Allow a small amount of accidental "spin" on a click
 * without disabling clicks. This allows users to move
 * the pointer a little while clicking.
 */
const CLICK_DISTANCE_TOLERANCE = 30

const DAMPING_FACTOR = 0.05
const DAMPING_FACTOR_SELECT = 0.12

/**
 * Get the yaw and pitch of a country relative to the
 * scene origin
 *
 * This is used to move the orbit controls so that the
 * country is centered in the view.
 */
const getObjectYawPitch = (object: Mesh) : [number, number] => {
  const origin = new Vector3()
  const dir = new Vector3()
  dir.subVectors(origin, object.geometry.boundingSphere?.center ?? dir).normalize()
  const yaw = Math.atan2(dir.x, dir.z)
  const pitch = Math.PI - (Math.atan2(Math.sqrt(dir.z * dir.z + dir.x * dir.x), dir.y))
  return [yaw, pitch]
}

/**
 * Convert the yaw of an object to the matching azimuth
 * angle for the orbit controls
 */
const yawToAzimuthAngle = (yaw: number) => {
  return yaw < 0
    ? Math.PI + yaw
    : -1 * Math.PI + yaw
}

/**
 * Rotate the controls to focus on a single country
 */
const lookAt = (controls: OrbitControlsImpl | null, country: Mesh) => {
  const angles = getObjectYawPitch(country)
  const targetAzimuthAngle = yawToAzimuthAngle(angles[0])
  const targetPolarAngle = Math.max(1.0, Math.min(1.8, angles[1]))
  controls?.setAzimuthalAngle(targetAzimuthAngle)
  controls?.setPolarAngle(targetPolarAngle)
}

export default function Controls({
  isSpinning,
  setIsSpinning,
  selected,
} : {
  isSpinning: boolean,
  setIsSpinning: Function,
  selected: Mesh | null,
}) {
  const controls = useRef<OrbitControlsImpl>(null)

  const { camera } = useThree()
  let lastCameraPos : Vector3 = camera.position.clone()

  const [dampingFactor, setDampingFactor] = useState(DAMPING_FACTOR)

  useEffect(() => {
    setDampingFactor(
      selected
        ? DAMPING_FACTOR_SELECT
        : DAMPING_FACTOR
    )
    if (selected) {
      lookAt(controls?.current ?? null, selected)
    }
  }, [selected])

  return (
    <OrbitControls
      ref={controls}
      dampingFactor={dampingFactor}
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