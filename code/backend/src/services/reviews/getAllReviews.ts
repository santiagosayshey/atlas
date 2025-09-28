import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import type { Review } from "@/types/review.ts";
import type { Config } from "@/types/config.ts";
import { readDirectory, readTextFile } from "@/utils/files.ts";
import { parseMarkdown, parseReviewFilename } from "@/utils/markdown.ts";
import { parseYamlFile } from "@/utils/yaml.ts";

async function loadConfig(): Promise<Config> {
  return await parseYamlFile<Config>(
    join(Deno.cwd(), "config.yaml"),
  );
}

export async function getAllReviews(
  type?: "movie" | "tv" | "book",
): Promise<Review[]> {
  const config = await loadConfig();
  const reviews: Review[] = [];
  const types = type ? [type] : ["movie", "tv", "book"] as const;

  for (const reviewType of types) {
    const categoryKey = reviewType === "movie"
      ? "movies"
      : reviewType === "tv"
      ? "tv"
      : "books";
    const dirPath = join(
      Deno.cwd(),
      config.content.basePath,
      config.content.reviews[categoryKey],
    );

    try {
      for await (const file of readDirectory(dirPath, ".md")) {
        const content = await readTextFile(file.path);
        const { frontmatter, content: body } = parseMarkdown(content);
        const parsed = parseReviewFilename(file.name);

        if (parsed) {
          reviews.push({
            ...frontmatter,
            slug: parsed.slug,
            type: reviewType,
            content: body,
            date: frontmatter.date || parsed.date,
          } as Review);
        }
      }
    } catch (error) {
      console.error(`Failed to read ${reviewType} reviews:`, error);
    }
  }

  return reviews.sort((a, b) => b.date.localeCompare(a.date));
}
