# 📁 Complete File Index

This document provides a comprehensive overview of every file in the project with descriptions.

## 📋 Configuration Files

### `package.json`
- **Purpose**: NPM package configuration
- **Contains**: Dependencies, scripts, project metadata
- **Key Scripts**: `dev`, `build`, `test`, `lint`, `preview`

### `vite.config.ts`
- **Purpose**: Vite build tool configuration
- **Contains**: Plugin setup, dev server config, build options
- **Features**: React plugin, environment variable handling

### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Contains**: Compiler options, strict mode, path mapping
- **Features**: ES2020 target, JSX support, strict typing

### `tsconfig.node.json`
- **Purpose**: TypeScript config for Node.js scripts
- **Contains**: Configuration for build scripts
- **Used By**: Vite config and other build tools

### `tailwind.config.js`
- **Purpose**: Tailwind CSS configuration
- **Contains**: Custom colors, fonts, animations
- **Theme**: Cyberpunk colors (teal, magenta, purple)

### `postcss.config.js`
- **Purpose**: PostCSS configuration for Tailwind
- **Contains**: Tailwind and Autoprefixer plugins

### `jest.config.js`
- **Purpose**: Jest testing framework configuration
- **Contains**: Test environment, transforms, setup files
- **Features**: jsdom environment, TypeScript support

### `.eslintrc.cjs`
- **Purpose**: ESLint linting configuration
- **Contains**: Rules, parser settings, plugins
- **Features**: TypeScript, React hooks linting

### `.gitignore`
- **Purpose**: Git ignore rules
- **Contains**: node_modules, dist, .env, logs, IDE files

### `.env.example`
- **Purpose**: Environment variable template
- **Contains**: Example API endpoint configuration
- **Usage**: Copy to `.env` and customize

## 📄 HTML/CSS Files

### `index.html`
- **Purpose**: Main HTML entry point
- **Contains**: Root div, CSP meta tag, script reference
- **Features**: Security headers, accessibility meta tags

### `src/index.css`
- **Purpose**: Global styles and Tailwind imports
- **Contains**: Tailwind directives, custom scrollbar, focus styles
- **Features**: Cyberpunk glow effects, custom animations

## 🎯 Core Application Files

### `src/main.tsx`
- **Purpose**: Application entry point
- **Contains**: React root rendering, strict mode wrapper
- **Imports**: App component, global CSS

### `src/App.tsx`
- **Purpose**: Main application component
- **Contains**: Router setup, navigation, layout structure
- **Features**: Three.js background, routing, 404 page
- **Lines**: ~120

### `src/vite-env.d.ts`
- **Purpose**: Vite environment type definitions
- **Contains**: ImportMeta interface for env variables
- **Usage**: TypeScript support for import.meta.env

## 📦 Type Definitions

### `src/types.d.ts`
- **Purpose**: Global TypeScript type definitions
- **Contains**: 
  - API types (QueryResponse, LogEntry, ApiError)
  - Component prop types
  - Security types (RateLimitState, QueryOptions)
  - Three.js component types
- **Lines**: ~100

## 🔧 Utility Files

### `src/utils/security.ts`
- **Purpose**: Security utility functions
- **Contains**:
  - Rate limiter class
  - Input validation
  - Query length checking
  - Secure headers builder
  - Debounce utility
- **Lines**: ~140
- **Key Functions**:
  - `validateQueryLength()`
  - `checkRateLimit()`
  - `buildSecureHeaders()`
  - `debounce()`

### `src/lib/api.ts`
- **Purpose**: API client and HTTP communication
- **Contains**:
  - Axios instance with interceptors
  - Typed API functions
  - Mock data for development
  - Error handling
- **Lines**: ~280
- **Key Functions**:
  - `analyzeQuery()`
  - `fetchLogs()`
  - `submitEscalation()`
  - `healthCheck()`

### `src/lib/sanitize.ts`
- **Purpose**: Input sanitization and XSS prevention
- **Contains**:
  - DOMPurify wrapper with fallback
  - HTML sanitization
  - Query sanitization
  - File name sanitization
- **Lines**: ~180
- **Key Functions**:
  - `sanitizeHtml()`
  - `sanitizeText()`
  - `sanitizeQuery()`
  - `escapeHtml()`

