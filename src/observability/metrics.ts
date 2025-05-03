import logger from "./logger.ts";

// Store metrics about API calls
interface ApiMetric {
  endpoint: string;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  totalResponseTime: number;
  averageResponseTime: number;
}

// In-memory metrics store
const apiMetrics = new Map<string, ApiMetric>();

/**
 * Record API call metrics
 * @param endpoint API endpoint called
 * @param responseTime Time taken for the API call in ms
 * @param success Whether the API call was successful
 */
export function recordApiCall(
  endpoint: string,
  responseTime: number,
  success: boolean
): void {
  const metrics = apiMetrics.get(endpoint) || {
    endpoint,
    totalCalls: 0,
    successCalls: 0,
    failedCalls: 0,
    totalResponseTime: 0,
    averageResponseTime: 0,
  };

  // Update metrics
  metrics.totalCalls += 1;
  metrics.totalResponseTime += responseTime;
  metrics.averageResponseTime = metrics.totalResponseTime / metrics.totalCalls;

  if (success) {
    metrics.successCalls += 1;
  } else {
    metrics.failedCalls += 1;
  }

  // Store updated metrics
  apiMetrics.set(endpoint, metrics);

  // Log the API call
  logger.http({
    message: `API call to ${endpoint} completed in ${responseTime.toFixed(
      2
    )}ms with ${success ? "success" : "failure"}`,
    endpoint,
    responseTime,
    success,
  });
}

/**
 * Get metrics for all API endpoints
 * @returns Map of all API metrics
 */
export function getApiMetrics(): Map<string, ApiMetric> {
  return apiMetrics;
}

/**
 * Get metrics for a specific API endpoint
 * @param endpoint API endpoint
 * @returns Metrics for the specified endpoint or undefined if not found
 */
export function getEndpointMetrics(endpoint: string): ApiMetric | undefined {
  return apiMetrics.get(endpoint);
}

/**
 * Log summary of all API metrics
 */
export function logApiMetricsSummary(): void {
  const metrics = Array.from(apiMetrics.values());

  logger.info({
    message: `API Metrics Summary: ${metrics.length} endpoints tracked`,
    totalEndpoints: metrics.length,
    totalCalls: metrics.reduce((sum, m) => sum + m.totalCalls, 0),
    successRate:
      metrics.reduce((sum, m) => sum + m.successCalls, 0) /
      metrics.reduce((sum, m) => sum + m.totalCalls, 0),
    endpoints: metrics.map((m) => ({
      endpoint: m.endpoint,
      calls: m.totalCalls,
      successRate: m.successCalls / m.totalCalls,
      avgResponseTime: m.averageResponseTime,
    })),
  });
}
