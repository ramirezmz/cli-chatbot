import axios from "axios";
import type { NominatimResponse } from "../types/index.ts";
import { measureAsync, logger } from "../modules/observability.ts";

const BASE_URL = "https://nominatim.openstreetmap.org/search";

export async function searchPlaceInformation(
  city: string
): Promise<NominatimResponse[]> {
  return measureAsync(
    "api_nominatim_searchPlaceInformation",
    async () => {
      logger.info(`Searching place information for: ${city}`);
      try {
        const response = await axios.get(BASE_URL, {
          params: {
            city,
            format: "json",
            addressdetails: 1,
            limit: 10,
          },
          headers: {
            // Add a user agent as required by Nominatim's usage policy
            "User-Agent": "CLI-Chatbot/1.0",
          },
        });
        logger.info(
          `Found ${response.data.length} locations for query: ${city}`
        );
        return response.data;
      } catch (error) {
        logger.error(
          `Error searching place information: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return [];
      }
    },
    { city }
  );
}
