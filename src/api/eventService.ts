// src/api/eventService.ts
import api from "./api";
import { EventDTO } from "@/src/dto/EventDTO";

export interface GetEventsParams {
  ministry_id?: string;
  start_date?: string; // ISO string (ex: "2025-06-01")
  end_date?: string;
  fields?: string; // Ex: "id,name,event_date"
}

// 🔍 Buscar todos os eventos com filtros opcionais
export async function getEvents(params?: GetEventsParams): Promise<EventDTO[]> {
  try {
    console.log(params);
    const response = await api.get<EventDTO[]>("/community/events", { params });

    if (!Array.isArray(response.data)) {
      throw new Error("A resposta da API não é um array de eventos.");
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao buscar eventos:",
      error?.response?.data || error.message,
    );
    throw new Error("Erro ao buscar eventos. Tente novamente.");
  }
}

// 🔍 Buscar evento por ID
export async function getEventById(id: string): Promise<EventDTO> {
  const response = await api.get<EventDTO>(`/community/events/${id}`);
  return response.data;
}

// 🆕 Criar novo evento
export async function createEvent(
  eventData: Partial<EventDTO>,
): Promise<EventDTO> {
  const response = await api.post<EventDTO>("/community/events", eventData);
  return response.data;
}

// ✏️ Atualizar evento existente
export async function updateEvent(
  id: string,
  eventData: Partial<EventDTO>,
): Promise<EventDTO> {
  const response = await api.put<EventDTO>(
    `/community/events/${id}`,
    eventData,
  );
  return response.data;
}

// ❌ Deletar evento
export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/community/events/${id}`);
}
