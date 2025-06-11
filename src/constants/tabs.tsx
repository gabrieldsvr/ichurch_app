import React from "react";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export type TabKey =
  | "index"
  | "people"
  | "events"
  | "ministry"
  | "ministries"
  | "repertory"
  | "cell_group"
  | "settings";

interface TabConfig {
  name: TabKey;
  title: string;
  icon: ({ color, size }: { color: string; size: number }) => React.ReactNode;
}

export const ALL_TABS: Record<TabKey, TabConfig> = {
  index: {
    name: "index",
    title: "Home",
    icon: ({ color, size }) => (
      <FontAwesome name="home" size={size ?? 24} color={color} />
    ),
  },
  people: {
    name: "people",
    title: "Pessoas",
    icon: ({ color, size }) => (
      <Feather name="users" size={size ?? 24} color={color} />
    ),
  },
  events: {
    name: "events",
    title: "Agenda",
    icon: ({ color, size }) => (
      <Feather name="calendar" size={size ?? 24} color={color} />
    ),
  },
  ministries: {
    name: "ministries",
    title: "Ministérios",
    icon: ({ color, size }) => (
      <Feather name="briefcase" size={size ?? 24} color={color} />
    ),
  },
  ministry: {
    name: "ministry",
    title: "Ministério",
    icon: ({ color, size }) => (
      <Feather name="briefcase" size={size ?? 24} color={color} />
    ),
  },
  cell_group: {
    name: "cell_group",
    title: "Células",
    icon: ({ color, size }) => (
      // <Feather name="home-group" size={size ?? 24} color={color} />
      <MaterialCommunityIcons name="home-group" size={24} color={color} />
    ),
  },
  settings: {
    name: "settings",
    title: "Configurações",
    icon: ({ color, size }) => (
      <Feather name="settings" size={size ?? 24} color={color} />
    ),
  },
};
