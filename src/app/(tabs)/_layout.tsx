import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { ALL_TABS } from "@/src/constants/tabs";
import { TABS_BY_MINISTRY_TYPE } from "@/src/constants/ministryTabsMap";

export default function TabLayout() {
  const theme = useTheme();
  const { currentMinistry } = useMinistry();
  const ministryType = currentMinistry?.type ?? "core";

  const allowedTabKeys = TABS_BY_MINISTRY_TYPE[ministryType] ?? [];

  const dynamicTabs = Object.values(ALL_TABS).map((tab) => ({
    ...tab,
    visible: allowedTabKeys.includes(tab.name),
  }));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#999",
      }}
    >
      {dynamicTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: tab.icon,
            href: tab.visible ? undefined : null,
          }}
        />
      ))}
    </Tabs>
  );
}
