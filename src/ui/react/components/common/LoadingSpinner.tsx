/**
 * Loading Spinner Component
 * Displays a loading indicator with optional message
 */

export interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner = ({ message, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size]

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <svg
        className={`${sizeClass} animate-spin text-blue-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && <p className="text-gray-600 text-center">{message}</p>}
    </div>
  )
}
