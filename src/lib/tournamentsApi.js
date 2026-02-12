import { API_BASE_URL } from './api.js';

export async function getHistory() {
  const res = await fetch(`${API_BASE_URL}/tournaments/read_history.php`);
  return res.json();
}

export async function getBracket(id) {
  const res = await fetch(`${API_BASE_URL}/tournaments/read_bracket.php?id=${id}`);
  return res.json();
}

export async function createTournament(name, teams) {
  const res = await fetch(`${API_BASE_URL}/tournaments/create.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, teams }),
  });
  return res.json();
}

export async function updateScore(payload) {
  return fetch(`${API_BASE_URL}/tournaments/update_score.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

