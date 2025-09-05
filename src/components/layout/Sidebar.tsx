import React from 'react'
import { LayoutGrid, PlusSquare, BarChart3, Settings } from 'lucide-react'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <div className="mb-6">
        <div className="text-xl font-bold">META AD STUDIO</div>
        <div className="text-xs text-gray-400">v1.0 - Enterprise</div>
      </div>

      <nav className="space-y-2">
        <div className="text-sm text-gray-400 mb-2">Navegación</div>
        <div className="flex flex-col gap-2">
          <a href="#" className="rounded-md bg-gray-800 px-2 py-2 flex items-center gap-3 hover:bg-gray-700">
            <LayoutGrid size={18} />
            <span>Explorar Anuncios</span>
          </a>

          <a href="#" className="rounded-md px-2 py-2 flex items-center gap-3 hover:bg-gray-800">
            <PlusSquare size={18} />
            <span>Crear Overlay</span>
          </a>

          <a href="#" className="rounded-md px-2 py-2 flex items-center gap-3 hover:bg-gray-800">
            <BarChart3 size={18} />
            <span>Campañas</span>
          </a>

          <a href="#" className="rounded-md px-2 py-2 flex items-center gap-3 hover:bg-gray-800">
            <Settings size={18} />
            <span>Ajustes</span>
          </a>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
