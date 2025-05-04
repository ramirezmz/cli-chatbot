import now from "performance-now";
import logger from "./logger.ts";

const timers = new Map<string, number>();

/**
 * Start timing an operation
 * @param operationName Name of the operation to time
 */
export function startTimer(operationName: string): void {
  timers.set(operationName, now());
  logger.debug(`Started timer for operation: ${operationName}`);
}

/**
 * End timing an operation and log the duration
 * @param operationName Name of the operation that was being timed
 * @param additionalInfo Additional information to log with the timing
 */
export function endTimer(
  operationName: string,
  additionalInfo: Record<string, any> = {}
): number {
  if (!timers.has(operationName)) {
    logger.warn(`No timer found for operation: ${operationName}`);
    return 0;
  }

  const startTime = timers.get(operationName) as number;
  const duration = now() - startTime;
  timers.delete(operationName);

  logger.info({
    message: `Operation ${operationName} completed in ${duration.toFixed(2)}ms`,
    operation: operationName,
    durationMs: duration,
    ...additionalInfo,
  });

  return duration;
}

/**
 * Measure the execution time of an async function
 * @param operationName Name of the operation
 * @param fn Function to measure
 * @returns Result of the function
 */
export async function measureAsync<T>(
  operationName: string,
  fn: () => Promise<T>,
  additionalInfo: Record<string, any> = {}
): Promise<T> {
  startTimer(operationName);
  try {
    const result = await fn();
    endTimer(operationName, additionalInfo);
    return result;
  } catch (error) {
    endTimer(operationName, {
      ...additionalInfo,
      error: true,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
