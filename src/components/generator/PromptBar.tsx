import React from 'react'
import { Sparkles } from 'lucide-react'
import useGeneratorStore from '../../store/generatorStore'

const PromptBar: React.FC = () => {
  const promptText = useGeneratorStore((s) => s.promptText)
  const updatePromptText = useGeneratorStore((s) => s.updatePromptText)
  const generate = useGeneratorStore((s) => s.generate)
  const isLoading = useGeneratorStore((s) => s.isLoading)
  const generatorSettings = useGeneratorStore((s) => s.generatorSettings)
  const updateSetting = useGeneratorStore((s) => s.updateSetting)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 p-4 z-50">
      <div className="max-w-4xl mx-auto">
        {/* Controles sutiles */}
        <div className="flex flex-wrap gap-3 mb-3 items-center">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-300 mb-1">Aspect Ratio</label>
            <select
              value={generatorSettings.aspectRatio}
              onChange={(e) => updateSetting('aspectRatio', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option>1:1</option>
              <option>16:9</option>
              <option>9:16</option>
            </select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-300 mb-1">Estilo</label>
            <select
              value={generatorSettings.style}
              onChange={(e) => updateSetting('style', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option>Neón</option>
              <option>Holográfico</option>
              <option>Retro-Futurista</option>
            </select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-300 mb-1">Versión</label>
            <select
              value={generatorSettings.version}
              onChange={(e) => updateSetting('version', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option>v1</option>
              <option>v2</option>
              <option>experimental</option>
            </select>
          </div>
        </div>

        {/* Input de prompt */}
        <div className="flex gap-3">
          <textarea
            value={promptText}
            onChange={(e) => updatePromptText(e.target.value)}
            placeholder="Describe tu visión creativa..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-gray-500"
            rows={2}
          />
          <button
            onClick={generate}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-medium ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Sparkles size={16} />
            {isLoading ? 'Generando...' : 'Generar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromptBar