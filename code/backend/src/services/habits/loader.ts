import type { Habit } from "@/types/habit.ts";
import type { ContentLoader } from "@/utils/cache.ts";
import { readDirectory, readTextFile } from "@/utils/files.ts";
import { logger } from "@/utils/logger.ts";

function parseHabitFile(content: string, filename: string): Habit | null {
  // Extract slug from filename
  const slug = filename.replace(".md", "");

  // Extract sections using regex
  const nameMatch = content.match(/^#\s+(.+)$/m);
  const descriptionMatch = content.match(/##\s+Description\s+([^#]+)/s);
  const templateMatch = content.match(/##\s+Template\s+([^#]+)/s);
  const frequencyMatch = content.match(/##\s+Frequency\s+([^#-]+)/s);

  if (!nameMatch || !descriptionMatch || !templateMatch || !frequencyMatch) {
    logger.warn("Invalid habit file format", { filename });
    return null;
  }

  const name = nameMatch[1].trim();
  const description = descriptionMatch[1].trim();
  const template = templateMatch[1].trim();
  const frequencyText = frequencyMatch[1].trim().toLowerCase();

  // Map frequency text to valid types
  let frequency: "daily" | "weekly" | "monthly";
  if (frequencyText.includes("day") || frequencyText.includes("daily")) {
    frequency = "daily";
  } else if (frequencyText.includes("week")) {
    frequency = "weekly";
  } else if (frequencyText.includes("month")) {
    frequency = "monthly";
  } else {
    logger.warn("Unknown frequency type, defaulting to daily", {
      filename,
      frequencyText,
    });
    frequency = "daily";
  }

  return {
    slug,
    name,
    description,
    template,
    frequency,
  };
}

export const habitsLoader: ContentLoader = async (
  dirPath: string,
  _categoryKey: string,
): Promise<Habit[]> => {
  const habits: Habit[] = [];

  try {
    for await (const file of readDirectory(dirPath, ".md")) {
      const content = await readTextFile(file.path);
      const habit = parseHabitFile(content, file.name);

      if (habit) {
        habits.push(habit);
      }
    }
  } catch (error) {
    logger.error(
      "Failed to load habits",
      { dirPath },
      error instanceof Error ? error : undefined,
    );
  }

  return habits.sort((a, b) => a.name.localeCompare(b.name));
};
