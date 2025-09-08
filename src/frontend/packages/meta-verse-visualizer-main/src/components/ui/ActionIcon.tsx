import React from 'react'

interface ActionIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: React.ReactNode
}

export const ActionIcon: React.FC<ActionIconProps> = ({ label, children, ...rest }) => {
  return (
    <button aria-label={label} title={label} {...rest}>
      {children}
    </button>
  )
}

export default ActionIcon
