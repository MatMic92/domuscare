const express = require('express');
const { query } = require('../db');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const { full_name, email, collaboration_type, message } = req.body || {};

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Nome completo obbligatorio.' });
    }
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ error: 'Email non valida.' });
    }

    const result = await query(
      `INSERT INTO leads_contacts (full_name, email, collaboration_type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [
        full_name.trim().slice(0, 255),
        String(email).trim().toLowerCase().slice(0, 255),
        collaboration_type ? String(collaboration_type).trim().slice(0, 120) : null,
        message ? String(message).trim().slice(0, 5000) : null,
      ]
    );

    return res.status(201).json({
      ok: true,
      id: result.rows[0].id,
      message: 'Messaggio ricevuto. Ti risponderemo presto.',
    });
  } catch (err) {
    console.error('POST /api/contact', err);
    return res.status(500).json({ error: 'Errore del server. Riprova più tardi.' });
  }
});

module.exports = router;
