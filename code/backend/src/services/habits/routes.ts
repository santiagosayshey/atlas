import { Hono } from "@hono/hono";
import { getAllHabits } from "./getAllHabits.ts";
import { getHabit } from "./getHabit.ts";

const routes = new Hono();

routes.get("/api/habits", (c) => {
  const habits = getAllHabits();
  return c.json({ habits });
});

routes.get("/api/habits/:slug", (c) => {
  const slug = c.req.param("slug");
  const habit = getHabit(slug);

  if (!habit) {
    return c.json({ error: "Habit not found" }, 404);
  }

  return c.json({ habit });
});

export default routes;
