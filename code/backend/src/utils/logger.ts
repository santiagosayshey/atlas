import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { configLoader } from "@/utils/config.ts";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private static instance: Logger;
  private logsDir: string | null = null;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async ensureLogsDir(): Promise<string> {
    if (!this.logsDir) {
      const config = await configLoader.getConfig();
      this.logsDir = join(Deno.cwd(), config.logs.directory);

      try {
        await Deno.mkdir(this.logsDir, { recursive: true });
      } catch {
        // Directory might already exist
      }
    }
    return this.logsDir;
  }

  private getLogFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}.jsonl`;
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    try {
      const logsDir = await this.ensureLogsDir();
      const logFile = join(logsDir, this.getLogFileName());
      const line = JSON.stringify(entry) + "\n";

      await Deno.writeTextFile(logFile, line, { append: true });
    } catch (_error) {
      console.error("Failed to write log to file:", _error);
    }
  }

  private formatConsoleOutput(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString().replace("T", " ")
      .replace("Z", "");
    const level = entry.level.padEnd(5);

    // ANSI color codes
    const colors = {
      DEBUG: "\x1b[36m", // Cyan
      INFO: "\x1b[32m", // Green
      WARN: "\x1b[33m", // Yellow
      ERROR: "\x1b[31m", // Red
      RESET: "\x1b[0m",
      GRAY: "\x1b[90m",
    };

    const levelColor = colors[entry.level] || colors.RESET;
    let output =
      `${colors.GRAY}${timestamp}${colors.RESET}  ${levelColor}${level}${colors.RESET}  ${entry.message}`;

    // Add data if present
    if (entry.data && Object.keys(entry.data).length > 0) {
      const dataStr = Object.entries(entry.data)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(" ");
      output += `  ${colors.GRAY}${dataStr}${colors.RESET}`;
    }

    // Add error if present
    if (entry.error) {
      output +=
        `\n  ${colors.GRAY}└─${colors.RESET} ${colors.ERROR}${entry.error.message}${colors.RESET}`;
      if (entry.error.stack) {
        const stackLines = entry.error.stack.split("\n").slice(1, 4); // First 3 stack frames
        stackLines.forEach((line) => {
          output += `\n     ${colors.GRAY}${line.trim()}${colors.RESET}`;
        });
      }
    }

    return output;
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (data && Object.keys(data).length > 0) {
      entry.data = data;
    }

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack,
      };
    }

    // Write to file asynchronously (don't await to avoid blocking)
    this.writeToFile(entry);

    // Write to console
    console.log(this.formatConsoleOutput(entry));
  }

  public debug(
    message: string,
    data?: Record<string, unknown>,
    error?: Error,
  ): void {
    this.log("DEBUG", message, data, error);
  }

  public info(
    message: string,
    data?: Record<string, unknown>,
    error?: Error,
  ): void {
    this.log("INFO", message, data, error);
  }

  public warn(
    message: string,
    data?: Record<string, unknown>,
    error?: Error,
  ): void {
    this.log("WARN", message, data, error);
  }

  public error(
    message: string,
    data?: Record<string, unknown>,
    error?: Error,
  ): void {
    this.log("ERROR", message, data, error);
  }
}

export const logger = Logger.getInstance();
