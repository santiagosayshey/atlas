import type { Habit } from "@/types/habit.ts";
import { contentCache } from "@/utils/cache.ts";

export function getHabit(slug: string): Habit | null {
  const cache = contentCache.getCache();
  const habits = cache.habits || {};

  const habit = (habits.all || []).find((h: unknown) =>
    (h as Habit).slug === slug
  );
  return (habit as Habit) || null;
}
