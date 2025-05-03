import axios from "axios";
import type { AddressResult } from "../types/index.ts";

const BASE_URL = "https://viacep.com.br/ws/";

export async function getAddressByZipCode(
  zipCode: string
): Promise<AddressResult> {
  const response = await axios.get(`${BASE_URL}${zipCode}/json/`);
  return response.data;
}

export async function searchZipCodeByAddress(
  uf: string,
  city: string,
  street: string
): Promise<AddressResult[]> {
  const response = await axios.get(`${BASE_URL}${uf}/${city}/${street}/json/`);
  return response.data;
}
