import type { Review } from "@/types/review.ts";
import type { ContentLoader } from "@/utils/cache.ts";
import { readDirectory, readTextFile } from "@/utils/files.ts";
import { parseMarkdown, parseReviewFilename } from "@/utils/markdown.ts";
import { logger } from "@/utils/logger.ts";
import { downloadImage, getImageFilename } from "@/utils/images.ts";
import { fetchMovieMetadata, fetchTVMetadata } from "@/utils/tmdb.ts";

export const reviewsLoader: ContentLoader = async (
  dirPath: string,
  categoryKey: string,
): Promise<Review[]> => {
  const reviews: Review[] = [];

  // Map category key to review type
  const typeMap: Record<string, "movie" | "tv" | "book"> = {
    movies: "movie",
    tv: "tv",
    books: "book",
  };
  const type = typeMap[categoryKey];

  if (!type) {
    logger.error("Unknown review category", { categoryKey });
    return reviews;
  }

  try {
    for await (const file of readDirectory(dirPath, ".md")) {
      const content = await readTextFile(file.path);
      const { frontmatter, content: body } = parseMarkdown(content);
      const parsed = parseReviewFilename(file.name);

      if (parsed) {
        const review: Review = {
          ...frontmatter,
          slug: parsed.slug,
          type,
          content: body,
          date: frontmatter.date || parsed.date,
        } as Review;

        // Download poster image if it's a remote URL
        if (review.poster && review.poster.startsWith("http") && review.slug) {
          const filename = getImageFilename(review.poster, review.slug);
          const localPath = await downloadImage(review.poster, filename);
          if (localPath) {
            review.poster = localPath;
          }
        }

        // Fetch TMDB metadata if tmdb_id is present
        if (review.tmdb_id) {
          if (type === "movie") {
            review.tmdb = await fetchMovieMetadata(review.tmdb_id) || undefined;
          } else if (type === "tv") {
            review.tmdb = await fetchTVMetadata(review.tmdb_id) || undefined;
          }
        }

        reviews.push(review);
      }
    }
  } catch (error) {
    logger.error(
      "Failed to load reviews",
      { dirPath },
      error instanceof Error ? error : undefined,
    );
  }

  return reviews.sort((a, b) => b.date.localeCompare(a.date));
};
