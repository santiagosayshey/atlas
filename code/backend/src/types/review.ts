export interface Review {
  // Required fields from frontmatter
  title: string;
  date: string; // YYYY-MM-DD
  rating: number;

  // Media-specific
  tmdb_id?: string;
  isbn?: string;
  season?: number;

  // Optional fields
  tags?: string[];
  with?: string[];
  revisit?: boolean;
  poster?: string;
  finished?: boolean;

  // Added by system
  slug?: string;
  type?: "movie" | "tv" | "book";
  content?: string;
}
