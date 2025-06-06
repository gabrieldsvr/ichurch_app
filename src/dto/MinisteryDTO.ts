import {MinistryType} from "@/src/types/MinisteryType";

export type Visibility = "public" | "secret" | "private";
export type Status = "active" | "inactive";
export interface MinisteryDTO {
    id: string;
    company_id: string;
    name: string;
    description?: string;
    type: MinistryType.CORE | MinistryType.CELULA | MinistryType.LOUVOR | MinistryType.CANTINA;
    visibility: Visibility;
    status: Status;



    membersCount?: number; // campos agregados opcionais
    leadersCount?: number;
    auxCount?: number;
    peopleCount?: number;
}
