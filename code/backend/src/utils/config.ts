import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import type { Config } from "@/types/config.ts";
import { parseYamlFile } from "@/utils/yaml.ts";

class ConfigLoader {
  private static instance: ConfigLoader;
  private config: Config | null = null;
  private configPath: string;

  private constructor() {
    this.configPath = join(Deno.cwd(), "config.yaml");
  }

  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  public async getConfig(): Promise<Config> {
    if (!this.config) {
      this.config = await parseYamlFile<Config>(this.configPath);
    }
    return this.config;
  }

  public async reload(): Promise<Config> {
    this.config = await parseYamlFile<Config>(this.configPath);
    return this.config;
  }
}

export const configLoader = ConfigLoader.getInstance();
