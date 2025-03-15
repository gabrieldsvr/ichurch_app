import api from "@/src/api/api";

export const createUser = async (userData: FormData) => {
    try {
        const response = await api.post('/community/people', userData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

export const updateUser = async (id: string, userData: FormData) => {
    try {
        console.log(id)
        console.log(FormData)
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
