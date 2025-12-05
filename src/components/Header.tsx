import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-cyber-darker/90 backdrop-blur-md border-b-2 border-cyber-teal/40 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-teal via-cyber-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.5)] rotate-3 hover:rotate-0 transition-transform">
              <span className="text-lg font-black text-white">MQ</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal to-cyber-magenta neon-text">
                Medical Query Firewall
              </h1>
              <p className="text-sm text-cyber-light font-semibold">
                AI-Powered Medical Security Layer
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Status indicator */}
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-cyber-teal rounded-full animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
              <span className="text-base text-cyber-light font-semibold">ONLINE</span>
            </div>
            
            {/* Security badge */}
            <div className="hidden md:flex items-center space-x-2 bg-cyber-teal/20 border border-cyber-teal/50 px-4 py-2 rounded-lg hover:bg-cyber-teal/30 transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <svg 
                className="w-5 h-5 text-cyber-teal" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-label="Security shield"
              >
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-cyber-teal font-bold">SECURED</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;