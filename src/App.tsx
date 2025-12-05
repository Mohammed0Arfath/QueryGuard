import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CyberBackground from './components/CyberBackground';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import UseCases from './pages/UseCases';

// Navigation component
const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-cyber-darker/70 backdrop-blur-md border-b-2 border-cyber-gray/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-4">
        <div className="flex space-x-2">
          <Link
            to="/"
            className={`
              px-7 py-4 text-lg font-bold transition-all duration-300 border-b-3 focus-outline relative group
              ${isActive('/') 
                ? 'text-cyber-teal border-cyber-teal shadow-[0_0_15px_rgba(20,184,166,0.5)]' 
                : 'text-cyber-light border-transparent hover:text-cyber-teal hover:border-cyber-teal/50'
              }
            `}
          >
            <span className={isActive('/') ? 'neon-text' : ''}>Dashboard</span>
          </Link>
          <Link
            to="/admin"
            className={`
              px-7 py-4 text-lg font-bold transition-all duration-300 border-b-3 focus-outline relative group
              ${isActive('/admin') 
                ? 'text-cyber-purple border-cyber-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                : 'text-cyber-light border-transparent hover:text-cyber-purple hover:border-cyber-purple/50'
              }
            `}
          >
            <span className={isActive('/admin') ? 'neon-text' : ''}>Metrics</span>
          </Link>
          <Link
            to="/use-cases"
            className={`
              px-7 py-4 text-lg font-bold transition-all duration-300 border-b-3 focus-outline relative group
              ${isActive('/use-cases') 
                ? 'text-cyber-magenta border-cyber-magenta shadow-[0_0_15px_rgba(255,45,149,0.5)]' 
                : 'text-cyber-light border-transparent hover:text-cyber-magenta hover:border-cyber-magenta/50'
              }
            `}
          >
            <span className={isActive('/use-cases') ? 'neon-text' : ''}>Use Cases</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Three.js 3D Background */}
        <CyberBackground intensity={0.8} animated={true} />
        
        {/* Header */}
        <Header />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

// 404 Not Found component
const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal to-cyber-magenta">
          404
        </div>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-cyber-light">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyber-teal to-cyber-blue text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyber-teal/30 transition-all focus-outline"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default App;