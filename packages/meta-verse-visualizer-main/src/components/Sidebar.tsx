import React, { useState } from 'react'
import { LayoutGrid, Paintbrush, History, Settings } from 'lucide-react'

const NavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ElementType
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center p-3 rounded-lg transition-colors duration-200 ${active ? 'bg-accent-blue text-white' : 'text-secondary-text hover:bg-surface-dark hover:text-primary-text'}`}
  >
    <Icon size={22} />
    <span className='ml-4 font-medium'>{label}</span>
    {label === 'Campañas' && (
      <span className='ml-auto bg-accent-purple text-white text-xs font-bold px-2 py-0.5 rounded-full'>
        3
      </span>
    )}
  </button>
)

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Explorar Anuncios')

  return (
    <aside className='w-64 bg-surface-dark/50 border-r border-gray-800 p-4 flex flex-col'>
      <div className='mb-8'>
        <h1 className='text-xl font-bold text-white'>META AD STUDIO</h1>
        <p className='text-xs text-accent-blue'>v1.0 - Enterprise</p>
      </div>
      <nav className='flex flex-col gap-2'>
        <NavItem
          icon={LayoutGrid}
          label='Explorar Anuncios'
          active={activeItem === 'Explorar Anuncios'}
          onClick={() => setActiveItem('Explorar Anuncios')}
        />
        <NavItem
          icon={Paintbrush}
          label='Crear Overlay'
          active={activeItem === 'Crear Overlay'}
          onClick={() => setActiveItem('Crear Overlay')}
        />
        <NavItem
          icon={History}
          label='Campañas'
          active={activeItem === 'Campañas'}
          onClick={() => setActiveItem('Campañas')}
        />
        <NavItem
          icon={Settings}
          label='Ajustes'
          active={activeItem === 'Ajustes'}
          onClick={() => setActiveItem('Ajustes')}
        />
      </nav>
      <div className='mt-auto'>
        {/* Aquí puedes poner info del usuario o un botón de logout */}
      </div>
    </aside>
  )
}
