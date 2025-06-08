import api from "@/src/api/api";

export const createCellGroup = async (formData: FormData) => {
  try {
    const response = await api.post("/ministry/cell-groups", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar célula:", error);
    throw error;
  }
};

export const updateCellGroup = async (id: string, formData: FormData) => {
  try {
    const response = await api.put(`/ministry/cell-groups/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
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
