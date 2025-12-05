# Medical Query Firewall Frontend

This is a React TypeScript project built with Vite for a Medical Query Firewall frontend with cyberpunk aesthetics and 3D visuals.

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS for styling
- Three.js for 3D background effects  
- React Router for navigation
- Axios for API calls
- Security utilities with DOMPurify

## Security Features
- Client-side input sanitization
- Rate limiting and debouncing
- Content Security Policy ready
- No embedded secrets (use REACT_APP_API_BASE env var)
- Secure fetch headers
- HTML content escaping

## Development
Use REACT_APP_API_BASE environment variable for API endpoint configuration.