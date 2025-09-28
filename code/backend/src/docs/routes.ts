import { Hono } from "@hono/hono";
import { readTextFile } from "@/utils/files.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

const routes = new Hono();

routes.get("/api/docs", async (c) => {
  try {
    const spec = await readTextFile(join(Deno.cwd(), "src/docs/openapi.yaml"));
    return c.text(spec, 200, { "Content-Type": "application/yaml" });
  } catch (error) {
    console.error("Failed to load OpenAPI spec:", error);
    return c.text("Failed to load API documentation", 500);
  }
});

routes.get("/api/swagger", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Atlas API - Swagger UI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/api/docs',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout"
          });
        };
      </script>
    </body>
    </html>
  `);
});

export default routes;