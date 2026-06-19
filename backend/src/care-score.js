const AUTONOMY_SCORE = {
  autosufficiente: 1,
  parzialmente_autosufficiente: 2,
  non_autosufficiente: 3,
};

const URGENCY_SCORE = {
  assistenza_diurna: 1,
  assistenza_notturna: 2,
  consegna_farmaci: 2,
  sostituzione_badante: 3,
};

function computeCareScore({ autonomy_level: autonomy, urgent_need: urgency }) {
  const autonomyScore = AUTONOMY_SCORE[autonomy] || 2;
  const urgencyScore = URGENCY_SCORE[urgency] || 2;
  return Math.min(10, Math.max(1, autonomyScore + urgencyScore + 2));
}

function suggestPackage(careScore) {
  if (careScore >= 7) return 'Benessere & Sport';
  if (careScore >= 4) return 'Medici & Salute';
  return 'Pacchetto Core';
}

module.exports = { computeCareScore, suggestPackage };
