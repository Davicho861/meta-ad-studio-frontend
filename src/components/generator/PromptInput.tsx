import { Sparkles } from 'lucide-react'
import useGeneratorStore from '../../store/generatorStore'
import React from 'react'

const PromptInput: React.FC = () => {
  const promptText = useGeneratorStore((s) => s.promptText)
  const updatePromptText = useGeneratorStore((s) => s.updatePromptText)
  const generate = useGeneratorStore((s) => s.generate)
  const isLoading = useGeneratorStore((s) => s.isLoading)

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Escribe tu prompt</label>
      <textarea
        value={promptText}
        onChange={(e) => updatePromptText(e.target.value)}
        placeholder="Campaña publicitaria de neón para una bebida energética futurista..."
        className="w-full h-40 p-3 rounded-md border border-gray-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="mt-3 flex justify-end">
        <button
          onClick={generate}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition ${isLoading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          <Sparkles size={16} />
          {isLoading ? 'Generando...' : 'Generar'}
        </button>
      </div>
    </div>
  )
}

export default PromptInput
