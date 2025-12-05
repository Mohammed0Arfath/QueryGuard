# Medical Query Firewall - Backend Server

Backend API server for the Medical Query Firewall application.

## Features

- ✅ RESTful API endpoints
- ✅ Google Gemini AI integration
- ✅ SQLite database for persistent storage
- ✅ Rate limiting (20 req/min)
- ✅ CORS enabled
- ✅ Request logging
- ✅ Security headers (Helmet)
- ✅ Input validation & sanitization
- ✅ Fallback analysis when AI unavailable
- ✅ Analytics endpoints

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `.env` file:
```bash
GEMINI_API_KEY=your_actual_api_key_here
PORT=8000
```

### 3. Start Server
```bash
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

Server will start at: **http://localhost:8000**

## API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-05T15:49:32.123Z",
  "database": "connected",
  "totalLogs": 42,
  "geminiConfigured": true
}
```

### Analyze Query
```http
POST /api/query
Content-Type: application/json

{
  "query": "What are the symptoms of diabetes?",
  "options": {
    "user_id": "user_123",
    "session_id": "session_456"
  }
}
```

**Response:**
```json
{
  "decision": "allowed",
  "classifier_prob": 0.92,
  "rule_matches": ["medical_query_approved"],
  "llm_response": "Diabetes symptoms include...",
  "explanation": "AI-powered analysis completed. Query allowed."
}
```

### Get Logs
```http
GET /api/logs?limit=20
```

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid-here",
      "timestamp": "2025-12-05T15:49:32.123Z",
      "query": "What are the symptoms of diabetes?",
      "decision": "allowed",
      "classifier_prob": 0.92,
      "rule_matches": ["medical_query_approved"],
      "user_id": "user_123",
      "session_id": "session_456"
    }
  ]
}
```

### Get Analytics
```http
GET /api/analytics
```

**Response:**
```json
{
  "total": 100,
  "allowed": 85,
  "blocked": 15,
  "avgConfidence": 0.88
}
```

### Escalate Query
```http
POST /api/escalate
Content-Type: application/json

{
  "query": "Suspicious query text",
  "reason": "Needs human review"
}
```

**Response:**
```json
{
  "success": true,
  "id": "escalation-uuid",
  "message": "Escalation request received"
}
```

### Clear Logs (Development Only)
```http
DELETE /api/logs
```

## Database

**Type:** SQLite  
**File:** `database.sqlite`  
**Location:** Backend directory

### Schema

```sql
CREATE TABLE query_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  query TEXT NOT NULL,
  decision TEXT NOT NULL CHECK(decision IN ('allowed', 'blocked')),
  classifier_prob REAL NOT NULL,
  rule_matches TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  llm_response TEXT,
  explanation TEXT,
  ip_address TEXT,
  user_agent TEXT
);
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | Server port |
| `GEMINI_API_KEY` | - | Google Gemini API key (required) |
| `DB_PATH` | ./database.sqlite | Database file path |
| `RATE_LIMIT_WINDOW_MS` | 60000 | Rate limit window (1 min) |
| `RATE_LIMIT_MAX_REQUESTS` | 20 | Max requests per window |
| `ALLOWED_ORIGINS` | localhost:3000 | CORS allowed origins |
| `NODE_ENV` | development | Environment mode |

## Security Features

### Rate Limiting
- **20 requests per minute** per IP address
- Configurable via environment variables
- Returns 429 status when exceeded

### Input Validation
- Query length: Max 1000 characters
- XSS prevention: HTML tags stripped
- SQL injection: Using prepared statements

### CORS
- Configurable allowed origins
- Credentials support
- Preflight handling

### Headers
- Helmet.js security headers
- Content Security Policy
- XSS Protection

## Error Handling

### 400 Bad Request
- Invalid query format
- Missing required fields
- Query too long

### 429 Too Many Requests
- Rate limit exceeded
- Retry after 60 seconds

### 500 Internal Server Error
- Database errors
- AI API failures (with fallback)
- Unexpected errors

## Development

### Watch Mode
```bash
npm run dev
```

Uses Node.js `--watch` flag for auto-reload on file changes.

### Testing
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test query endpoint
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are diabetes symptoms?"}'

# Test logs endpoint
curl http://localhost:8000/api/logs?limit=10
```

### Database Inspection
```bash
sqlite3 backend/database.sqlite

sqlite> SELECT * FROM query_logs;
sqlite> SELECT COUNT(*) FROM query_logs;
sqlite> .quit
```

## Production Deployment

### Recommendations

1. **Environment**
   - Set `NODE_ENV=production`
   - Use process manager (PM2)
   - Enable HTTPS
   - Use reverse proxy (Nginx)

2. **Database**
   - Regular backups
   - Monitor size
   - Index optimization

3. **Security**
   - Rotate API keys
   - Monitor rate limits
   - Log analysis
   - Authentication/authorization

4. **Monitoring**
   - Health check endpoint
   - Error logging
   - Performance metrics
   - Database stats

### PM2 Example
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name medical-firewall

# Monitor
pm2 logs medical-firewall
pm2 monit

# Auto-restart on crashes
pm2 startup
pm2 save
```

## Troubleshooting

### Server won't start
- Check port 8000 is available
- Verify Node.js version (18+)
- Check `.env` file exists
- Review console errors

### Database errors
- Check write permissions
- Verify `database.sqlite` not locked
- Try deleting DB file (dev only)

### Gemini API errors
- Verify API key is valid
- Check internet connection
- Fallback will activate automatically
- Check API quota limits

### CORS errors
- Verify frontend origin in `ALLOWED_ORIGINS`
- Check protocol (http/https)
- Ensure port matches

## File Structure

```
backend/
├── server.js          # Main server file
├── database.js        # SQLite operations
├── analyzer.js        # Query analysis logic
├── package.json       # Dependencies
├── .env              # Configuration
├── database.sqlite   # SQLite database
└── README.md         # This file
```

## Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables
- **axios** - HTTP client for Gemini API
- **better-sqlite3** - SQLite database
- **uuid** - Unique ID generation

## License

MIT

## Support

For issues or questions, check the main project documentation or create an issue.

---

**Status**: ✅ Production-ready backend server with AI integration and persistent storage!
