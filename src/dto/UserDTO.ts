export interface UserDTO {
    id: string;
    name: string;
    email: string;
    password?: string; // geralmente não é retornada do backend
    companyId: string;
    isMaster?: boolean;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}
