/**
 * Card Component
 * Generic card container for content
 */

import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  clickable?: boolean
  selected?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, clickable = false, selected = false, className, ...props }, ref) => {
    const baseStyles = 'rounded-lg border transition-all duration-200'
    const clickableStyles = clickable ? 'cursor-pointer hover:shadow-lg' : ''
    const selectedStyles = selected ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'

    const finalClassName = [baseStyles, clickableStyles, selectedStyles, 'p-4', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={finalClassName} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
