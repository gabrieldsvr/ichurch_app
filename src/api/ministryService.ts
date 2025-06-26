import api from "@/src/api/api";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { PeopleDTO } from "@/src/dto/PeopleDTO";

export const createMinistry = async (ministryData: MinistryDTO) => {
  try {
    const response = await api.post("/ministry/ministries", ministryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ministério:", error);
    throw error;
  }
};

export const updateMinistry = async (
  id: string,
  ministryData: Partial<MinistryDTO>,
) => {
  try {
    const response = await api.put(`/ministry/ministries/${id}`, ministryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar ministério:", error);
    throw error;
  }
};

export const getMinisteries = async (): Promise<MinistryDTO[]> => {
  try {
    const response = await api.get("/ministry/ministries");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ministérios:", error);
    throw error;
  }
};

export const getMinistryById = async (id: string) => {
  try {
    const response = await api.get(`/ministry/ministries/${id}`);
    return response.data as MinistryDTO;
  } catch (error) {
    console.error("Erro ao buscar ministério:", error);
    throw error;
  }
};

export const deleteMinistry = async (id: string) => {
  try {
    const response = await api.delete(`/ministry/ministries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar ministério:", error);
    throw error;
  }
};

export const updateMinistryMembers = async (
  ministryId: string,
  memberIds: { id: string; role: "LEADER" | "AUX" | "MEMBER" }[],
) => {
  return api.patch(`/ministry/ministries/${ministryId}/members`, {
    members: memberIds,
  });
};

export async function getMinistryMembers(ministryId: string) {
  const res = await api.get(`/ministry/ministries/${ministryId}/members`);
  return res.data.filter((m) => m.status === "ativo");
}

export const getCellGroupsByMinistry = async (ministryId: string) => {
  return api.get(`/ministry/ministries/${ministryId}/cell_groups`);
};

export async function getAvailablePeopleToAdd(
  ministryId: string,
): Promise<PeopleDTO[]> {
  const { data } = await api.get(
    `/ministry/ministries/${ministryId}/available-people`,
  );
  return data as PeopleDTO[];
}

export async function addMinistryMembersBulk(
  ministryId: string,
  members: { id: string; role: string }[],
) {
  console.log(ministryId);
  console.log(members);
  return api.post("/ministry/members/bulk", {
    ministry_id: ministryId,
    members: members.map((m) => ({
      person_id: m.id,
      role: m.role,
    })),
  });
}

/**
 * Atualiza o papel de um membro em um ministério com base no person_id e ministry_id.
 *
 * @param ministryId - ID do ministério
 * @param userId - ID da pessoa (person_id)
 * @param role - Novo papel: 'LEADER', 'AUX', ou 'MEMBER'
 */
export async function updateMemberRole(
  ministryId: string,
  userId: string,
  role: "LEADER" | "AUX" | "MEMBER",
): Promise<void> {
  console.log(
    `Atualizando papel do usuário ${userId} no ministério ${ministryId} para ${role}`,
  );

  await api.patch(`/ministry/members`, {
    ministry_id: ministryId,
    person_id: userId,
    role,
  });
}

export async function removeMember(memberId: string): Promise<void> {
  await api.delete(`/ministry/members/${memberId}`);
}
