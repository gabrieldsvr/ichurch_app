// src/dto/EventDTO.ts

import { EventType } from "@/src/types/EventType";

export interface EventDTO {
  id: string;
  companyId: string;

  name: string;
  eventDate: string;
  description?: string | null;
  location?: string | null;

  type: EventType;
  status: "active" | "canceled" | "scheduled";

  ministryId?: string | null;
  ministryName?: string | null;

  createdAt: string;
  updatedAt: string;
}
