import { PersonType } from "@/src/types/PersonType";

export const PERSON_TYPE_LABELS: Record<PersonType, string> = {
  member: "Membro",
  regular_attendee: "Frequentador",
  visitor: "Visitante",
};

export function getPersonTypeLabel(type?: string): string {
  if (!type) return "Desconhecido";
  return PERSON_TYPE_LABELS[type as PersonType] ?? "Desconhecido";
}
