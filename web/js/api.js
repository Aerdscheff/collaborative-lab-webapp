import { getJWT } from './auth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => searchParams.append(key, item));
    } else {
      searchParams.set(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = getJWT();
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = text;
    }
  }

  if (!response.ok) {
    const message = (data && data.detail) || response.statusText || 'API request failed';
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const API = {
  async getFiches(params = {}) {
    return request(`/fiches${buildQuery(params)}`);
  },
  async getFiche(id) {
    return request(`/fiches/${encodeURIComponent(id)}`);
  },
  async createFiche(payload) {
    return request('/fiches', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateFiche(id, payload) {
    return request(`/fiches/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async deleteFiche(id) {
    await request(`/fiches/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async getProfile() {
    try {
      return await request('/me/profile');
    } catch (error) {
      if (error.status === 404) {
        return {
          email: '',
          subject: '',
          classes: '',
          sdgs: '',
          bio: '',
          preferences: '',
        };
      }
      throw error;
    }
  },
  async updateProfile(payload) {
    return request('/me/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async exportData() {
    return request('/export.json');
  },
};
