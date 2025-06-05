export interface EventDTO {
    id: string;
    companyId: string;
    name: string;
    eventDate: string; // ISO datetime (ex: "2025-06-05T19:00:00Z")
    description?: string | null;
    status: 'active' | 'canceled';
    createdAt: string;
    updatedAt: string;
    ministryId?: string | null;
}
