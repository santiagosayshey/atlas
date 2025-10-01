import { apiFetch } from './config.js';

/**
 * Fetch all habits
 * @returns {Promise<Array>} Array of habits
 */
export async function getHabits() {
  const data = await apiFetch('/habits');
  return data.habits || [];
}

/**
 * Fetch a single habit by slug
 * @param {string} slug - URL slug of the habit
 * @returns {Promise<Object>} Habit object
 */
export async function getHabit(slug) {
  const data = await apiFetch(`/habits/${slug}`);
  return data.habit;
}
