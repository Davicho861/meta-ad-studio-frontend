import React from 'react'

const SUGGESTIONS = [
  '--ar 16:9',
  '--ar 1:1',
  '--quality 2',
  '--style realistic',
  '--chaos 10',
]

export const PromptAutocomplete = ({
  value,
  onSelect,
}: {
  value: string
  onSelect: (s: string) => void
}) => {
  return (
    <div className='absolute left-4 right-4 top-full mt-2 bg-surface-dark border border-gray-800 rounded-md shadow-lg p-2 z-50'>
      <div className='text-sm text-secondary-text mb-2 px-2'>Sugerencias rápidas</div>
      <div className='flex flex-wrap gap-2 px-2'>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onMouseDown={(e) => {
              // prevent blur
              e.preventDefault()
              onSelect(s)
            }}
            className='px-3 py-1 rounded-md bg-gray-800 text-primary-text text-sm hover:bg-gray-700'
            aria-label={`Insertar ${s}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PromptAutocomplete
