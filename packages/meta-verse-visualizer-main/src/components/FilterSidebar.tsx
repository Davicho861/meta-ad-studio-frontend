import React from 'react'

type FilterKey = 'top' | 'hot' | 'new' | 'rising'

interface FilterSidebarProps {
  active?: FilterKey
  onChange?: (key: FilterKey) => void
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  active = 'top',
  onChange,
}) => {
  const buttons: { key: FilterKey; label: string }[] = [
    { key: 'top', label: 'Top' },
    { key: 'hot', label: 'Hot' },
    { key: 'new', label: 'New' },
    { key: 'rising', label: 'Rising' },
  ]

  return (
    <aside className='w-48 p-4 border-r border-divider bg-surface'>
      <div className='flex flex-col gap-3'>
        {buttons.map((b) => (
          <button
            key={b.key}
            onClick={() => onChange?.(b.key)}
            className={`text-sm py-2 px-3 rounded-lg text-left transition-colors ${
              active === b.key
                ? 'bg-accent-blue text-white'
                : 'bg-transparent text-secondary-text hover:bg-gray-700/40'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default FilterSidebar
