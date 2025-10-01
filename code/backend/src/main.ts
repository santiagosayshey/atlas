import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@^4.4.0/cors";
import { serveStatic } from "jsr:@hono/hono@^4.4.0/deno";
import reviewRoutes from "@/services/reviews/routes.ts";
import habitsRoutes from "@/services/habits/routes.ts";
import docsRoutes from "@/docs/routes.ts";
import { contentCache } from "@/utils/cache.ts";
import { reviewsLoader } from "@/services/reviews/loader.ts";
import { habitsLoader } from "@/services/habits/loader.ts";
import { logger } from "@/utils/logger.ts";

// Load environment variables from .env file
const env = await load({ export: true });
logger.info("Environment loaded", {
  hasTmdbKey: !!env.TMDB_API_KEY || !!Deno.env.get("TMDB_API_KEY"),
});

const app = new Hono();

// Enable CORS for all routes
app.use("/*", cors());

// Serve static files from .cache directory
app.use("/posters/*", serveStatic({ root: "./.cache" }));

app.get("/", (c) => c.text("Hello from Hono!"));

app.route("/", reviewRoutes);
app.route("/", habitsRoutes);
app.route("/", docsRoutes);

// Register content loaders
contentCache.registerLoader("reviews", reviewsLoader);
contentCache.registerLoader("habits", habitsLoader);

// Initialize cache and start watching before serving
await contentCache.loadCache();
await contentCache.startWatching();

Deno.serve({
  port: 7667,
  onListen: () => {
    logger.info("Server running", { url: "http://localhost:7667" });
  },
}, app.fetch);
