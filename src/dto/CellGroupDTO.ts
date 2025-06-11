export interface CellGroupDTO {
  id: string;
  companyId: string;
  ministryId: string;
  name: string;
  description?: string | null;
  status: "ativo" | "inativo";
  createdAt: string;
  updatedAt: string;

  members?: {
    id: string;
    name: string;
    role: string;
    photo?: string | null;
  };
}
