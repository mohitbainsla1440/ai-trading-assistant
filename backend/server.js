// server.js — AI Trading Assistant Backend

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: "*"
}));

// Rate limiting — 60 req/min per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});
app.use('/analyze', limiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/analyze', analyzeRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Trading Assistant API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiEnabled: !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 AI Trading Assistant API running on:`);
  console.log(`👉 Local:   http://localhost:${PORT}`);
  console.log(`👉 Network: http://<YOUR_IP>:${PORT}`);
  console.log(`📊 Health:  http://<YOUR_IP>:${PORT}/health`);

  console.log(
    `🤖 AI mode: ${process.env.OPENAI_API_KEY
      ? "OpenAI"
      : process.env.ANTHROPIC_API_KEY
        ? "Claude AI"
        : "Rule-Based Engine"
    }`
  );

  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
