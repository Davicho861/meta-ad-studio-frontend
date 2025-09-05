import React from 'react'
import useGeneratorStore from '../../store/generatorStore'

const GeneratorControls: React.FC = () => {
  const generatorSettings = useGeneratorStore((s) => s.generatorSettings)
  const updateSetting = useGeneratorStore((s) => s.updateSetting)

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-sm font-medium text-gray-600 mb-1">Aspect Ratio</label>
        <select value={generatorSettings.aspectRatio} onChange={(e) => updateSetting('aspectRatio', e.target.value)} className="w-full border rounded-md p-2 bg-white">
          <option>1:1</option>
          <option>16:9</option>
          <option>9:16</option>
        </select>
      </div>

      <div className="flex-1 min-w-[160px]">
        <label className="block text-sm font-medium text-gray-600 mb-1">Estilo</label>
        <select value={generatorSettings.style} onChange={(e) => updateSetting('style', e.target.value)} className="w-full border rounded-md p-2 bg-white">
          <option>Neón</option>
          <option>Holográfico</option>
          <option>Retro-Futurista</option>
        </select>
      </div>

      <div className="flex-1 min-w-[160px]">
        <label className="block text-sm font-medium text-gray-600 mb-1">Versión</label>
        <select value={generatorSettings.version} onChange={(e) => updateSetting('version', e.target.value)} className="w-full border rounded-md p-2 bg-white">
          <option>v1</option>
          <option>v2</option>
          <option>experimental</option>
        </select>
      </div>
    </div>
  )
}

export default GeneratorControls
