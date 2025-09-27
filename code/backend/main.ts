import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello from Hono!"));

app.get("/api/test", (c) => {
  return c.json({ data: "Test data from backend" });
});

Deno.serve({ port: 7667 }, app.fetch);
console.log("Server running on http://localhost:7667");