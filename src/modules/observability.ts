import logger from "../observability/logger.ts";
import { setupAxiosInterceptors } from "../observability/interceptors.ts";
import {
  startSession,
  endSession,
  recordCommandUsage,
  logCommandMetricsSummary,
} from "../observability/sessions.ts";
import { logApiMetricsSummary } from "../observability/metrics.ts";
import { measureAsync } from "../observability/perfomance.ts";

let currentSessionId: string | null = null;

export function initObservability(): void {
  setupAxiosInterceptors();

  currentSessionId = startSession();

  process.on("exit", () => {
    if (currentSessionId) {
      endSession(currentSessionId);
    }
    logCommandMetricsSummary();
    logApiMetricsSummary();
    logger.info("Application shutting down");
  });

  process.on("uncaughtException", (error) => {
    logger.error({
      message: "Uncaught exception",
      error: error instanceof Error ? error.stack : "Unknown error",
    });
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error({
      message: "Unhandled promise rejection",
      reason: reason instanceof Error ? reason.stack : String(reason),
    });
  });

  logger.info("Observability initialized");
}

/**
 * Track a command execution
 * @param command Command name
 */
export function trackCommand(command: string): void {
  if (currentSessionId) {
    recordCommandUsage(currentSessionId, command);
  }
}

export { logger, measureAsync, startSession, endSession };
