import { type Object3D } from 'three'
import { useGLTF } from "@react-three/drei"
import { Country } from './Country'

export function Countries({
  hoverEnabled,
  isSpinning,
  selected,
  setSelected,
  setTooltip,
} : {
  hoverEnabled: boolean,
  isSpinning: boolean,
  selected: Object3D | null,
  setSelected: Function,
  highlighted: string,
  setTooltip: Function,
}) {

  const { nodes } = useGLTF('/globe-country-boundaries-surface-only.glb')

  return (
    <>
      {Object.keys(nodes).map(k => (
        <Country
          key={k}
          country={nodes[k]}
          hoverEnabled={hoverEnabled}
          isSpinning={isSpinning}
          selected={selected}
          setSelected={setSelected}
          setTooltip={setTooltip}
        />
      ))}
    </>
  )
}