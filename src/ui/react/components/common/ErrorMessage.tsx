/**
 * Error Message Component
 * Displays error messages with optional retry action
 */

import { AppError } from '@/shared/types'
import { Button } from './Button'

export interface ErrorMessageProps {
  error: AppError | null
  onRetry?: () => void
  onDismiss?: () => void
}

export const ErrorMessage = ({ error, onRetry, onDismiss }: ErrorMessageProps) => {
  if (!error) return null

  return (
    <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
      <div>
        <h3 className="font-semibold text-red-800">發生錯誤</h3>
        <p className="text-red-700 text-sm mt-1">{error.userMessage}</p>
      </div>

      <div className="flex gap-2">
        {error.retry && onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            重試
          </Button>
        )}
        {onDismiss && (
          <Button variant="secondary" size="sm" onClick={onDismiss}>
            關閉
          </Button>
        )}
      </div>
    </div>
  )
}
