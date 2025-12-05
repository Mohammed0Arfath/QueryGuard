import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyber-darker/80 backdrop-blur-sm border-t border-cyber-teal/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-cyber-light">
              © {currentYear} Medical Query Firewall. All rights reserved.
            </p>
            <p className="text-xs text-cyber-light/70 mt-1">
              Secure AI-powered query processing with privacy protection
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-cyber-light">
            <a 
              href="#" 
              className="hover:text-cyber-teal transition-colors focus-outline"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="hover:text-cyber-teal transition-colors focus-outline"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="hover:text-cyber-teal transition-colors focus-outline"
              onClick={(e) => e.preventDefault()}
            >
              Documentation
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-cyber-light">
              <svg className="w-4 h-4 text-cyber-teal" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-cyber-gray/30 text-center">
          <p className="text-xs text-cyber-light/50">
            ⚠️ Security Notice: All queries are logged and monitored. Never submit personally identifiable information (PII) or protected health information (PHI) without proper authorization. Server-side validation is enforced.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;