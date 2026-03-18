import { type Object3D } from 'three'
import { useGLTF } from "@react-three/drei"
import { CountryModel } from './CountryModel'

export function CountriesModel({
  selected,
  setSelected
} : {
  selected: Object3D,
  setSelected: Function
}) {

  const { nodes } = useGLTF('/globe-country-boundaries-surface-only.glb')


  return (
    <>
      {Object.keys(nodes).map(k => (
        <CountryModel
          key={k}
          country={nodes[k]}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </>
  )
}