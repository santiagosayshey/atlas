import type { Review } from "@/types/review.ts";
import type { ContentLoader } from "@/utils/cache.ts";
import { readDirectory, readTextFile } from "@/utils/files.ts";
import { parseMarkdown, parseReviewFilename } from "@/utils/markdown.ts";
import { logger } from "@/utils/logger.ts";

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
        reviews.push({
          ...frontmatter,
          slug: parsed.slug,
          type,
          content: body,
          date: frontmatter.date || parsed.date,
        } as Review);
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
