import {MinistryType} from "@/src/types/MinisteryType";

export interface MinisteryDTO {
    id: string;
    company_id: string;
    name: string;
    description?: string;
    type?: MinistryType.CORE | MinistryType.CELULA | MinistryType.LOUVOR | MinistryType.CANTINA;
    visibility: "public" | "secret" | "private";
    status?: "active" | "inactive";
}
