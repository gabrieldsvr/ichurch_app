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
export async function getEventById(
  id: string,
): Promise<EventDTO & { attendances: any[] }> {
  const [event, attendances] = await Promise.all([
    api.get<EventDTO>(`/community/events/${id}`),
    api.get(`/community/attendance/${id}/by-event`, {
      params: { event_id: id },
    }),
  ]);

  console.log(event);
  return {
    ...event.data,
    attendances: attendances.data,
  };
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

export async function getEventDetails(eventId: string) {
  const res = await api.get(`/community/events/${eventId}`);
  return res.data;
}

export async function saveAttendances(
  eventId: string,
  personIds: string[],
): Promise<void> {
  try {
    console.log(
      "Saving attendances for event:",
      eventId,
      "with persons:",
      personIds,
    );

    await api.post("/community/attendance/mark-multiple", {
      event_id: eventId, // padronizado com backend
      person_ids: personIds,
    });
  } catch (error: any) {
    console.error(
      "Erro ao salvar presenças:",
      error?.response?.data || error.message,
    );
    throw new Error("Erro ao salvar presenças. Tente novamente.");
  }
}

export async function getUpcomingEventsByMinistryId(ministryId: string) {
  console.log("Fetching upcoming events for ministry:", ministryId);
  const res = await api.get(`/community/events/upcoming/${ministryId}`);
  return res.data;
}
