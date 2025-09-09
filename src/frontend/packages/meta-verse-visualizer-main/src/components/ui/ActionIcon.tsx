import React from 'react'

interface ActionIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: React.ReactNode
}

export const ActionIcon: React.FC<ActionIconProps> = ({ label, children, ...rest }) => {
  const props = { type: 'button' as const, 'aria-label': label, title: label, ...rest }
  return (
    <button {...props}>
      {children}
    </button>
  )
}

export default ActionIcon
