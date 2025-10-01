import type { Review } from "@/types/review.ts";
import { contentCache } from "@/utils/cache.ts";

export function getReview(
  slug: string,
  type: "movie" | "tv" | "book",
): Review | null {
  const cache = contentCache.getCache();
  const reviews = cache.reviews || {};
  const categoryKey = type === "movie"
    ? "movies"
    : type === "tv"
    ? "tv"
    : "books";

  const review = (reviews[categoryKey] || []).find((r: unknown) =>
    (r as Review).slug === slug
  );
  return (review as Review) || null;
}
