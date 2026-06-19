const { query } = require('../backend/src/db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://domuscaresito.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { full_name, email, collaboration_type, message } = body;

    if (!full_name || String(full_name).trim().length < 2) {
      return res.status(400).json({ error: 'Nome completo obbligatorio.' });
    }
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ error: 'Email non valida.' });
    }

    const result = await query(
      `INSERT INTO leads_contacts (full_name, email, collaboration_type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [
        String(full_name).trim().slice(0, 255),
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
    console.error('contact', err);
    return res.status(500).json({ error: 'Errore del server. Riprova più tardi.' });
  }
};