### `src/setupTests.ts`
- **Purpose**: Jest test setup
- **Contains**: Testing library imports
- **Usage**: Runs before all tests

## 🎨 Component Files

### `src/components/Header.tsx`
- **Purpose**: Application header
- **Contains**: Logo, title, status indicator, security badge
- **Features**: Sticky positioning, responsive design
- **Lines**: ~80

### `src/components/Footer.tsx`
- **Purpose**: Application footer
- **Contains**: Copyright, links, security notice
- **Features**: Responsive layout, security warnings
- **Lines**: ~60

### `src/components/QueryForm.tsx`
- **Purpose**: Main query input form
- **Contains**:
  - Large textarea for queries
  - Character counter
  - Privacy noise toggle
  - Submit button with loading state
- **Features**: Real-time validation, accessibility
- **Lines**: ~180
- **Props**: `onSubmit`, `isLoading`, `error`

### `src/components/ExplainPanel.tsx`
- **Purpose**: Query results and explainability display
- **Contains**:
  - Decision card (allowed/blocked)
  - LLM response viewer
  - Confidence metrics
  - Rule matches display
  - Escalation modal
- **Features**: Safe HTML rendering, raw HTML toggle
- **Lines**: ~220
- **Props**: `response`, `onShowRawContent`

### `src/components/LogsTable.tsx`
- **Purpose**: Activity log viewer
- **Contains**:
  - Table of recent queries
  - Decision indicators
  - Timestamp display
  - Export to CSV button
- **Features**: Responsive table, truncation
- **Lines**: ~140
- **Props**: `logs`, `onExportCsv`

### `src/components/AdminPanel.tsx`
- **Purpose**: Analytics dashboard
- **Contains**:
  - Metric cards (total, allowed, blocked)
  - Top rules chart
  - Decision distribution
  - System status
- **Features**: Computed metrics, visualizations
- **Lines**: ~200
- **Props**: `logs`

### `src/components/CyberBackground.tsx`
- **Purpose**: Three.js 3D animated background
- **Contains**:
  - Particle system (1000 particles)
  - Connecting lines
  - Camera animation
  - Scene setup and cleanup
- **Features**: Cyberpunk colors, smooth animations
- **Lines**: ~180
- **Props**: `intensity`, `animated`

## 📄 Page Components

### `src/pages/Dashboard.tsx`
- **Purpose**: Main dashboard page
- **Contains**:
  - QueryForm integration
  - ExplainPanel for results
  - LogsTable for activity
  - Info cards
- **Features**: State management, CSV export
- **Lines**: ~180

### `src/pages/Admin.tsx`
- **Purpose**: Admin analytics page
- **Contains**:
  - AdminPanel with metrics
  - System configuration display
  - Security features checklist
  - Refresh button
- **Features**: Mock data support, auto-refresh
- **Lines**: ~220

## 🧪 Test Files

### `src/components/QueryForm.test.tsx`
- **Purpose**: Unit tests for QueryForm component
- **Contains**:
  - Rendering tests
  - User interaction tests
  - Validation tests
  - Accessibility tests
- **Coverage**: Form behavior, error handling, loading states
- **Lines**: ~200
- **Framework**: Jest + React Testing Library

## 📚 Documentation Files

### `README.md`
- **Purpose**: Main project documentation
- **Contains**:
  - Feature overview
  - Installation instructions
  - Configuration guide
  - API documentation
  - Security notes
  - Deployment guide
  - Troubleshooting
- **Lines**: ~600
- **Audience**: All users

### `QUICKSTART.md`
- **Purpose**: Quick setup guide for first-time users
- **Contains**:
  - 5-minute setup steps
  - Common issues and solutions
  - Example queries
  - Useful commands
- **Lines**: ~200
- **Audience**: Beginners

### `DEVELOPMENT.md`
- **Purpose**: Developer workflow guide
- **Contains**:
  - Development workflow
  - Adding components
  - Testing strategy
  - Code style guidelines
  - Git workflow
- **Lines**: ~400
- **Audience**: Developers

