import api from "@/src/api/api";
import {MinisteryDTO} from "@/src/dto/MinisteryDTO";

export const createMinistery = async (ministeryData: MinisteryDTO) => {
    try {
        console.log(ministeryData)
        const response = await api.post('/ministry/ministries', ministeryData, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar ministério:', error);
        throw error;
    }
};

export const updateMinistery = async (id: string, ministeryData: Partial<MinisteryDTO>) => {
    try {
        const response = await api.put(`/ministry/ministries/${id}`, ministeryData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar ministério:", error);
        throw error;
    }
};


export const getMinisteries = async (): Promise<MinisteryDTO[]> => {
    try {
        const response = await api.get("/ministry/ministries");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ministérios:", error);
        throw error;
    }
};

export const getMinisteryById = async (id: string) => {
    try {
        const response = await api.get(`/ministry/ministries/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ministério:", error);
        throw error;
    }
};

export const deleteMinistery = async (id: string) => {
    try {
        const response = await api.delete(`/ministry/ministries/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar ministério:", error);
        throw error;
    }
};
