import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { configLoader } from "@/utils/config.ts";
import { logger } from "@/utils/logger.ts";

// Generic cache structure: { reviews: { movies: [...], tv: [...] }, habits: { daily: [...] } }
export type CacheData = Record<string, Record<string, unknown[]>>;

// Content loader function type - services provide these
export type ContentLoader = (
  dirPath: string,
  categoryKey: string,
) => Promise<unknown[]>;

class ContentCache {
  private static instance: ContentCache;
  private cache: CacheData = {};
  private watchers: Deno.FsWatcher[] = [];
  private isWatching = false;
  private loaders: Map<string, ContentLoader> = new Map();
  private reloadTimeout: number | null = null;

  private constructor() {}

  public static getInstance(): ContentCache {
    if (!ContentCache.instance) {
      ContentCache.instance = new ContentCache();
    }
    return ContentCache.instance;
  }

  public registerLoader(contentType: string, loader: ContentLoader): void {
    this.loaders.set(contentType, loader);
  }

  public getCache(): CacheData {
    return this.cache;
  }

  private async reloadCache(): Promise<void> {
    const config = await configLoader.getConfig();
    const basePath = join(Deno.cwd(), config.content.basePath);
    const newCache: CacheData = {};

    // Dynamically iterate over all content types in config
    for (const [contentType, categories] of Object.entries(config.content)) {
      if (contentType === "basePath" || typeof categories !== "object") {
        continue;
      }

      const loader = this.loaders.get(contentType);
      if (!loader) {
        logger.warn("No loader registered for content type", { contentType });
        continue;
      }

      newCache[contentType] = {};

      // Iterate over all categories within this content type
      for (
        const [categoryKey, categoryPath] of Object.entries(
          categories as Record<string, string>,
        )
      ) {
        const dirPath = join(basePath, categoryPath);
        try {
          newCache[contentType][categoryKey] = await loader(
            dirPath,
            categoryKey,
          );
        } catch (error) {
          logger.error("Failed to load content", {
            contentType,
            categoryKey,
            dirPath,
          }, error instanceof Error ? error : undefined);
          newCache[contentType][categoryKey] = [];
        }
      }
    }

    this.cache = newCache;

    // Log summary
    const summary: Record<string, Record<string, number>> = {};
    for (const [type, cats] of Object.entries(newCache)) {
      summary[type] = {};
      for (const [cat, items] of Object.entries(cats)) {
        summary[type][cat] = items.length;
      }
    }
    logger.info("Cache loaded", summary);
  }

  public async loadCache(): Promise<void> {
    await this.reloadCache();
  }

  private debouncedReload(): void {
    if (this.reloadTimeout !== null) {
      clearTimeout(this.reloadTimeout);
    }
    this.reloadTimeout = setTimeout(() => {
      this.reloadCache();
      this.reloadTimeout = null;
    }, 100); // 100ms debounce
  }

  public async startWatching(): Promise<void> {
    if (this.isWatching) {
      logger.warn("Cache watcher already running");
      return;
    }

    const config = await configLoader.getConfig();
    const basePath = join(Deno.cwd(), config.content.basePath);
    const paths: string[] = [];

    // Dynamically collect all content directory paths
    for (const [contentType, categories] of Object.entries(config.content)) {
      if (contentType === "basePath" || typeof categories !== "object") {
        continue;
      }

      for (
        const categoryPath of Object.values(
          categories as Record<string, string>,
        )
      ) {
        paths.push(join(basePath, categoryPath));
      }
    }

    // Watch all content directories
    const watchedPaths: string[] = [];
    for (const path of paths) {
      try {
        const watcher = Deno.watchFs(path);
        this.watchers.push(watcher);

        (async () => {
          for await (const event of watcher) {
            if (
              event.kind === "modify" || event.kind === "create" ||
              event.kind === "remove"
            ) {
              logger.debug("Content file event detected", {
                kind: event.kind,
                paths: event.paths,
              });
              await this.reloadCache();
            }
          }
        })();

        // Store relative path from basePath
        watchedPaths.push(path.replace(basePath + "/", ""));
      } catch (error) {
        logger.error(
          "Failed to watch content directory",
          { path },
          error instanceof Error ? error : undefined,
        );
      }
    }

    if (watchedPaths.length > 0) {
      logger.info("Watching content directories", { paths: watchedPaths });
    }

    // Watch config file
    const configPath = join(Deno.cwd(), "config.yaml");
    try {
      const configWatcher = Deno.watchFs(configPath);
      this.watchers.push(configWatcher);

      (async () => {
        for await (const event of configWatcher) {
          if (event.kind === "modify") {
            logger.info("Config file changed, reloading");
            await configLoader.reload();
            // Restart watchers with new config paths
            this.stopWatching();
            await this.reloadCache();
            await this.startWatching();
          }
        }
      })();

      logger.info("Watching config file", { path: "config.yaml" });
    } catch (error) {
      logger.error(
        "Failed to watch config file",
        { path: configPath },
        error instanceof Error ? error : undefined,
      );
    }

    this.isWatching = true;
  }

  public stopWatching(): void {
    for (const watcher of this.watchers) {
      try {
        watcher.close();
      } catch (error) {
        logger.error(
          "Failed to close watcher",
          {},
          error instanceof Error ? error : undefined,
        );
      }
    }
    this.watchers = [];
    this.isWatching = false;
    logger.info("Cache watchers stopped");
  }
}

export const contentCache = ContentCache.getInstance();
