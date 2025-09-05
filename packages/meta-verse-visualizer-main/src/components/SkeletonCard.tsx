import React from 'react'

export const SkeletonCard = () => {
  return (
    <div className='bg-surface rounded-lg p-4 animate-pulse'>
      <div className='w-full h-48 bg-surface-dark rounded-lg mb-4'></div>
      <div className='h-4 bg-surface-dark rounded mb-2'></div>
      <div className='h-4 bg-surface-dark rounded w-3/4'></div>
    </div>
  )
}
