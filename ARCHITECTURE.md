# Medical Query Firewall - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User's Browser                               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Frontend Application                     │   │
│  │                 (Vite + React + TypeScript)                 │   │
│  │                                                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   Dashboard  │  │    Admin     │  │  3D Visual   │    │   │
│  │  │     Page     │  │     Page     │  │  Background  │    │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │   │
│  │         │                 │                                │   │
│  │         └────────┬────────┘                                │   │
│  │                  │                                          │   │
│  │         ┌────────▼────────┐                                │   │
│  │         │   React Router  │                                │   │
│  │         └────────┬────────┘                                │   │
│  │                  │                                          │   │
│  │    ┌─────────────┼─────────────┐                          │   │
│  │    │             │             │                           │   │
│  │  ┌─▼──────┐  ┌──▼─────┐  ┌───▼──────┐                   │   │
│  │  │ Query  │  │Explain │  │   Logs   │                    │   │
│  │  │  Form  │  │ Panel  │  │  Table   │                    │   │
│  │  └─┬──────┘  └────────┘  └──────────┘                    │   │
│  │    │                                                       │   │
│  │    └──────────────┬────────────────────────────────┐     │   │
│  │                   │                                 │     │   │
│  │         ┌─────────▼────────┐           ┌───────────▼──┐  │   │
│  │         │   Security Utils │           │  Sanitize    │  │   │
│  │         │  - Rate Limiter  │           │   Library    │  │   │
│  │         │  - Validation    │           │  (DOMPurify) │  │   │
│  │         └─────────┬────────┘           └───────────┬──┘  │   │
│  │                   │                                 │     │   │
│  │                   └──────────┬──────────────────────┘     │   │
│  │                              │                             │   │
│  │                   ┌──────────▼──────────┐                 │   │
│  │                   │     API Client      │                 │   │
│  │                   │      (Axios)        │                 │   │
│  │                   └──────────┬──────────┘                 │   │
│  └──────────────────────────────┼──────────────────────────┘   │
│                                  │                               │
└──────────────────────────────────┼───────────────────────────────┘
                                   │
                          HTTPS/TLS│(Secure Connection)
                                   │
┌──────────────────────────────────▼───────────────────────────────┐
│                         Backend API Server                        │
│                      (Your Backend - Required)                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  POST /query │  │  GET /logs   │  │ POST /escalate│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                    │
│         └────────┬────────┴────────┬────────┘                    │
│                  │                 │                              │
│         ┌────────▼─────────────────▼────────┐                    │
│         │   Medical Query Firewall Logic    │                    │
│         │  - Input Validation                │                    │
│         │  - Classifier Model                │                    │
│         │  - Rule Matching                   │                    │
│         │  - LLM Integration                 │                    │
│         └────────┬──────────────────────────┘                    │
│                  │                                                 │
│         ┌────────▼─────────┐                                      │
│         │     Database     │                                      │
│         │  - Query Logs    │                                      │
│         │  - Audit Trail   │                                      │
│         └──────────────────┘                                      │
└───────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
├── CyberBackground (Three.js)
├── Header
│   ├── Logo
│   ├── Status Indicator
│   └── Security Badge
├── Navigation
│   ├── Dashboard Link
│   └── Admin Link
├── Router
│   ├── Dashboard Page
│   │   ├── QueryForm
│   │   │   ├── Textarea
│   │   │   ├── Privacy Toggle
│   │   │   └── Submit Button
│   │   ├── ExplainPanel
│   │   │   ├── Decision Card
│   │   │   ├── LLM Response
│   │   │   ├── Explainability Metrics
│   │   │   └── Escalation Modal
│   │   └── LogsTable
│   │       ├── Log Entries
│   │       └── Export Button
│   └── Admin Page
│       ├── AdminPanel
│       │   ├── Metrics Cards
│       │   ├── Top Rules Chart
│       │   └── Distribution Chart
│       └── System Info
└── Footer
    ├── Copyright
    ├── Links
    └── Security Notice
