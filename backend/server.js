import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { dbOps } from './database.js';
import { analyzeWithGemini, analyzeFallback, sanitizeQuery, validateQuery } from './analyzer.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://queryguard.netlify.app'
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// ============================================
// API ROUTES
// ============================================

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/api/health', (req, res) => {
  try {
    const dbCount = dbOps.getLogCount();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      totalLogs: dbCount,
      geminiConfigured: !!GEMINI_API_KEY,
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Analyze query
app.post('/api/query', async (req, res) => {
  console.log('=== Query endpoint hit ===');
  try {
    const { query, options = {} } = req.body;
    console.log('Query:', query);
    console.log('Options:', options);
    
    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid query',
        details: validation.errors,
      });
    }
    
    // Sanitize query
    const sanitizedQuery = sanitizeQuery(query);
    
    // Analyze query
    let result;
    try {
      if (GEMINI_API_KEY) {
        result = await analyzeWithGemini(sanitizedQuery, GEMINI_API_KEY);
      } else {
        console.warn('Gemini API key not configured, using fallback analysis');
        result = analyzeFallback(sanitizedQuery);
      }
    } catch (error) {
      console.error('Analysis error, using fallback:', error.message);
      result = analyzeFallback(sanitizedQuery);
    }
    
    // Save to database
    const logEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      query: sanitizedQuery,
      decision: result.decision,
      classifier_prob: result.classifier_prob,
      rule_matches: result.rule_matches,
      user_id: options.user_id || null,
      session_id: options.session_id || null,
      llm_response: result.llm_response,
      explanation: result.explanation,
      ip_address: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
    };
    
    dbOps.addLog(logEntry);
    
    // Return response
    res.json({
      decision: result.decision,
      classifier_prob: result.classifier_prob,
      rule_matches: result.rule_matches,
      llm_response: result.llm_response,
      explanation: result.explanation,
    });
    
  } catch (error) {
    console.error('Query processing error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Get logs
app.get('/api/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const sessionId = req.query.session_id;
    
    let logs;
    if (sessionId) {
      logs = dbOps.getLogsBySession(sessionId);
    } else {
      logs = dbOps.getLogs(Math.min(limit, 100)); // Max 100 logs
    }
    
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error.message,
    });
  }
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = dbOps.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message,
    });
  }
});

// Escalation endpoint (human review)
app.post('/api/escalate', async (req, res) => {
  try {
    const { query, reason } = req.body;
    
    if (!query || !reason) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }
    
    // In a real system, this would create a ticket or notification
    // For now, just acknowledge the escalation
    const escalationId = uuidv4();
    
    console.log(`[ESCALATION] ID: ${escalationId}, Query: "${query}", Reason: ${reason}`);
    
    res.json({
      success: true,
      id: escalationId,
      message: 'Escalation request received',
    });
  } catch (error) {
    console.error('Escalation error:', error);
    res.status(500).json({
      error: 'Failed to process escalation',
      message: error.message,
    });
  }
});

// Clear logs (development only)
app.delete('/api/logs', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      error: 'Not allowed in production',
    });
  }
  
  try {
    const result = dbOps.clearLogs();
    res.json({
      success: result.success,
      message: 'All logs cleared',
    });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({
      error: 'Failed to clear logs',
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server (async to initialize database first)
(async () => {
  try {
    // Initialize database
    await dbOps.init();
    
    // Start Express server
    app.listen(PORT, () => {
      const logCount = dbOps.getLogCount();
      console.log(`
╔═══════════════════════════════════════════════════════╗
║   Medical Query Firewall - Backend API Server        ║
╚═══════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}
📊 Database: ${logCount} logs stored
🤖 Gemini API: ${GEMINI_API_KEY ? '✅ Configured' : '⚠️  Not configured (using fallback)'}
🌍 Environment: ${process.env.NODE_ENV || 'development'}

Available endpoints:
  GET  /api/health       - Health check
  POST /api/query        - Analyze query
  GET  /api/logs         - Get query logs
  GET  /api/analytics    - Get analytics
  POST /api/escalate     - Escalate query
  
Ready to process queries! 🎉
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  dbOps.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nShutting down gracefully...');
  dbOps.close();
  process.exit(0);
});
