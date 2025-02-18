import axios from 'axios';

const API_URL = 'https://ichurch-backend.com.br';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export const getUsers = async () => {
    try {
        const response = await api.get('/people');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};
