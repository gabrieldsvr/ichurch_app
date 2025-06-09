import { Tabs, useNavigation } from "expo-router";
import { IconButton, Text, useTheme } from "react-native-paper";
import { DrawerActions } from "@react-navigation/native";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { ALL_TABS } from "@/src/constants/tabs";
import { TABS_BY_MINISTRY_TYPE } from "@/src/constants/ministryTabsMap";
import { View } from "react-native";

export default function TabsLayout() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { currentMinistry } = useMinistry();
  const ministryType = currentMinistry?.type ?? "core";

  // Quais tabs devem estar visíveis com base no tipo de ministério
  const visibleTabKeys = TABS_BY_MINISTRY_TYPE[ministryType] ?? [];

  return (
    <Tabs>
      {Object.values(ALL_TABS).map((tab) => {
        const isVisible = visibleTabKeys.includes(tab.name);

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: tab.icon,
              tabBarLabel: tab.title,
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: "#999",
              headerStyle: { backgroundColor: theme.colors.background },
              headerTintColor: theme.colors.primary,
              headerShadowVisible: false,
              href: isVisible ? undefined : null, // Evita que tabs invisíveis sejam acessíveis
              headerLeft: () => (
                <IconButton
                  icon="menu"
                  onPress={() =>
                    navigation.dispatch(DrawerActions.openDrawer())
                  }
                />
              ),

              headerTitle: () => {
                const isHome = tab.name === "index";
                return isHome ? (
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "700",
                    }}
                  >
                    iChurch
                  </Text>
                ) : (
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      variant="titleLarge"
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "700",
                      }}
                    >
                      {tab.title}
                    </Text>
                    {!!currentMinistry?.name && (
                      <Text
                        variant="labelMedium"
                        style={{ color: theme.colors.secondary }}
                      >
                        {currentMinistry.name}
                      </Text>
                    )}
                  </View>
                );
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
