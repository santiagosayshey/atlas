import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts";
import type { TMDBMetadata } from "@/types/review.ts";
import { logger } from "@/utils/logger.ts";

const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const CACHE_DIR = join(Deno.cwd(), ".cache", "tmdb");

/**
 * Get cache file path for a TMDB entry
 */
function getCacheFilePath(type: "movie" | "tv", tmdbId: string): string {
  return join(CACHE_DIR, `${type}-${tmdbId}.json`);
}

/**
 * Load metadata from disk cache
 */
async function loadFromCache(
  type: "movie" | "tv",
  tmdbId: string,
): Promise<TMDBMetadata | null> {
  try {
    const cachePath = getCacheFilePath(type, tmdbId);
    const data = await Deno.readTextFile(cachePath);
    logger.debug("TMDB disk cache hit", { tmdbId, type });
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Save metadata to disk cache
 */
async function saveToCache(
  type: "movie" | "tv",
  tmdbId: string,
  metadata: TMDBMetadata,
): Promise<void> {
  try {
    await ensureDir(CACHE_DIR);
    const cachePath = getCacheFilePath(type, tmdbId);
    await Deno.writeTextFile(cachePath, JSON.stringify(metadata, null, 2));
    logger.debug("TMDB metadata cached to disk", { tmdbId, type });
  } catch (error) {
    logger.error(
      "Failed to save TMDB cache",
      { tmdbId, type },
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Fetch movie metadata from TMDB
 */
export async function fetchMovieMetadata(
  tmdbId: string,
): Promise<TMDBMetadata | null> {
  // Check disk cache first
  const cached = await loadFromCache("movie", tmdbId);
  if (cached) {
    return cached;
  }

  if (!TMDB_API_KEY) {
    logger.warn("TMDB_API_KEY not set, skipping metadata fetch");
    return null;
  }

  try {
    const url =
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
    const response = await fetch(url);

    if (!response.ok) {
      logger.error("TMDB API error", { tmdbId, status: response.status });
      return null;
    }

    const data = await response.json();

    // Extract director from crew
    const director = data.credits?.crew?.find(
      (person: { job: string }) => person.job === "Director",
    )?.name;

    const metadata: TMDBMetadata = {
      director,
      genres: data.genres?.map((g: { name: string }) => g.name) || [],
      runtime: data.runtime,
      releaseDate: data.release_date,
      overview: data.overview,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
    };

    // Save to disk cache
    await saveToCache("movie", tmdbId, metadata);

    logger.info("TMDB metadata fetched from API", { tmdbId, type: "movie" });

    return metadata;
  } catch (error) {
    logger.error(
      "Failed to fetch TMDB metadata",
      { tmdbId, type: "movie" },
      error instanceof Error ? error : undefined,
    );
    return null;
  }
}

/**
 * Fetch TV show metadata from TMDB
 */
export async function fetchTVMetadata(
  tmdbId: string,
): Promise<TMDBMetadata | null> {
  // Check disk cache first
  const cached = await loadFromCache("tv", tmdbId);
  if (cached) {
    return cached;
  }

  if (!TMDB_API_KEY) {
    logger.warn("TMDB_API_KEY not set, skipping metadata fetch");
    return null;
  }

  try {
    const url =
      `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
    const response = await fetch(url);

    if (!response.ok) {
      logger.error("TMDB API error", { tmdbId, status: response.status });
      return null;
    }

    const data = await response.json();

    // For TV shows, get the creator instead of director
    const director = data.created_by?.[0]?.name;

    const metadata: TMDBMetadata = {
      director,
      genres: data.genres?.map((g: { name: string }) => g.name) || [],
      runtime: data.episode_run_time?.[0],
      releaseDate: data.first_air_date,
      overview: data.overview,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
    };

    // Save to disk cache
    await saveToCache("tv", tmdbId, metadata);

    logger.info("TMDB metadata fetched from API", { tmdbId, type: "tv" });

    return metadata;
  } catch (error) {
    logger.error(
      "Failed to fetch TMDB metadata",
      { tmdbId, type: "tv" },
      error instanceof Error ? error : undefined,
    );
    return null;
  }
}
