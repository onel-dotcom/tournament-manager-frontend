import { API_BASE_URL } from './api.js';

export async function getTeams() {
  const res = await fetch(`${API_BASE_URL}/teams/read.php`);
  return res.json();
}

export async function createTeam(name) {
  return fetch(`${API_BASE_URL}/teams/create.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

export async function deleteTeam(id) {
  return fetch(`${API_BASE_URL}/teams/delete.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

