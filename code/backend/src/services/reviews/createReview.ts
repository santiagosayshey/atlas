import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import type { Review } from "@/types/review.ts";
import { writeTextFile } from "@/utils/files.ts";
import { generateMarkdown, slugify } from "@/utils/markdown.ts";
import { configLoader } from "@/utils/config.ts";
import { logger } from "@/utils/logger.ts";

export interface CreateReviewInput {
  // Required fields
  title: string;
  date: string; // YYYY-MM-DD
  rating: number;
  type: "movie" | "tv" | "book";

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

export interface CreateReviewResult {
  success: boolean;
  review?: Review;
  error?: string;
  filePath?: string;
}

/**
 * Creates a new review markdown file in the appropriate directory
 */
export async function createReview(
  input: CreateReviewInput,
): Promise<CreateReviewResult> {
  try {
    // Validate required fields
    if (!input.title || !input.date || input.rating === undefined) {
      return {
        success: false,
        error: "Missing required fields: title, date, and rating are required",
      };
    }

    // Validate rating
    if (input.rating < 0 || input.rating > 10) {
      return {
        success: false,
        error: "Rating must be between 0 and 10",
      };
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      return {
        success: false,
        error: "Date must be in YYYY-MM-DD format",
      };
    }

    // Generate slug from title
    const slug = slugify(input.title);

    // Build frontmatter object (only include non-undefined fields)
    const frontmatter: Record<string, unknown> = {
      title: input.title,
      date: input.date,
      rating: input.rating,
    };

    if (input.tmdb_id) frontmatter.tmdb_id = input.tmdb_id;
    if (input.isbn) frontmatter.isbn = input.isbn;
    if (input.season !== undefined) frontmatter.season = input.season;
    if (input.tags && input.tags.length > 0) frontmatter.tags = input.tags;
    if (input.with && input.with.length > 0) frontmatter.with = input.with;
    if (input.revisit !== undefined) frontmatter.revisit = input.revisit;
    if (input.poster) frontmatter.poster = input.poster;
    if (input.finished !== undefined) frontmatter.finished = input.finished;

    // Generate markdown content
    const markdownContent = generateMarkdown(
      frontmatter,
      input.content || "",
    );

    // Get config and determine file path
    const config = await configLoader.getConfig();
    const typeMap: Record<string, string> = {
      movie: config.content.reviews.movies,
      tv: config.content.reviews.tv,
      book: config.content.reviews.books,
    };

    const reviewDir = join(config.content.basePath, typeMap[input.type]);
    const filename = `${input.date}_${slug}.md`;
    const filePath = join(reviewDir, filename);

    // Check if file already exists
    try {
      await Deno.stat(filePath);
      return {
        success: false,
        error: `Review already exists at ${filePath}`,
      };
    } catch {
      // File doesn't exist, which is what we want
    }

    // Write the file
    await writeTextFile(filePath, markdownContent);

    logger.info("Review created", { filePath, type: input.type, slug });

    // Return the created review
    const review: Review = {
      ...frontmatter,
      slug,
      type: input.type,
      content: input.content,
    } as Review;

    return {
      success: true,
      review,
      filePath,
    };
  } catch (error) {
    logger.error(
      "Failed to create review",
      { input },
      error instanceof Error ? error : undefined,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
