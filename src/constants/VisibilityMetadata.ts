import { MinistryVisibility } from "@/src/types/MinistryVisibility";

export const VisibilityMetadata: Record<
  MinistryVisibility,
  { label: string; color: string; icon: string }
> = {
  [MinistryVisibility.PUBLIC]: {
    label: "Público",
    color: "#4caf50",
    icon: "earth",
  },
  [MinistryVisibility.SECRET]: {
    label: "Secreto",
    color: "#ff9800",
    icon: "lock",
  },
  [MinistryVisibility.PRIVATE]: {
    label: "Privado",
    color: "#f44336",
    icon: "account-lock",
  },
};

export function getVisibilityLabel(visibility: MinistryVisibility): string {
  return VisibilityMetadata[visibility]?.label ?? visibility;
}
