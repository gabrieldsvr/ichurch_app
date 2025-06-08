import { MD3Theme } from "react-native-paper";

/**
 * Retorna uma cor com base no tipo de evento.
 * @param type Tipo do evento (ex: "Culto", "Conferência")
 * @param theme Tema atual do app (useTheme())
 */
export const getTypeColor = (
  type: string | undefined,
  theme: MD3Theme,
): string => {
  if (type === "Culto") return theme.colors.primary;
  if (type === "Conferência") return theme.colors.tertiary;
  return theme.colors.secondary;
};

/**
 * Formata a data de um evento para o padrão brasileiro.
 * Ex: 2025-06-10T20:00:00 → "10/06/2025"
 */
export const formatEventDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR");
};

/**
 * Formata a hora de um evento para "HH:mm"
 */
export const formatEventTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
