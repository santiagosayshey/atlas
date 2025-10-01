import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@^4.4.0/cors";
import reviewRoutes from "@/services/reviews/routes.ts";
import docsRoutes from "@/docs/routes.ts";
import { contentCache } from "@/utils/cache.ts";
import { reviewsLoader } from "@/services/reviews/loader.ts";
import { logger } from "@/utils/logger.ts";

const app = new Hono();

// Enable CORS for all routes
app.use("/*", cors());

app.get("/", (c) => c.text("Hello from Hono!"));

app.route("/", reviewRoutes);
app.route("/", docsRoutes);

// Register content loaders
contentCache.registerLoader("reviews", reviewsLoader);

// Initialize cache and start watching before serving
await contentCache.loadCache();
await contentCache.startWatching();

Deno.serve({
  port: 7667,
  onListen: () => {
    logger.info("Server running", { url: "http://localhost:7667" });
  },
}, app.fetch);
