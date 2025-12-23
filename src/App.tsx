import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/ui/pages/HomePage';
import { MenuScanPage } from '@/ui/pages/MenuScanPage';

/**
 * Main application component
 *
 * This is the root component of the KoreKore application.
 * It sets up routing and global layout.
 *
 * Routes:
 * - / : HomePage - Landing page with prominent upload button
 * - /menu-scan : MenuScanPage - Complete menu scanning workflow
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu-scan" element={<MenuScanPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
