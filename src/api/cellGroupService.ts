import api from "@/src/api/api";

interface CreateCellGroupPayload {
  name: string;
  description?: string;
  members: string[];
}

export const createCellGroup = async (ministryId: string, data: any) => {
  return api.post("/ministry/cell-groups", {
    ...data,
    ministry_id: ministryId,
  });
};

export const updateCellGroup = async (
  id: string,
  data: {
    name: string;
    description?: string;
    members: string[]; // ou outro tipo adequado
  },
) => {
  try {
    const response = await api.put(`/ministry/cell-groups/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Célula atualizada com sucesso:", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar célula:", error);
    throw error;
  }
};

export const getCellGroupsByMinistry = async (ministryId: string) => {
  try {
    const response = await api.get(`/ministry/cell-groups/${ministryId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar células:", error);
    throw error;
  }
};

export const getCellGroupDetail = async (id: string) => {
  try {
    const response = await api.get(`/ministry/cell-groups/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar célula:", error);
    throw error;
  }
};

export const deleteCellGroup = async (id: string) => {
  try {
    const response = await api.delete(`/ministry/cell-groups/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar célula:", error);
    throw error;
  }
};