```

## Data Flow

```
User Input → QueryForm
    ↓
    Sanitization (lib/sanitize.ts)
    ↓
    Validation (utils/security.ts)
    ↓
    Rate Limit Check (utils/security.ts)
    ↓
    API Client (lib/api.ts)
    ↓
    POST /api/query
    ↓
Backend Processing
    ↓
    Response (JSON)
    ↓
    ExplainPanel Component
    ↓
    User sees result
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         User Input                       │
└─────────────┬───────────────────────────┘
              │
    ┌─────────▼─────────┐
    │ Client-side       │ (UX Layer)
    │ - Sanitization    │
    │ - Validation      │
    │ - Rate Limiting   │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │ Transport         │ (Network Layer)
    │ - HTTPS/TLS       │
    │ - Secure Headers  │
    │ - CSP             │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │ Server-side       │ (Security Layer) ⚠️ CRITICAL
    │ - Authentication  │
    │ - Authorization   │
    │ - Validation      │
    │ - Rate Limiting   │
    │ - SQL Protection  │
    │ - Logging         │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │ Processing        │ (Application Layer)
    │ - Classifier      │
    │ - Rule Engine     │
    │ - LLM             │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │ Storage           │ (Data Layer)
    │ - Database        │
    │ - Audit Logs      │
    │ - Encryption      │
    └───────────────────┘
```

## Technology Stack Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    Build & Dev Tools                     │
│                                                          │
│  Vite 5.0    │  TypeScript 5.2  │  ESLint  │  Jest     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Frontend Framework                    │
│                                                          │
│  React 18.2  │  React Router 6.20  │  React Hooks      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                      UI Layer                            │
│                                                          │
│  Tailwind CSS 3.3  │  Three.js 0.158  │  Custom CSS    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Utilities                             │
│                                                          │
│  Axios 1.6  │  DOMPurify 3.0  │  Custom Security Utils │
└──────────────────────────────────────────────────────────┘
```

## File Size Breakdown (Approximate)

```
Total Lines of Code: ~3,500

Components:       ~1,200 lines
├── Header:         ~80 lines
├── Footer:         ~60 lines
├── QueryForm:      ~180 lines
├── ExplainPanel:   ~220 lines
├── LogsTable:      ~140 lines
├── AdminPanel:     ~200 lines
└── CyberBackground: ~180 lines

Pages:            ~400 lines
├── Dashboard:      ~180 lines
└── Admin:          ~220 lines

Utilities:        ~800 lines
├── api.ts:         ~280 lines
├── sanitize.ts:    ~180 lines
├── security.ts:    ~140 lines
└── types.d.ts:     ~100 lines

Tests:            ~200 lines
├── QueryForm.test: ~200 lines

Config:           ~200 lines
Documentation:    ~3,000 lines
```

## Performance Metrics (Target)

```
Initial Load:     < 2 seconds
Time to Interactive: < 3 seconds
Bundle Size:      < 500 KB (gzipped)
Lighthouse Score: > 90

Performance Optimizations:
- Code splitting by route
- Lazy loading for Three.js
- Tree shaking with Vite
- Minification in production
- Asset optimization
```

## Browser Support

```
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)
```

## Deployment Architecture

```
User Browser
    ↓
CDN (CloudFlare, AWS CloudFront)
    ↓
Static Hosting (Vercel, Netlify, S3)
    ├── HTML, CSS, JS (Frontend)
    └── Environment Config
        ↓
API Gateway
    ↓
Backend Server (Your Infrastructure)
    ├── Load Balancer
    ├── Application Servers
    ├── Database
    └── Cache (Redis)
```

## Development Workflow

```
1. Code → src/
2. Save File
3. Vite Hot Reload
4. Browser Updates (instant)
5. Test Changes
6. Commit to Git
7. Push to GitHub
8. CI/CD Pipeline (optional)
9. Deploy to Production
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Performance
- ✅ Accessibility