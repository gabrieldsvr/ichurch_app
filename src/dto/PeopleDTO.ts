export interface PeopleDTO {
  id: string;
  companyId: string;
  userId?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  birthDate?: Date | null; // Date em ISO string (ex: "2025-06-05")
  type: "visitor" | "regular_attendee" | "member";
  joinedAt?: string | null;
  status: "active" | "inactive" | "deleted";
  config?: any; // ou defina melhor se souber o formato do JSON
  photo?: string | null;
  role?: "LEADER" | "AUX" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}
