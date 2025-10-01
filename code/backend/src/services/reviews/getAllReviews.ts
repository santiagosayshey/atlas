import type { Review } from "@/types/review.ts";
import { contentCache } from "@/utils/cache.ts";

export function getAllReviews(type?: "movie" | "tv" | "book"): Review[] {
  const cache = contentCache.getCache();
  const reviews = cache.reviews || {};

  if (type) {
    const categoryKey = type === "movie"
      ? "movies"
      : type === "tv"
      ? "tv"
      : "books";
    return (reviews[categoryKey] || []) as Review[];
  }

  return [
    ...(reviews.movies || []),
    ...(reviews.tv || []),
    ...(reviews.books || []),
  ].sort((a, b) =>
    (b as Review).date.localeCompare((a as Review).date)
  ) as Review[];
}