### `SECURITY.md`
- **Purpose**: Security policy and guidelines
- **Contains**:
  - Security architecture
  - Feature descriptions
  - Server-side requirements
  - HIPAA compliance notes
  - Incident response plan
- **Lines**: ~800
- **Audience**: Security teams, developers

### `ARCHITECTURE.md`
- **Purpose**: System architecture documentation
- **Contains**:
  - Architecture diagrams (ASCII)
  - Component hierarchy
  - Data flow diagrams
  - Technology stack
  - Performance metrics
- **Lines**: ~400
- **Audience**: Architects, technical leads

### `PROJECT_SUMMARY.md`
- **Purpose**: Complete project overview
- **Contains**:
  - What was built
  - File structure
  - Feature list
  - Quick start
  - Next steps
- **Lines**: ~500
- **Audience**: All users

### `FILE_INDEX.md` (This File)
- **Purpose**: Complete file index and reference
- **Contains**: Descriptions of every file in project
- **Audience**: All users

## 🔐 Hidden/Config Files

### `.github/copilot-instructions.md`
- **Purpose**: GitHub Copilot workspace instructions
- **Contains**: Project overview, tech stack, security notes
- **Usage**: AI assistant context

## 📊 Project Statistics

```
Total Files:        35+
TypeScript Files:   15
Test Files:         1
Config Files:       9
Documentation:      8
Components:         7
Pages:              2
Utilities:          3

Total Lines:        ~7,000+
Code:              ~3,500
Tests:             ~200
Documentation:     ~3,000
Config:            ~300
```

## 🗂️ Directory Structure

```
medical-query-firewall-ui/
├── 📁 .github/
│   └── copilot-instructions.md
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── QueryForm.tsx
│   │   ├── QueryForm.test.tsx
│   │   ├── ExplainPanel.tsx
│   │   ├── LogsTable.tsx
│   │   ├── AdminPanel.tsx
│   │   └── CyberBackground.tsx
│   ├── 📁 pages/
│   │   ├── Dashboard.tsx
│   │   └── Admin.tsx
│   ├── 📁 lib/
│   │   ├── api.ts
│   │   └── sanitize.ts
│   ├── 📁 utils/
│   │   └── security.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── types.d.ts
│   ├── vite-env.d.ts
│   └── setupTests.ts
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📄 jest.config.js
├── 📄 .eslintrc.cjs
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 README.md
├── 📄 QUICKSTART.md
├── 📄 DEVELOPMENT.md
├── 📄 SECURITY.md
├── 📄 ARCHITECTURE.md
├── 📄 PROJECT_SUMMARY.md
└── 📄 FILE_INDEX.md (this file)
```

## 🎯 File Purposes by Category

### Configuration (9 files)
Setup and configuration for build tools, linters, and frameworks

### Documentation (8 files)
Guides, references, and policies for different audiences

### Source Code (15 files)
React components, utilities, types, and application logic

### Tests (1 file)
Unit tests for components (more can be added)

### Entry Points (3 files)
- `index.html` - Browser entry
- `src/main.tsx` - React entry
- `src/App.tsx` - Application root

## 🔍 Finding What You Need

### "I want to..."

**...understand the project**
→ Start with `PROJECT_SUMMARY.md`

**...set up for the first time**
→ Read `QUICKSTART.md`

**...develop new features**
→ Check `DEVELOPMENT.md`

**...understand security**
→ Review `SECURITY.md`

**...see the architecture**
→ Look at `ARCHITECTURE.md`

**...modify the UI**
→ Edit components in `src/components/`

**...change API calls**
→ Edit `src/lib/api.ts`

**...add security features**
→ Edit `src/utils/security.ts`

**...customize colors**
→ Edit `tailwind.config.js`

**...add tests**
→ Create `*.test.tsx` files in `src/components/`

## 📝 Maintenance

### Regular Updates Needed:
- Dependencies (`package.json`) - Monthly
- Security patches (`npm audit`) - Weekly
- Documentation - As features change
- Tests - With each new feature

### Files to Never Commit:
- `.env` (use `.env.example` instead)
- `node_modules/`
- `dist/`
- `*.log`
- IDE config (unless shared team config)

---

**Last Updated**: 2024-12-05

**Need Help?** Check the README.md or contact the development team.