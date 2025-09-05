import React, { useState } from 'react'
import { Settings, X, Briefcase, Cog } from 'lucide-react'

const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botón de engranaje fijo */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full backdrop-blur-sm border border-gray-600 transition-colors"
      >
        <Settings size={20} className="text-gray-300" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Menú</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors text-left">
                <Briefcase size={18} className="text-gray-400" />
                <span className="text-gray-200">Campañas</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors text-left">
                <Cog size={18} className="text-gray-400" />
                <span className="text-gray-200">Ajustes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingsMenu