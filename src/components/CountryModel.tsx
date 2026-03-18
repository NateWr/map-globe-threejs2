import { type Object3D } from 'three'
import { useSpring } from '@react-spring/three'
import { a } from "@react-spring/three";
import { useFrame, useThree } from '@react-three/fiber';
import debounce from 'debounce';
import { useState } from 'react';

const COUNTRY_SCALE = 1.06
const COUNTRY_HIGHLIGHT_SCALE = 1.09
const COUNTRY_OPACITY = 0.25
const COUNTRY_HIGHLIGHT_OPACITY = 0.5
const COUNTRY_SELECTED_OPACITY = 0.9
const DISTANCE_TO_GLOBE_EDGE = 250

export function CountryModel({
  country,
  selected,
  setSelected
} : {
  country: Object3D,
  selected: Object3D,
  setSelected: Function
}) {
  const [highlighted, setHighlighted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { camera, invalidate } = useThree()

  useFrame(() => {
    if (isAnimating) {
      invalidate()
    }
  })

  const springs = useSpring({
    scale: highlighted || selected?.name === country.name
      ? COUNTRY_HIGHLIGHT_SCALE
      : COUNTRY_SCALE,
    opacity: selected?.name === country.name
      ? COUNTRY_SELECTED_OPACITY
      : highlighted
        ? COUNTRY_HIGHLIGHT_OPACITY
        : COUNTRY_OPACITY,
    onStart: () => setIsAnimating(true),
    onRest: () => debounce(() => setIsAnimating(false), 1000),
  })

  const isFacingCamera = (object: Object3D) => {
    return object.geometry.boundingSphere?.distanceToPoint(camera.position) < DISTANCE_TO_GLOBE_EDGE
  }

  return (
    <a.mesh
      geometry={country.geometry}
      name={country.name}
      scale={springs.scale}
      onClick={(e) => {
        if (!e?.object?.name) {
          return
        }
        if (e.object.name === selected?.name) {
          setSelected(null)
        } else {
          setSelected(e.object)
        }
        e.stopPropagation()
      }}
      onPointerOver={(e) => {
        setHighlighted(isFacingCamera(e.object))
        e.stopPropagation()
      }}
      onPointerOut={(e) => {
        setHighlighted(false)
        e.stopPropagation()
      }}
    >
      <a.meshBasicMaterial
        color="#fff500"
        opacity={springs.opacity}
        transparent={true}
      />
      <lineSegments>
        <edgesGeometry args={[country.geometry, 30]} />
        <lineBasicMaterial color="#998800" />
      </lineSegments>
    </a.mesh>
  )
}