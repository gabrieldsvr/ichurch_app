import { MinistryType } from "@/src/types/MinistryType";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import { MinistryVisibility } from "@/src/types/MinistryVisibility";

export type Status = "active" | "inactive";

export interface MinistryDTO {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  type:
    | MinistryType.CORE
    | MinistryType.CELULA
    | MinistryType.LOUVOR
    | MinistryType.CANTINA;
  visibility: MinistryVisibility;
  status: Status;

  members?: PeopleDTO[];
  membersCount?: number; // campos agregados opcionais
  leadersCount?: number;
  auxCount?: number;
  peopleCount?: number;
}
