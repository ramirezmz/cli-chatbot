import axios from "axios";
import type { WeatherData } from "../types/index.ts";
const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const HOURLY = "temperature_2m";

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const response = await axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      hourly: HOURLY,
      timezone: "America/Sao_Paulo",
    },
  });
  return response.data;
}
