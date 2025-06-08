import api from "@/src/api/api";
import { MinistryDTO } from "@/src/dto/MinistryDTO";

export const createMinistry = async (ministryData: MinistryDTO) => {
  try {
    const response = await api.post("/ministry/ministries", ministryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ministério:", error);
    throw error;
  }
};

export const updateMinistry = async (
  id: string,
  ministryData: Partial<MinistryDTO>,
) => {
  try {
    const response = await api.put(`/ministry/ministries/${id}`, ministryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar ministério:", error);
    throw error;
  }
};

export const getMinisteries = async (): Promise<MinistryDTO[]> => {
  try {
    const response = await api.get("/ministry/ministries");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ministérios:", error);
    throw error;
  }
};

export const getMinistryById = async (id: string) => {
  try {
    const response = await api.get(`/ministry/ministries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ministério:", error);
    throw error;
  }
};

export const deleteMinistry = async (id: string) => {
  try {
    const response = await api.delete(`/ministry/ministries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar ministério:", error);
    throw error;
  }
};

export const updateMinistryMembers = async (
  ministryId: string,
  memberIds: string[],
) => {
  return api.patch(`/ministry/ministries/${ministryId}/members`, {
    members: memberIds,
  });
};
