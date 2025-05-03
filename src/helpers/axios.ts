import axios from "axios";
import now from "performance-now";
import { recordApiCall } from "../logs/apiMetrics.ts";
import logger from "../logs/logger.ts";

/**
 * Configure axios interceptors for API monitoring
 */
export function setupAxiosInterceptors(): void {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Store start time in request config
      config.metadata = { startTime: now() };

      // Extract endpoint for logging
      const url = config.url || "unknown";
      const endpoint = url.split("?")[0]; // Remove query parameters

      logger.debug({
        message: `API request started: ${config.method?.toUpperCase()} ${endpoint}`,
        method: config.method?.toUpperCase(),
        url: endpoint,
      });

      return config;
    },
    (error) => {
      logger.error({
        message: "API request error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      const config = response.config;
      // Calculate response time
      const endTime = now();
      const startTime =
        (config.metadata as { startTime: number })?.startTime || endTime;
      const responseTime = endTime - startTime;

      // Extract endpoint for metrics
      const url = config.url || "unknown";
      const endpoint = url.split("?")[0]; // Remove query parameters

      // Record successful API call
      recordApiCall(endpoint, responseTime, true);

      return response;
    },
    (error) => {
      // Handle error response
      const config = error.config || {};
      // Calculate response time
      const endTime = now();
      const startTime =
        (config.metadata as { startTime: number })?.startTime || endTime;
      const responseTime = endTime - startTime;

      // Extract endpoint for metrics
      const url = config.url || "unknown";
      const endpoint = url.split("?")[0]; // Remove query parameters

      // Record failed API call
      recordApiCall(endpoint, responseTime, false);

      // Log the error
      logger.error({
        message: `API request failed: ${config.method?.toUpperCase()} ${endpoint}`,
        method: config.method?.toUpperCase(),
        url: endpoint,
        status: error.response?.status,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });

      return Promise.reject(error);
    }
  );
}
