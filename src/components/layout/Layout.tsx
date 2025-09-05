import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

type Props = {
  children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children ?? <div className="text-gray-500">Área principal (contenido de la página)</div>}
        </main>
      </div>
    </div>
  )
}

export default Layout
