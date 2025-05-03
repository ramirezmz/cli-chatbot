import axios from "axios";
import type { City, State } from "../types/index.ts";

const BASE_URL = "https://servicodados.ibge.gov.br/api/v1";

export async function getAllStates(): Promise<State[]> {
  const response = await axios.get(`${BASE_URL}/localidades/estados`, {
    params: {
      orderBy: "nome",
    },
  });
  return response.data;
}

export async function getCitiesByState(uf: string): Promise<City[]> {
  const response = await axios.get(
    `${BASE_URL}/localidades/estados/${uf}/municipios`,
    {
      params: {
        orderBy: "nome",
      },
    }
  );
  return response.data;
}
