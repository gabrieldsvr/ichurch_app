export interface CellGroupDTO {
    id: string;
    companyId: string;
    ministryId: string;
    name: string;
    description?: string | null;
    status: 'ativo' | 'inativo';
    createdAt: string;
    updatedAt: string;
}
