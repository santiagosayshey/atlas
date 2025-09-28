export const API_BASE = 'http://localhost:7667/api';

/**
 * Base fetch wrapper with error handling
 */
export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = new Error(`API Error: ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}