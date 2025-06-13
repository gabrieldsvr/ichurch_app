import api from "@/src/api/api";
import { PeopleDTO } from "@/src/dto/PeopleDTO";

export const createUser = async (userData: FormData) => {
  try {
    const response = await api.post("/community/people", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: FormData) => {
  try {
    const response = await api.put(`/community/people/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const getUsers = async (statusParam: string = "") => {
  try {
    return await api.get(`/community/people${statusParam}`);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

// Buscar usuário por ID
export const getUserById = async (id: string): Promise<PeopleDTO> => {
  try {
    const response = await api.get(`/community/people/${id}`);
    return response.data as PeopleDTO;
  } catch (error) {
    console.error(`Erro ao buscar usuário ID ${id}:`, error);
    throw error;
  }
};

// Deletar usuário por ID (exclusão lógica ou física, depende da API)
export const deleteUser = async (id: string) => {
  try {
    return await api.delete(`/community/people/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar usuário ID ${id}:`, error);
    throw error;
  }
};
