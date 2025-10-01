import { Hono } from "@hono/hono";
import { getAllReviews } from "./getAllReviews.ts";
import { getReview } from "./getReview.ts";

const routes = new Hono();

routes.get("/api/reviews", (c) => {
  const type = c.req.query("type") as "movie" | "tv" | "book" | undefined;
  const reviews = getAllReviews(type);
  return c.json({ reviews });
});

routes.get("/api/reviews/:type/:slug", (c) => {
  const type = c.req.param("type") as "movie" | "tv" | "book";
  const slug = c.req.param("slug");
  const review = getReview(slug, type);

  if (!review) {
    return c.json({ error: "Review not found" }, 404);
  }

  return c.json({ review });
});

export default routes;
