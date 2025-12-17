/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import React, { ReactNode } from 'react'
import { Button } from '../common'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Optionally reload the page or reset to home
    window.location.href = '/'
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">發生錯誤</h1>
            <p className="text-red-700 mb-4">
              抱歉，應用程序遇到了一個未預期的錯誤。
            </p>
            <details className="text-left mb-6 bg-white p-4 rounded-lg border border-red-300">
              <summary className="font-semibold text-red-700 cursor-pointer mb-2">
                錯誤詳情
              </summary>
              <pre className="text-xs text-red-600 overflow-auto max-h-48">
                {this.state.error?.message}
              </pre>
            </details>
            <Button
              variant="primary"
              fullWidth
              onClick={this.handleReset}
            >
              返回首頁
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
