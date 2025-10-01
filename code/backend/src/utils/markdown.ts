import { extract } from "https://deno.land/std@0.208.0/front_matter/yaml.ts";
import { stringify as stringifyYaml } from "https://deno.land/std@0.208.0/yaml/stringify.ts";

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

export function generateMarkdown(
  frontmatter: Record<string, unknown>,
  content: string,
): string {
  const yaml = stringifyYaml(frontmatter).trim();
  return `---\n${yaml}\n---\n\n${content}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "_")
    .replace(/^-+|-+$/g, "");
}
