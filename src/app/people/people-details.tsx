import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, FAB, Text, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteUser, getUserById } from "@/src/api/peopleService";
import { useTranslation } from "@/src/hook/useTranslation";
import { useSnackbar } from "@/src/contexts/SnackbarProvider";
import { useAuth } from "@/src/contexts/AuthProvider";
import api from "@/src/api/api";
import { logToDiscord } from "@/src/api/logService";
import { ModalCreateUserLogin } from "@/src/component/modal/ModalCreateUserLogin";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import { getPersonTypeLabel } from "@/src/constants/personTypeMeta";

export default function UserDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showMessage } = useSnackbar();

  const [fabOpen, setFabOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<PeopleDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchUser();
  }, [id]);

  const onCreateLogin = () => {
    setModalVisible(true);
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUserById(id as string);
      console.log("User details fetched:", response);

      setUserDetail(response);
    } catch (error) {
      console.log("Error fetching user details:", error);
      Alert.alert(t("error"), t("error_loading_user"));
    } finally {
      setLoading(false);
    }
  };
  const handleCreateAccount = async () => {
    if (!email) return;

    setLoading(true);
    try {
      showMessage(t("user_create_success"));
      await api.post("/sca/users", {
        name: userDetail?.name,
        email,
        password: "adm123",
        is_master: false,
        person_id: id,
      });
      showMessage(t("user_create_success"));
      setModalVisible(false);
      setEmail("");
      await fetchUser();
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      await logToDiscord(`❌ Erro ao criar conta: ${error.message}`, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !userDetail) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text>{loading ? t("loading") : t("user_not_found")}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          {userDetail.photo ? (
            <Image
              source={{
                uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${userDetail.photo}`,
              }}
              style={styles.avatarCentered}
            />
          ) : (
            <Avatar.Icon
              size={100}
              icon="account"
              color={theme.colors.onPrimaryContainer}
              style={[
                styles.avatarCentered,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            />
          )}
          <Text style={styles.nameCentered}>{userDetail.name}</Text>
          <Text style={styles.roleNote}>
            {getPersonTypeLabel(userDetail.type)}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionLabel}>{t("contact_details")}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("phone")}</Text>
            <Text>{userDetail.phone || t("no_data")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("email")}</Text>
            <Text>{userDetail.email || t("no_data")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("address")}</Text>
            <Text>{userDetail.address || t("no_data")}</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.sectionLabel}>{t("ministries")}</Text>
          {userDetail.ministries && userDetail.ministries.length > 0 ? (
            userDetail.ministries.map((ministry) => (
              <View key={ministry.id} style={styles.ministryRow}>
                <Text>{ministry.name}</Text>
                <Text style={styles.ministryRole}>teste</Text>
              </View>
            ))
          ) : (
            <Text>{t("no_ministries")}</Text>
          )}
        </View>
      </ScrollView>

      <FAB.Group
        open={fabOpen}
        visible={true}
        icon={fabOpen ? "close" : "dots-vertical"}
        fabStyle={{ backgroundColor: theme.colors.primaryContainer }}
        color={theme.colors.onPrimaryContainer}
        onStateChange={({ open }) => setFabOpen(open)}
        actions={[
          {
            icon: "pencil",
            label: t("edit"),
            color: theme.colors.onPrimaryContainer,
            onPress: () =>
              router.push({
                pathname: "/people/upsert",
                params: { id: userDetail.id },
              }),
          },
          {
            icon: "delete",
            label: t("delete"),
            color: theme.colors.error,
            onPress: () =>
              Alert.alert(
                t("do_delete_user"),
                t("this_action_cannot_be_undone"),
                [
                  { text: t("cancel"), style: "cancel" },
                  {
                    text: t("delete"),
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteUser(userDetail.id);
                        router.replace("/people");
                      } catch (err) {
                        console.log(err);
                        Alert.alert(t("error"), t("error_deleting_user"));
                      }
                    },
                  },
                ],
              ),
          },
          ...(user?.isMaster && !userDetail.userId
            ? [
                {
                  icon: "account-plus",
                  label: t("create_login"),
                  onPress: () => {
                    onCreateLogin();
                  },
                },
              ]
            : []),
        ]}
      />
      <ModalCreateUserLogin
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        email={email}
        setEmail={setEmail}
        loading={loading}
        handleCreateAccount={handleCreateAccount}
        t={t}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarCentered: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  nameCentered: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  roleNote: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontWeight: "500",
    color: "#666",
  },
  ministryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  ministryRole: {
    fontStyle: "italic",
    color: "#444",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#509BF8",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalSurface: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  modalButton: {
    marginTop: 8,
  },
});
