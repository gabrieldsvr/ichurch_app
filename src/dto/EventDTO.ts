// src/dto/EventDTO.ts

export interface EventDTO {
  id: string;
  companyId: string;

  name: string;
  eventDate: string; // ISO 8601 datetime: "2025-06-05T19:00:00Z"
  description?: string | null;
  location?: string | null;

  type?: string;
  status: "active" | "canceled" | "scheduled";

  ministryId?: string | null;

  createdAt: string;
  updatedAt: string;
}
