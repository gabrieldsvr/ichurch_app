import {MinistryEnum} from "@/src/enum/MinisteryEnum";

export const MinistryMetadata: Record<
    MinistryEnum,
    { label: string; icon: string; color: string }
> = {
    [MinistryEnum.CORE]: { label: "Igreja", icon: "church", color: "#4caf50" },
    [MinistryEnum.CELULA]: { label: "Células", icon: "account-group", color: "#2196f3" },
    [MinistryEnum.LOUVOR]: { label: "Louvor", icon: "music-note", color: "#9c27b0" },
    [MinistryEnum.DIACONIA]: { label: "Diaconia", icon: "hand-heart", color: "#f44336" },
    [MinistryEnum.CANTINA]: { label: "Cantina", icon: "food", color: "#ff9800" },
    [MinistryEnum.FINANCEIRO]: { label: "Financeiro", icon: "cash", color: "#795548" },
    [MinistryEnum.INFANTIL]: { label: "Infantil", icon: "baby-face", color: "#e91e63" },
    [MinistryEnum.INTERCESSAO]: { label: "Intercessão", icon: "prayer", color: "#673ab7" },
    [MinistryEnum.EVANGELISMO]: { label: "Evangelismo", icon: "megaphone", color: "#ff5722" },
    [MinistryEnum.OUTRO]: { label: "Outro", icon: "folder", color: "#607d8b" },
};