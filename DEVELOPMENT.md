# Medical Query Firewall - Development Guide

## Quick Start for Developers

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and set REACT_APP_API_BASE to your backend URL
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Run Tests
```bash
npm test
```

## Development Workflow

### Adding a New Component

1. Create component file in `src/components/YourComponent.tsx`
2. Export as default: `export default YourComponent;`
3. Add TypeScript types in `src/types.d.ts` if needed
4. Import in parent component or page
5. Write tests in `src/components/YourComponent.test.tsx`

### Adding a New API Endpoint

1. Add type definition in `src/types.d.ts`
2. Add method to `ApiClient` class in `src/lib/api.ts`
3. Export convenience function at bottom of file
4. Mock in tests using `jest.mock('../lib/api')`

### Modifying Security Rules

1. Edit constants in `src/utils/security.ts`
2. Update validation functions as needed
3. Test rate limiting and input validation
4. Document changes in README.md

## Backend Mock Server

For development without a backend, you can use the built-in mock data:

```typescript
// Mock data is automatically returned when API calls fail
// See getMockLogs() in src/lib/api.ts
```

Or create a simple mock server:

```bash
# Install json-server
npm install -g json-server

# Create db.json with mock data
echo '{
  "logs": [
    {
      "id": "1",
      "timestamp": "2024-12-05T10:00:00Z",
      "query": "Test query",
      "decision": "allowed",
      "classifier_prob": 0.95,
      "rule_matches": ["test_rule"]
    }
  ]
}' > db.json

# Start mock server
json-server --watch db.json --port 8000
```

## Debugging Tips

### Enable Verbose Logging
Add to `.env`:
```
REACT_APP_DEBUG=true
```

### Chrome DevTools
- Open DevTools (F12)
- Check Console for API requests
- Use Network tab to inspect API calls
- Use React DevTools extension for component inspection

### Three.js Performance
If 3D background is slow:
1. Reduce particle count in `CyberBackground.tsx`
2. Lower intensity prop: `<CyberBackground intensity={0.5} />`
3. Disable animation: `<CyberBackground animated={false} />`

## Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint rules (run `npm run lint`)
- Use functional components with hooks
- Prefer const over let
- Use meaningful variable names
- Add comments for complex logic
- Keep components under 300 lines
- Extract reusable logic to hooks or utilities

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## Testing Strategy

- Unit tests for components (Jest + React Testing Library)
- Integration tests for API calls (mock with jest.mock)
- E2E tests for critical flows (Cypress - optional)
- Manual testing checklist in README.md

## Performance Checklist

- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] Memoization for expensive calculations
- [ ] Debouncing for user inputs
- [ ] Image optimization
- [ ] Bundle size under 500KB (check with `npm run build`)

## Security Checklist

- [ ] All user inputs sanitized
- [ ] No secrets in code or environment files committed
- [ ] CSP headers configured
- [ ] HTTPS enabled in production
- [ ] Rate limiting implemented
- [ ] XSS protection verified
- [ ] Dependencies updated (run `npm audit`)

## Deployment Checklist

- [ ] Tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured on hosting platform
- [ ] CORS configured on backend
- [ ] CSP headers set
- [ ] HTTPS enabled
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] Analytics configured (optional)

## Useful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)

## Support

Need help? Check:
1. This development guide
2. README.md for general info
3. Code comments in source files
4. GitHub Issues
5. Contact team lead