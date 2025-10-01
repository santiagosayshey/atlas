import type { Habit } from "@/types/habit.ts";
import { contentCache } from "@/utils/cache.ts";

export function getAllHabits(): Habit[] {
  const cache = contentCache.getCache();
  const habits = cache.habits || {};

  return (habits.all || []) as Habit[];
}
