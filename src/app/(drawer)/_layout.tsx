import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/contexts/AuthProvider";

export default function DrawerLayout() {
  const theme = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerTintColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.primary,
        drawerLabelStyle: { fontSize: 16 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: "Início", headerShown: false }}
      />
      <Drawer.Screen
        name="notifications"
        options={{ drawerLabel: "Avisos", title: "Avisos" }}
      />
      <Drawer.Screen
        name="plan"
        options={{ drawerLabel: "Plano", title: "Plano" }}
      />
      <Drawer.Screen
        name="checkin"
        options={{
          drawerLabel: "Checkin em evento",
          title: "Checkin em evento",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Configurações",
          title: "Configurações",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "profile",
          title: "profile",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}

function CustomDrawerContent(props: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* 🔝 TOPO COM SAFEAREA */}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top + 12, marginBottom: insets.top + 12 },
        ]}
      >
        <TouchableOpacity
          style={styles.header}
          activeOpacity={0.8}
          onPress={() => props.navigation.navigate("profile")}
        >
          <Avatar.Image
            size={56}
            source={{ uri: "https://i.pravatar.cc/150?u=user" }}
          />
          <View style={styles.headerText}>
            <Text style={styles.userName}>{auth.user?.name}</Text>
            <Text style={styles.userEmail}>{auth.user?.email}</Text>
            <Text style={styles.profileLink}>Ver perfil</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* MENU SCROLLÁVEL */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* 🔻 RODAPÉ COM SAFEAREA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 12 }]}>
        <DrawerItem
          label="Configurações"
          onPress={() => props.navigation.navigate("settings")}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          )}
          labelStyle={{ fontSize: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  profileLink: {
    marginTop: 4,
    fontSize: 12,
    color: "#509BF8",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(204,204,204,0.35)",
    paddingHorizontal: 16,
  },
});
