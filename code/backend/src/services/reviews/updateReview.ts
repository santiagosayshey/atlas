import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import type { Review } from "@/types/review.ts";
import { readTextFile, writeTextFile } from "@/utils/files.ts";
import { generateMarkdown, parseMarkdown } from "@/utils/markdown.ts";
import { configLoader } from "@/utils/config.ts";
import { logger } from "@/utils/logger.ts";

export interface UpdateReviewInput {
  // Fields that can be updated
  title?: string;
  date?: string; // YYYY-MM-DD
  rating?: number;

  // Media-specific
  tmdb_id?: string;
  isbn?: string;
  season?: number;

  // Optional fields
  tags?: string[];
  with?: string[];
  revisit?: boolean;
  poster?: string;
  finished?: boolean;

  // Content
  content?: string;
}

export interface UpdateReviewResult {
  success: boolean;
  review?: Review;
  error?: string;
  filePath?: string;
}

/**
 * Updates an existing review markdown file
 */
export async function updateReview(
  slug: string,
  type: "movie" | "tv" | "book",
  updates: UpdateReviewInput,
): Promise<UpdateReviewResult> {
  try {
    // Get config and determine file path
    const config = await configLoader.getConfig();
    const typeMap: Record<string, string> = {
      movie: config.content.reviews.movies,
      tv: config.content.reviews.tv,
      book: config.content.reviews.books,
    };

    const reviewDir = join(config.content.basePath, typeMap[type]);

    // Find the file with matching slug (need to iterate since we don't know the date)
    let filePath: string | null = null;
    let fileName: string | null = null;

    for await (const entry of Deno.readDir(reviewDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        // Extract slug from filename (format: YYYY-MM-DD_slug.md)
        const match = entry.name.match(/^\d{4}-\d{2}-\d{2}_(.+)\.md$/);
        if (match && match[1] === slug) {
          filePath = join(reviewDir, entry.name);
          fileName = entry.name;
          break;
        }
      }
    }

    if (!filePath || !fileName) {
      return {
        success: false,
        error: `Review not found: ${type}/${slug}`,
      };
    }

    // Read existing file
    const existingContent = await readTextFile(filePath);
    const { frontmatter, content: body } = parseMarkdown(existingContent);

    // Validate updates if provided
    if (updates.rating !== undefined) {
      if (updates.rating < 0 || updates.rating > 10) {
        return {
          success: false,
          error: "Rating must be between 0 and 10",
        };
      }
    }

    if (updates.date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(updates.date)) {
        return {
          success: false,
          error: "Date must be in YYYY-MM-DD format",
        };
      }
    }

    // Merge updates with existing frontmatter
    const updatedFrontmatter: Record<string, unknown> = { ...frontmatter };

    if (updates.title !== undefined) updatedFrontmatter.title = updates.title;
    if (updates.date !== undefined) updatedFrontmatter.date = updates.date;
    if (updates.rating !== undefined) {
      updatedFrontmatter.rating = updates.rating;
    }
    if (updates.tmdb_id !== undefined) {
      updatedFrontmatter.tmdb_id = updates.tmdb_id;
    }
    if (updates.isbn !== undefined) updatedFrontmatter.isbn = updates.isbn;
    if (updates.season !== undefined) {
      updatedFrontmatter.season = updates.season;
    }
    if (updates.tags !== undefined) updatedFrontmatter.tags = updates.tags;
    if (updates.with !== undefined) updatedFrontmatter.with = updates.with;
    if (updates.revisit !== undefined) {
      updatedFrontmatter.revisit = updates.revisit;
    }
    if (updates.poster !== undefined) {
      updatedFrontmatter.poster = updates.poster;
    }
    if (updates.finished !== undefined) {
      updatedFrontmatter.finished = updates.finished;
    }

    // Use updated content or keep existing
    const updatedContent = updates.content !== undefined
      ? updates.content
      : body;

    // Generate new markdown
    const newMarkdown = generateMarkdown(updatedFrontmatter, updatedContent);

    // If date changed, we need to rename the file
    let newFilePath = filePath;
    if (updates.date && updates.date !== frontmatter.date) {
      const newFileName = fileName.replace(/^\d{4}-\d{2}-\d{2}/, updates.date);
      newFilePath = join(reviewDir, newFileName);

      // Check if new filename already exists
      try {
        await Deno.stat(newFilePath);
        return {
          success: false,
          error:
            `A review already exists with date ${updates.date} and slug ${slug}`,
        };
      } catch {
        // File doesn't exist, which is what we want
      }
    }

    // Write the updated content
    await writeTextFile(newFilePath, newMarkdown);

    // If file was renamed, delete the old file
    if (newFilePath !== filePath) {
      await Deno.remove(filePath);
      logger.info("Review renamed", {
        oldPath: filePath,
        newPath: newFilePath,
      });
    }

    logger.info("Review updated", { filePath: newFilePath, type, slug });

    // Return the updated review
    const review: Review = {
      ...updatedFrontmatter,
      slug,
      type,
      content: updatedContent,
    } as Review;

    return {
      success: true,
      review,
      filePath: newFilePath,
    };
  } catch (error) {
    logger.error(
      "Failed to update review",
      { slug, type },
      error instanceof Error ? error : undefined,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
