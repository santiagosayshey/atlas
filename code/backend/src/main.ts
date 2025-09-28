import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@^4.4.0/cors";
import reviewRoutes from "@/services/reviews/routes.ts";
import docsRoutes from "@/docs/routes.ts";

const app = new Hono();

// Enable CORS for all routes
app.use("/*", cors());

app.get("/", (c) => c.text("Hello from Hono!"));

app.route("/", reviewRoutes);
app.route("/", docsRoutes);

Deno.serve({ port: 7667 }, app.fetch);
console.log("Server running on http://localhost:7667");
