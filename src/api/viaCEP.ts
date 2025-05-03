import axios from "axios";
import type { AddressResult } from "../types/index.ts";
import { measureAsync, logger } from "../modules/observability.ts";

const BASE_URL = "https://viacep.com.br/ws/";

export async function getAddressByZipCode(
  zipCode: string
): Promise<AddressResult> {
  return measureAsync(
    "api_viaCEP_getAddressByZipCode",
    async () => {
      logger.info(`Fetching address for CEP: ${zipCode}`);
      try {
        const response = await axios.get(`${BASE_URL}${zipCode}/json/`);
        return response.data;
      } catch (error) {
        logger.error(
          `Error fetching address for CEP ${zipCode}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return { erro: true } as AddressResult;
      }
    },
    { zipCode }
  );
}

export async function searchZipCodeByAddress(
  uf: string,
  city: string,
  street: string
): Promise<AddressResult[]> {
  return measureAsync(
    "api_viaCEP_searchZipCodeByAddress",
    async () => {
      logger.info(`Searching CEP by address: ${uf}, ${city}, ${street}`);
      try {
        const response = await axios.get(
          `${BASE_URL}${uf}/${city}/${street}/json/`
        );
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        logger.error(
          `Error searching CEP by address: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return [];
      }
    },
    { uf, city, street }
  );
}
