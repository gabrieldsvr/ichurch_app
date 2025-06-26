export interface CellGroupDTO {
  id: string;
  companyId: string;
  ministryId: string;
  name: string;
  description?: string | null;
  status: "ativo" | "inativo";
  createdAt: string;
  updatedAt: string;
  config?: {
    icon: string;
    color: string;
  };
  totalMembers?: number;
  members?: {
    id: string;
    name: string;
    role: string;
    photo?: string | null;
  };
}
