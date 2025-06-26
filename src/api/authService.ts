import api from "./api";

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  try {
    const response = await api.put("/sca/users/change-password", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Erro ao trocar a senha" };
  }
};
