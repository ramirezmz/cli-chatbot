import axios from "axios";
import type { WeatherData } from "../types/index.ts";
import { measureAsync, logger } from "../modules/observability.ts";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const HOURLY = "temperature_2m";

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  return measureAsync(
    "api_openMeteo_getWeather",
    async () => {
      logger.info(
        `Fetching weather data for coordinates: ${latitude}, ${longitude}`
      );
      try {
        const response = await axios.get(BASE_URL, {
          params: {
            latitude,
            longitude,
            hourly: HOURLY,
            timezone: "America/Sao_Paulo",
          },
        });
        return response.data;
      } catch (error) {
        logger.error(
          `Error fetching weather data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw error; // Re-throw so UI can handle the error
      }
    },
    { latitude, longitude }
  );
}
