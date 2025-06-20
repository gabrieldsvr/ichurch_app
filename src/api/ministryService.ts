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
    return response.data as MinistryDTO;
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
  memberIds: { id: string; role: "LEADER" | "AUX" | "MEMBER" }[],
) => {
  return api.patch(`/ministry/ministries/${ministryId}/members`, {
    members: memberIds,
  });
};

export async function getMinistryMembers(ministryId: string) {
  const res = await api.get(`/ministry/ministries/${ministryId}/members`);
  return res.data.filter((m) => m.status === "ativo");
}

export const getCellGroupsByMinistry = async (ministryId: string) => {
  return api.get(`/ministry/ministries/${ministryId}/cell_groups`);
};
