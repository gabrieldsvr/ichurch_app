import api from "./api";

export interface EventDTO {
    id: string;
    name: string;
    event_date: string;
    description?: string;
    location?: string;
    type?: string;
}

// Buscar todos os eventos
export async function getEvents() {
    try {
        const response = await api.get("/community/events");
        console.log("API response data:", response.data);
        if (!Array.isArray(response.data)) {
            throw new Error("Data não é um array");
        }
        return response.data;
    } catch (error) {
        console.error("Erro no getEvents:", error);
        throw error;
    }
}

// Buscar evento pelo ID
export const getEventById = async (id: string) => {
    return await api.get<EventDTO>(`/community/events/${id}`);
};

// Criar novo evento
export const createEvent = async (eventData: Partial<EventDTO>) => {
    return await api.post("/community/events", eventData);
};

// Atualizar evento existente
export const updateEvent = async (id: string, eventData: Partial<EventDTO>) => {
    return await api.put(`/community/events/${id}`, eventData);
};

// Deletar evento
export const deleteEvent = async (id: string) => {
    return await api.delete(`/community/events/${id}`);
};
