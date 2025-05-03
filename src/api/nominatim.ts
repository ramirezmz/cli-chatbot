import axios from "axios";
import type { NominatimResponse } from "../types/index.ts";

const BASE_URL = "https://nominatim.openstreetmap.org/search";

export async function searchPlaceInformation(
  city: string
): Promise<NominatimResponse[]> {
  const response = await axios.get(BASE_URL, {
    params: {
      city,
      format: "json",
      addressdetails: 1,
      limit: 10,
    },
  });
  return response.data;
}
