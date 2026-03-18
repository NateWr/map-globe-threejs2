import { type Object3D } from 'three'
import { useGLTF } from "@react-three/drei"
import { Country } from './Country'

export function Countries({
  selected,
  setSelected
} : {
  selected: Object3D | null,
  setSelected: Function
}) {

  const { nodes } = useGLTF('/globe-country-boundaries-surface-only.glb')

  return (
    <>
      {Object.keys(nodes).map(k => (
        <Country
          key={k}
          country={nodes[k]}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </>
  )
}