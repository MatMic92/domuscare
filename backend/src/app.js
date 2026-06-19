require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const contactRouter = require('./routes/contact');
const triageRouter = require('./routes/triage');
const { query } = require('./db');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'https://domuscaresito.vercel.app')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(express.json({ limit: '32kb' }));
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    return res.json({ status: 'ok', db: 'connected' });
  } catch {
    return res.status(503).json({ status: 'degraded', db: 'disconnected' });
  }
});

app.use('/api/contact', contactRouter);
app.use('/api/triage', triageRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato.' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ error: 'Errore interno.' });
});

module.exports = app;
