import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/ui/react/components/layout'
import { AIProcessingPage } from '@/ui/react/pages/AIProcessingPage'

/**
 * Main application component
 *
 * This is the root component of the KoreKore application.
 * It sets up routing and global layout with error handling.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white">
          {/* Main content */}
          <Routes>
            {/* AI Menu Processing - Main flow */}
            <Route path="/" element={<AIProcessingPage />} />
            {/* TODO: Order card generation page */}
            {/* TODO: Menu history page */}
            {/* TODO: Authentication pages */}
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
