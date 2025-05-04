import axios from "axios";
import now from "performance-now";
import { recordApiCall } from "./metrics.ts";
import logger from "./logger.ts";

/**
 * Configure axios interceptors for API monitoring
 */
export function setupAxiosInterceptors(): void {
  axios.interceptors.request.use(
    (config) => {
      config.metadata = { startTime: now() };

      const url = config.url || "unknown";
      const endpoint = url.split("?")[0];

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
      const endTime = now();
      const startTime =
        (config.metadata as { startTime: number })?.startTime || endTime;
      const responseTime = endTime - startTime;

      const url = config.url || "unknown";
      const endpoint = url.split("?")[0];

      recordApiCall(endpoint, responseTime, true);

      return response;
    },
    (error) => {
      const config = error.config || {};
      const endTime = now();
      const startTime =
        (config.metadata as { startTime: number })?.startTime || endTime;
      const responseTime = endTime - startTime;

      const url = config.url || "unknown";
      const endpoint = url.split("?")[0];

      recordApiCall(endpoint, responseTime, false);

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
