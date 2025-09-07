import React from 'react'

export default function TopBar() {
  return (
    <header className='w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white'>
      <div className='flex items-center gap-3'>
        <h1 className='text-xl font-semibold'>Meta Ad Studio</h1>
        <span className='text-sm text-gray-300'>Midjourney-Fidelity</span>
      </div>
      <div className='flex items-center gap-2'>
        <label className='sr-only' htmlFor='mj-search'>
          Buscar
        </label>
        <input
          id='mj-search'
          className='px-3 py-2 rounded bg-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='Buscar prompts o tags'
        />
        <button className='px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'>
          Buscar
        </button>
      </div>
    </header>
  )
}
