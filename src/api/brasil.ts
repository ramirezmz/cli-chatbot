import axios from "axios";
import type { City, State } from "../types/index.ts";
import { measureAsync, logger } from "../modules/observability.ts";

const BASE_URL = "https://servicodados.ibge.gov.br/api/v1";

export async function getAllStates(): Promise<State[]> {
  return measureAsync(
    "api_brasil_getAllStates",
    async () => {
      logger.info("Fetching all Brazilian states");
      try {
        const response = await axios.get(`${BASE_URL}/localidades/estados`, {
          params: {
            orderBy: "nome",
          },
        });
        logger.info(`Retrieved ${response.data.length} states`);
        return response.data;
      } catch (error) {
        logger.error(
          `Error fetching Brazilian states: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return [];
      }
    },
    {}
  );
}

export async function getCitiesByState(uf: string): Promise<City[]> {
  return measureAsync(
    "api_brasil_getCitiesByState",
    async () => {
      logger.info(`Fetching cities for state: ${uf}`);
      try {
        const response = await axios.get(
          `${BASE_URL}/localidades/estados/${uf}/municipios`,
          {
            params: {
              orderBy: "nome",
            },
          }
        );
        logger.info(`Retrieved ${response.data.length} cities for state ${uf}`);
        return response.data;
      } catch (error) {
        logger.error(
          `Error fetching cities for state ${uf}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return [];
      }
    },
    { uf }
  );
}
