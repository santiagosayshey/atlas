export interface Habit {
  slug: string;
  name: string;
  description: string;
  steps: string[];
  frequency: "daily" | "weekly" | "monthly"; // Must be one of: daily, weekly, monthly
}
