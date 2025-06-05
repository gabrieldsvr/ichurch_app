export interface MinisteryDTO {
    id: string;
    company_id: string;
    name: string;
    description?: string;
    type: "core" | "worship" | "cell" | "finance" | "service";
    visibility: "public" | "secret" | "private";
    status: "active" | "inactive";
}
