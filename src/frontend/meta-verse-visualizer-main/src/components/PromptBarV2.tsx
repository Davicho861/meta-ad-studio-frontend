import React, { useEffect, useRef, useState } from 'react'
import { Crop, Image, Settings, Search } from 'lucide-react'
import { PromptAutocomplete } from './PromptAutocomplete'

interface ControlButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ElementType
  label: string
}

const ControlButton = ({ icon: Icon, label }: ControlButtonProps) => (
  <button type="button" aria-label={label} title={label} className='flex items-center gap-2 px-3 py-1.5 bg-surface-dark text-secondary-text hover:text-primary-text rounded-md text-sm transition-colors'>
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
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const [showSuggestions, setShowSuggestions] = useState(false)

    useEffect(() => {
      // Auto-focus on mount to emphasize prompt-first UX
      inputRef.current?.focus()
    }, [])

    return (
      <div className='w-full max-w-4xl mx-auto'>
        <div className='flex items-start gap-4'>
          <div className='flex-1 relative'>
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              placeholder='Describe tu idea... (ej: Anuncio futurista en Times Square --ar 16:9)'
              aria-label='Prompt input'
              className='w-full min-h-[80px] p-4 rounded-xl bg-gradient-to-br from-surface-dark to-surface-darker text-primary-text border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-blue shadow-lg'
            />

            <div className='absolute right-3 top-3 text-secondary-text'>
              <Search className='w-5 h-5' />
            </div>

            {showSuggestions && (
              <PromptAutocomplete
                value={prompt}
                onSelect={(s: string) => {
                  const next = prompt ? `${prompt} ${s}` : s
                  setPrompt(next)
                  inputRef.current?.focus()
                }}
              />
            )}
          </div>

          <div className='flex flex-col gap-2 items-end'>
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className='px-5 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold hover:opacity-95 disabled:opacity-50 shadow-md'
              aria-pressed={isGenerating}
              aria-label='Generar imagen'
            >
              {isGenerating ? 'Generando...' : 'Generar'}
            </button>

            <button
              type="button"
              onClick={() => setPrompt('')}
              className='text-sm text-secondary-text underline hover:text-primary-text'
              aria-label='Limpiar prompt'
              title='Limpiar prompt'
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    )
}
