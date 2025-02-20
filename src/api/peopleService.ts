import api from "@/src/api/api";


export const createUser = async (userData: {
    name: string;
    phone: string;
    instagram?: string;
    birth_date: string;
    type: 'visitor' | 'regular_attendee' | 'member';
    parentName?: string;
    parentPhone?: string;
}) => {
    try {
        const response = await api.post('/people', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
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
