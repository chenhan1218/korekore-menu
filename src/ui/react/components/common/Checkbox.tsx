/**
 * Checkbox Component
 * Accessible checkbox input
 */

import React from 'react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    const inputId = props.id || `checkbox-${Math.random().toString(36).substring(7)}`

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer ${className || ''}`}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
