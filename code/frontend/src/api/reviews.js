import { apiFetch } from './config.js';

/**
 * Fetch all reviews with optional type filter
 * @param {string} [type] - Filter by 'movie', 'tv', or 'book'
 * @returns {Promise<Array>} Array of reviews
 */
export async function getReviews(type = null) {
  const endpoint = type ? `/reviews?type=${type}` : '/reviews';
  const data = await apiFetch(endpoint);
  return data.reviews || [];
}

/**
 * Fetch a single review by type and slug
 * @param {string} type - 'movie', 'tv', or 'book'
 * @param {string} slug - URL slug of the review
 * @returns {Promise<Object>} Review object
 */
export async function getReview(type, slug) {
  const data = await apiFetch(`/reviews/${type}/${slug}`);
  return data.review;
}