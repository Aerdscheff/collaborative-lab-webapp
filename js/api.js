
import { getJWT } from './auth.js';

const API_BASE = 'https://collaborative-lab-webapp.onrender.com';

async function callApi(method, path, body) {
  const token = getJWT();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.status === 204 ? null : await res.json();
}

export const API = {
  getProfile() { return callApi('GET', '/me/profile'); },
  updateProfile(data) { return callApi('PUT', '/me/profile', data); },
  getFiches(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return callApi('GET', `/fiches${qs ? '?' + qs : ''}`);
  },
  createFiche(data) { return callApi('POST', '/fiches', data); },
  deleteFiche(id) { return callApi('DELETE', `/fiches/${id}`); }
};
