window.triageAnswers = {
  who_for: null,
  autonomy_level: null,
  urgent_need: null,
};

function selectTriageAnswer(field, value) {
  triageAnswers[field] = value;
}

function getApiBase() {
  const url = window.DOMUSCARE_CONFIG?.API_URL?.trim();
  if (url) return url.replace(/\/$/, '');
  return '';
}

async function apiPost(path, body) {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Errore di rete. Riprova più tardi.');
  }
  return data;
}

function setButtonLoading(button, loading, defaultLabel) {
  if (!button) return;
  button.disabled = loading;
  button.dataset.defaultLabel = button.dataset.defaultLabel || defaultLabel || button.textContent;
  button.textContent = loading ? 'Invio in corso...' : button.dataset.defaultLabel;
}

async function submitContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  setButtonLoading(button, true, 'Invia Messaggio');

  try {
    const data = new FormData(form);
    await apiPost('/api/contact', {
      full_name: data.get('full_name'),
      email: data.get('email'),
      collaboration_type: data.get('collaboration_type'),
      message: data.get('message'),
    });
    form.reset();
    alert('Messaggio inviato con successo! Ti risponderemo presto.');
  } catch (err) {
    alert(err.message);
  } finally {
    setButtonLoading(button, false, 'Invia Messaggio');
  }
}

async function submitTriageForm(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  setButtonLoading(button, true, 'Vedi i Profili');

  try {
    const email = new FormData(form).get('email');
    if (!triageAnswers.who_for || !triageAnswers.autonomy_level || !triageAnswers.urgent_need) {
      throw new Error('Completa tutte le domande del triage prima di inviare.');
    }

    const result = await apiPost('/api/triage', {
      email,
      who_for: triageAnswers.who_for,
      autonomy_level: triageAnswers.autonomy_level,
      urgent_need: triageAnswers.urgent_need,
      answers: { ...triageAnswers },
    });

    form.reset();
    alert(
      `${result.message || 'Care Plan salvato.'}\n` +
      `Pacchetto suggerito: ${result.suggested_package || '—'} (Care Score: ${result.care_score ?? '—'})`
    );
  } catch (err) {
    alert(err.message);
  } finally {
    setButtonLoading(button, false, 'Vedi i Profili');
  }
}
