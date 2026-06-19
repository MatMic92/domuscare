const express = require('express');
const { query } = require('../db');
const { computeCareScore, suggestPackage } = require('../care-score');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const {
      email,
      who_for,
      autonomy_level,
      urgent_need,
      answers,
    } = req.body || {};

    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ error: 'Email non valida.' });
    }
    if (!who_for || !autonomy_level || !urgent_need) {
      return res.status(400).json({ error: 'Completa tutte le domande del triage.' });
    }

    const careScore = computeCareScore({ autonomy_level, urgent_need });
    const suggestedPackage = suggestPackage(careScore);

    const payload = {
      who_for: String(who_for).slice(0, 80),
      autonomy_level: String(autonomy_level).slice(0, 80),
      urgent_need: String(urgent_need).slice(0, 120),
      ...(answers && typeof answers === 'object' ? answers : {}),
    };

    const result = await query(
      `INSERT INTO triage_submissions
        (email, who_for, autonomy_level, urgent_need, care_score, suggested_package, answers)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, care_score, suggested_package, created_at`,
      [
        String(email).trim().toLowerCase().slice(0, 255),
        payload.who_for,
        payload.autonomy_level,
        payload.urgent_need,
        careScore,
        suggestedPackage,
        JSON.stringify(payload),
      ]
    );

    const row = result.rows[0];
    return res.status(201).json({
      ok: true,
      id: row.id,
      care_score: row.care_score,
      suggested_package: row.suggested_package,
      message: 'Care Plan salvato. Il team ti contatterà a breve.',
    });
  } catch (err) {
    console.error('POST /api/triage', err);
    return res.status(500).json({ error: 'Errore del server. Riprova più tardi.' });
  }
});

module.exports = router;
