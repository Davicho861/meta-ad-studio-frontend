import React from 'react'

type Props = {
  title?: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

const Card: React.FC<Props> = ({ title, children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition cursor-pointer ${className}`}
    >
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  )
}

export default Card
