import React from 'react'

type Props = {
  name?: string
  size?: number
}

const Avatar: React.FC<Props> = ({ name = 'D', size = 40 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-300 text-gray-800 font-semibold"
      style={{ width: size, height: size }}
      title={name}
    >
      {initials}
    </div>
  )
}

export default Avatar
