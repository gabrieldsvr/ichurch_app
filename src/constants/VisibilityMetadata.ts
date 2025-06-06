import { MinistryVisibility } from "@/src/types/MinistryVisibility";

export const VisibilityMetadata: Record<
    MinistryVisibility,
    { label: string; color: string; icon: string }
> = {
    [MinistryVisibility.PUBLIC]: {
        label: "public",
        color: "#4caf50",
        icon: "earth",
    },
    [MinistryVisibility.SECRET]: {
        label: "secrect",
        color: "#ff9800",
        icon: "lock",
    },
    [MinistryVisibility.PRIVATE]: {
        label: "private",
        color: "#f44336",
        icon: "account-lock",
    },
};
