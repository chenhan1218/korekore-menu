import React from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { routes } from './ui/react/router'

/**
 * Main application component
 *
 * This is the root component of the KoreKore application.
 * It sets up routing and global layout.
 */
const AppContent: React.FC = () => {
  const element = useRoutes(routes)
  return element
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
