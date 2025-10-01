import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { logger } from "@/utils/logger.ts";

/**
 * Downloads an image from a URL and saves it locally
 * Returns the local path relative to the public directory
 */
export async function downloadImage(
  url: string,
  filename: string,
): Promise<string | null> {
  try {
    const postersDir = join(Deno.cwd(), ".cache", "posters");
    await ensureDir(postersDir);

    const filePath = join(postersDir, filename);

    // Check if file already exists
    try {
      await Deno.stat(filePath);
      logger.debug("Image already cached", { filename });
      return `/posters/${filename}`;
    } catch {
      // File doesn't exist, continue with download
    }

    const response = await fetch(url);

    if (!response.ok) {
      logger.error("Failed to download image", {
        url,
        status: response.status,
      });
      return null;
    }

    const imageData = await response.arrayBuffer();

    await Deno.writeFile(filePath, new Uint8Array(imageData));

    logger.info("Image downloaded", { url, filename });

    // Return the path that will be accessible via the static file server
    return `/posters/${filename}`;
  } catch (error) {
    logger.error(
      "Failed to download image",
      { url, filename },
      error instanceof Error ? error : undefined,
    );
    return null;
  }
}

/**
 * Generate a safe filename from a URL
 * Includes slug and URL hash to ensure uniqueness when URL changes
 */
export function getImageFilename(url: string, slug: string): string {
  // Extract meaningful ID from common poster URLs
  let identifier = "";

  // ThePosterDB: https://theposterdb.com/api/assets/581040
  const posterDbMatch = url.match(/\/assets\/(\d+)/);
  if (posterDbMatch) {
    identifier = posterDbMatch[1];
  }

  // TMDB: https://image.tmdb.org/t/p/w500/abc123.jpg
  const tmdbMatch = url.match(/\/p\/w\d+\/([^/]+)\.(jpg|png|webp)/);
  if (tmdbMatch) {
    identifier = tmdbMatch[1];
  }

  // If no pattern matched, create a hash from the URL
  if (!identifier) {
    // Simple hash of the URL for uniqueness
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    identifier = Math.abs(hash).toString(36);
  }

  return `${slug}-${identifier}.png`;
}
