import React from 'react'
import Card from '../ui/Card'
import useGeneratorStore from '../../store/generatorStore'

const scenes = [
  { title: 'Virtual Times Square', img: '' },
  { title: 'Digital Shibuya Crossing', img: '' },
  { title: 'Neon Alley Marketplace', img: '' },
  { title: 'Holographic Rooftop', img: '' }
]

const SceneSelector: React.FC = () => {
  const updatePromptText = useGeneratorStore((s) => s.updatePromptText)

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">O elige un escenario</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {scenes.map((s, idx) => (
          <Card key={idx} onClick={() => updatePromptText(`Escenario: ${s.title}. Describe una escena publicitaria en este lugar, con neón y avatares interactivos.`)} className="flex flex-col items-center justify-center h-32">
            <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-sm text-gray-400">Imagen</div>
            <div className="text-sm font-medium">{s.title}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SceneSelector
