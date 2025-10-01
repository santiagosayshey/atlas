import { Hono } from "@hono/hono";
import { getAllReviews } from "./getAllReviews.ts";
import { getReview } from "./getReview.ts";
import { createReview, type CreateReviewInput } from "./createReview.ts";
import { updateReview, type UpdateReviewInput } from "./updateReview.ts";
import { deleteReview } from "./deleteReview.ts";

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

routes.post("/api/reviews", async (c) => {
  try {
    const body = await c.req.json();
    const input: CreateReviewInput = body;

    // Validate type field
    if (!input.type || !["movie", "tv", "book"].includes(input.type)) {
      return c.json(
        { error: "Invalid type. Must be 'movie', 'tv', or 'book'" },
        400,
      );
    }

    const result = await createReview(input);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(
      {
        message: "Review created successfully",
        review: result.review,
        filePath: result.filePath,
      },
      201,
    );
  } catch (error) {
    return c.json(
      {
        error: "Failed to parse request body",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
});

routes.put("/api/reviews/:type/:slug", async (c) => {
  try {
    const type = c.req.param("type") as "movie" | "tv" | "book";
    const slug = c.req.param("slug");

    // Validate type
    if (!["movie", "tv", "book"].includes(type)) {
      return c.json(
        { error: "Invalid type. Must be 'movie', 'tv', or 'book'" },
        400,
      );
    }

    const body = await c.req.json();
    const updates: UpdateReviewInput = body;

    const result = await updateReview(slug, type, updates);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      message: "Review updated successfully",
      review: result.review,
      filePath: result.filePath,
    });
  } catch (error) {
    return c.json(
      {
        error: "Failed to parse request body",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
});

routes.delete("/api/reviews/:type/:slug", async (c) => {
  const type = c.req.param("type") as "movie" | "tv" | "book";
  const slug = c.req.param("slug");

  // Validate type
  if (!["movie", "tv", "book"].includes(type)) {
    return c.json(
      { error: "Invalid type. Must be 'movie', 'tv', or 'book'" },
      400,
    );
  }

  const result = await deleteReview(slug, type);

  if (!result.success) {
    return c.json({ error: result.error }, 404);
  }

  return c.json({
    message: "Review deleted successfully",
    filePath: result.filePath,
  });
});

export default routes;
