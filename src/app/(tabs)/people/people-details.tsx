import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    Avatar,
    Button,
    Divider,
    List,
    Modal,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteUser, getUserById } from "@/src/api/peopleService";
import { useTranslation } from "@/src/hook/useTranslation";
import { logToDiscord } from "@/src/api/logService";
import api from "@/src/api/api";

import {useSnackbar} from "@/src/contexts/SnackbarProvider";
import {useAuth} from "@/src/contexts/AuthProvider";

interface Ministry {
    id: string;
    name: string;
    color: string;
    icon?: string;
}

interface UserDetail {
    id: string;
    user_id?: string;
    name: string;
    photo?: string;
    phone?: string;
    email?: string;
    address?: string;
    ministries?: Ministry[];
}

export default function UserDetailsScreen() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const { t } = useTranslation();
    const { showMessage } = useSnackbar();
    const router = useRouter();
    const { user} = useAuth();


    const [modalVisible, setModalVisible] = useState(false);
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id as string);
                setUserDetail(response.data);
            } catch (error) {
                Alert.alert(t("error"), t("error_loading_user"));
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const onDelete = () => {
        Alert.alert(
            t("delete"),
            t("confirm_delete_user"),
            [
                {
                    text: t("cancel"),
                    style: "cancel",
                },
                {
                    text: t("delete"),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteUser(id as string);
                            router.replace("/people");
                        } catch (error) {
                            Alert.alert(t("error"), t("error_deleting_user"));
                        }
                    },
                },
            ]
        );
    };

    const onCreateLogin = () => {
        setModalVisible(true);
    };

    const handleCreateAccount = async () => {
        if (!email) return;

        setLoading(true);
        try {

            showMessage(t('user_create_success'))
            await api.post("/sca/users", {
                name: userDetail?.name,
                email,
                password: "adm123",
                is_master: false,
                person_id: id,
            });
            setSuccess(true);
            setModalVisible(false)
        } catch (error: any) {
            console.error("Erro ao criar conta:", error);
            await logToDiscord(`❌ Erro ao criar conta: ${error.message}`, "ERROR");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View
                style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}
            >
                <Text>{t("loading")}...</Text>
            </View>
        );
    }

    if (!userDetail) {
        return (
            <View
                style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}
            >
                <Text>{t("user_not_found")}</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    {userDetail.photo ? (
                        <Image
                            source={{ uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${userDetail.photo}` }}
                            style={styles.avatar}
                        />
                    ) : (
                        <Avatar.Icon size={80} icon="account" />
                    )}
                    <View style={styles.headerText}>
                        <Text style={[styles.title, { color: theme.colors.onBackground }]}>{userDetail.name}</Text>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <Button
                        mode="outlined"
                        onPress={() => router.push({
                            pathname: "/people/upsert",
                            params: { id: userDetail.id },
                        })}
                        style={styles.editButton}
                    >
                        {t("edit")}
                    </Button>
                    <Button mode="contained" onPress={onDelete} style={styles.deleteButton}>
                        {t("delete")}
                    </Button>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                    {t("contact_details")}
                </Text>

                <List.Section>
                    <List.Item
                        title={userDetail.phone || t("no_data")}
                        titleNumberOfLines={1}
                        description={t("phone")}
                        left={(props) => <List.Icon {...props} icon="phone" />}
                    />
                    <List.Item
                        title={userDetail.email || t("no_data")}
                        titleNumberOfLines={1}
                        description={t("email")}
                        left={(props) => <List.Icon {...props} icon="email" />}
                    />
                    <List.Item
                        title={userDetail.address || t("no_data")}
                        titleNumberOfLines={2}
                        description={t("address")}
                        left={(props) => <List.Icon {...props} icon="map-marker" />}
                    />
                </List.Section>

                <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                    {t("ministries")}
                </Text>

                <List.Section>
                    {userDetail.ministries && userDetail.ministries.length > 0 ? (
                        userDetail.ministries.map((ministry) => (
                            <List.Item
                                key={ministry.id}
                                title={ministry.name}
                                left={(props) => <List.Icon {...props} icon="account-group" />}
                                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                                onPress={() =>
                                    router.push({
                                        pathname: "/ministery/ministery-detail",
                                        params: { id: ministry.id },
                                    })
                                }
                                style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.outline }}
                            />
                        ))
                    ) : (
                        <Text style={{ padding: 12, color: theme.colors.onSurfaceVariant }}>
                            {t("no_ministries")}
                        </Text>
                    )}
                </List.Section>

                {
                   !userDetail.user_id  && user?.is_master === true ?    <View style={[styles.buttonRow, { backgroundColor: theme.colors.background }]}>
                        <Button mode="contained" style={styles.createLoginButton} onPress={onCreateLogin}>
                            {t("create_login")}
                        </Button>
                    </View> : <></>
                }

            </ScrollView>

            {/* Modal com fundo desfocado */}
            <Modal
                visible={modalVisible}
                onDismiss={() => {
                    setModalVisible(false);
                    setEmail("");
                    setSuccess(false);
                }}
                contentContainerStyle={styles.modalContentContainer}
            >

                {/* Conteúdo do modal */}
                <View style={styles.modalContent}>
                        <>
                            <Text>{t('info_email_new_account')}:</Text>
                            <TextInput
                                label={t("email")}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                            />
                            <Button
                                mode="contained"
                                onPress={handleCreateAccount}
                                loading={loading}
                                disabled={!email}
                                style={{ marginTop: 16 }}
                            >
                                {t("create_account")}
                            </Button>
                        </>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },input: {
        marginBottom: 16,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    headerText: {
        marginLeft: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
    },
    name: {
        fontSize: 18,
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    editButton: {
        flex: 1,
        marginRight: 10,
    },
    createLoginButton: {
        flex: 1,
    },
    deleteButton: {
        backgroundColor: "#D32F2F",
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonRow: {
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
    },
    modalContentContainer: {
        margin: 20,
        backgroundColor: "transparent",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        minHeight: 180,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 20,
        position: "relative",
        zIndex: 10,
    },
});
