import { parse } from "https://deno.land/std@0.208.0/yaml/mod.ts";
import { readTextFile } from "./files.ts";

export async function parseYamlFile<T>(path: string): Promise<T> {
  const content = await readTextFile(path);
  return parse(content) as T;
}
