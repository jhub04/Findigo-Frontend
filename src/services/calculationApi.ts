import type { CalculationEntity, CalculationRequest } from "@/types/CalculationDTO.ts";
import apiClient from '@/services/apiClient.ts'
import { useTokenStore } from '@/stores/token.ts'

export const calculate = async (data: CalculationRequest): Promise<CalculationEntity> => {
  const tokenStore = useTokenStore();
  const username = tokenStore.loggedInUser;

  const response = await apiClient.post<CalculationEntity>(`/calculator/calculations/${username}`, data);
  return response.data;
};

export const getCalculations = async (): Promise<CalculationEntity[]> => {
  const tokenStore = useTokenStore();
  const username = tokenStore.loggedInUser;
  const jwtToken = tokenStore.jwtToken;

  if (!username || !jwtToken) {
    throw new Error("User is not logged in or token is missing.");
  }

  try {
    const response = await apiClient.get<CalculationEntity[]>(`/calculator/calculations/${username}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    return response.data || [];
  } catch (error) {
    console.error(`Failed to fetch calculations: ${error} `);
    return [];
  }
};

export const deleteCalculation = async (id: number): Promise<void> => {
  const tokenStore = useTokenStore();
  const username = tokenStore.loggedInUser;
  const jwtToken = tokenStore.jwtToken;
  console.log(username)

  if (!username || !jwtToken) {
    throw new Error("User is not logged in or token is missing.");
  }

  try {
    await apiClient.delete(`/calculator/calculations/${username}/${id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  } catch (error) {
    console.error(`Failed to delete calculation with ID ${id}: ${error}`);
  }
};

export const deleteAllCalculations = async (): Promise<void> => {
  const tokenStore = useTokenStore();
  const username = tokenStore.loggedInUser;
  const jwtToken = tokenStore.jwtToken;

  if (!username || !jwtToken) {
    throw new Error("User is not logged in or token is missing.");
  }

  try {
    await apiClient.delete(`/calculator/calculations/${username}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  } catch (error) {
    console.error(`Failed to delete all calculations: ${error}`);
  }
};

const calculationApi = {
  calculate,
  getCalculations,
  deleteCalculation,
  deleteAllCalculations
};

export default calculationApi;
