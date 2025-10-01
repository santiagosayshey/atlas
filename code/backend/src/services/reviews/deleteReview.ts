import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { configLoader } from "@/utils/config.ts";
import { logger } from "@/utils/logger.ts";

export interface DeleteReviewResult {
  success: boolean;
  error?: string;
  filePath?: string;
}

/**
 * Deletes an existing review markdown file
 */
export async function deleteReview(
  slug: string,
  type: "movie" | "tv" | "book",
): Promise<DeleteReviewResult> {
  try {
    // Get config and determine file path
    const config = await configLoader.getConfig();
    const typeMap: Record<string, string> = {
      movie: config.content.reviews.movies,
      tv: config.content.reviews.tv,
      book: config.content.reviews.books,
    };

    const reviewDir = join(config.content.basePath, typeMap[type]);

    // Find the file with matching slug
    let filePath: string | null = null;

    for await (const entry of Deno.readDir(reviewDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        // Extract slug from filename (format: YYYY-MM-DD_slug.md)
        const match = entry.name.match(/^\d{4}-\d{2}-\d{2}_(.+)\.md$/);
        if (match && match[1] === slug) {
          filePath = join(reviewDir, entry.name);
          break;
        }
      }
    }

    if (!filePath) {
      return {
        success: false,
        error: `Review not found: ${type}/${slug}`,
      };
    }

    // Delete the file
    await Deno.remove(filePath);

    logger.info("Review deleted", { filePath, type, slug });

    return {
      success: true,
      filePath,
    };
  } catch (error) {
    logger.error(
      "Failed to delete review",
      { slug, type },
      error instanceof Error ? error : undefined,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
