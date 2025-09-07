import React from 'react'
import { Crop, Image, Settings } from 'lucide-react'

interface ControlButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ElementType
  label: string
}

const ControlButton = ({ icon: Icon, label }: ControlButtonProps) => (
  <button className='flex items-center gap-2 px-3 py-1.5 bg-surface-dark text-secondary-text hover:text-primary-text rounded-md text-sm transition-colors'>
    <Icon size={16} />
    {label}
  </button>
)

interface PromptBarV2Props {
  prompt: string
  setPrompt: (value: string) => void
  onGenerate: () => void
  isGenerating: boolean
}

export const PromptBarV2 = ({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
}: PromptBarV2Props) => {
  return (
    <div className='w-full max-w-5xl mx-auto p-4 bg-surface-dark rounded-xl shadow-2xl border border-gray-800'>
      <div className='relative'>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='w-full p-4 pr-32 text-lg bg-transparent rounded-lg focus:outline-none resize-none'
          placeholder='Un anuncio holográfico de un coche volador en el distrito de Akihabara...'
          rows={4}
        />
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className='absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-accent-blue text-white font-bold rounded-lg hover:bg-opacity-80 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2'
        >
          {isGenerating ? 'Generando...' : 'Generar'}
        </button>
      </div>
      <div className='border-t border-gray-700 mt-4 pt-3 flex items-center gap-4'>
        <ControlButton icon={Crop} label='Aspect Ratio 16:9' />
        <ControlButton icon={Image} label='Estilo: Realista' />
        <ControlButton icon={Settings} label='Versión: 1.2' />
        {/* Aquí puedes añadir más controles como --chaos, --style, etc. */}
      </div>
    </div>
  )
}
