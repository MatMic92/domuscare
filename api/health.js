const { query } = require('../backend/src/db');

module.exports = async (_req, res) => {
  try {
    await query('SELECT 1');
    return res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('health', err);
    return res.status(503).json({ status: 'degraded', db: 'disconnected' });
  }
};
