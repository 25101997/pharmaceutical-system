const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = (process.env.CORS_ALLOWED || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '1mb' }));

app.get('/api', (req, res) => {
  res.json({ name: 'Farmacias API', version: '1.0.0' });
});

app.use('/api/health', require('./routes/health.routes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
