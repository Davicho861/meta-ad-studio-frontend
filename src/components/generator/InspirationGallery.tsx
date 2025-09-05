import React from 'react'
import Card from '../ui/Card'
import useGeneratorStore from '../../store/generatorStore'

const examples = [
  'Proyección holográfica de un reloj que cambia el tiempo en una plaza central, estilo Blade Runner.',
  'Anuncio gigante de zapatillas que interactúa con avatares en la calle, colores vibrantes y neón.',
  'Valla publicitaria AR que cambia según la hora del día y el clima del usuario.'
]


const InspirationGallery: React.FC = () => {
  const updatePromptText = useGeneratorStore((s) => s.updatePromptText)

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Galería de inspiración</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {examples.map((ex, idx) => (
          <Card key={idx} onClick={() => updatePromptText(ex)}>
            <p className="text-sm text-gray-700">{ex}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default InspirationGallery
