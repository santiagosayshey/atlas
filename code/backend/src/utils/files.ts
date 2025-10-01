import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

export async function readTextFile(path: string): Promise<string> {
  return await Deno.readTextFile(path);
}

export async function writeTextFile(
  path: string,
  content: string,
): Promise<void> {
  await Deno.writeTextFile(path, content);
}

export async function* readDirectory(path: string, extension?: string) {
  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile) {
      if (!extension || entry.name.endsWith(extension)) {
        yield { name: entry.name, path: join(path, entry.name) };
      }
    }
  }
}
