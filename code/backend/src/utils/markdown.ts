import { extract } from "https://deno.land/std@0.208.0/front_matter/yaml.ts";

export function parseMarkdown(content: string) {
  const { attrs, body } = extract(content);
  return {
    frontmatter: attrs,
    content: body.trim(),
  };
}

export function parseReviewFilename(
  filename: string,
): { date: string; slug: string } | null {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})_(.+)\.md$/);
  if (!match) return null;
  return { date: match[1], slug: match[2] };
}
