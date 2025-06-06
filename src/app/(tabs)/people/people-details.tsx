import React, {useEffect, useState} from "react";
import {Alert, Image, ScrollView, StyleSheet, View,} from "react-native";
import {Avatar, Button, Divider, List, Text, useTheme} from "react-native-paper";
import {useLocalSearchParams, useRouter} from "expo-router";
import {deleteUser, getUserById} from "@/src/api/peopleService"; // Importe suas funções reais
import {useTranslation} from "@/src/hook/useTranslation";

interface Ministry {
    id: string;
    name: string;
    color: string; // Pode ser uma cor hex ou classe para indicar cor
    icon?: string; // nome do ícone, ex: "account-group"
}

interface UserDetail {
    id: string;
    name: string;
    photo?: string;
    phone?: string;
    email?: string;
    address?: string;
    ministries?: Ministry[];
}

export default function UserDetailsScreen() {
    const {id} = useLocalSearchParams();
    const theme = useTheme();
    const {t} = useTranslation();
    const router = useRouter();

    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id as string);
                setUser(response.data);
                console.log(response.data)
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
      alert('Login criado')
    }

    if (loading) {
        return (
            <View style={[styles.loadingContainer, {backgroundColor: theme.colors.background}]}>
                <Text>{t("loading")}...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={[styles.loadingContainer, {backgroundColor: theme.colors.background}]}>
                <Text>{t("user_not_found")}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={styles.header}>
                {user.photo ? (
                    <Image
                        source={{uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user.photo}`}}
                        style={styles.avatar}
                    />
                ) : (
                    <Avatar.Icon size={80} icon="account"/>
                )}
                <View style={styles.headerText}>
                    <Text style={[styles.title, {color: theme.colors.onBackground}]}>
                        {user.name}
                    </Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <Button
                    mode="outlined"
                    onPress={() => router.push(`/people/upsert?id=${user.id}`)}
                    style={styles.editButton}
                >
                    {t("edit")}
                </Button>
                <Button
                    mode="contained"
                    onPress={onDelete}
                    style={styles.deleteButton}
                >
                    {t("delete")}
                </Button>
            </View>

            <Divider style={{marginVertical: 12}}/>

            <Text style={[styles.sectionTitle, {color: theme.colors.onBackground}]}>
                {t("contact_details")}
            </Text>

            <List.Section>
                <List.Item
                    title={user.phone || t("no_data")}
                    titleNumberOfLines={1}
                    description={t("phone")}
                    left={(props) => <List.Icon {...props} icon="phone"/>}
                />
                <List.Item
                    title={user.email || t("no_data")}
                    titleNumberOfLines={1}
                    description={t("email")}
                    left={(props) => <List.Icon {...props} icon="email"/>}
                />
                <List.Item
                    title={user.address || t("no_data")}
                    titleNumberOfLines={2}
                    description={t("address")}
                    left={(props) => <List.Icon {...props} icon="map-marker"/>}
                />
            </List.Section>

            <Text style={[styles.sectionTitle, {color: theme.colors.onBackground}]}>
                {t("ministries")}
            </Text>

            <List.Section>
                {user.ministries && user.ministries.length > 0 ? (
                    user.ministries.map((ministry) => (
                        <List.Item
                            key={ministry.id}
                            title={ministry.name}
                            left={(props) => <List.Icon {...props} icon="account-group"/>}
                            right={(props) => <List.Icon {...props} icon="chevron-right"/>}
                            onPress={() => {
                                router.push({   pathname: "/ministery/ministery-detail",
                                    params: { id: ministry.id}
                                });
                            }}
                            style={{borderBottomWidth: 1, borderBottomColor: theme.colors.outline}}
                        />
                    ))
                ) : (
                    <Text style={{padding: 12, color: theme.colors.onSurfaceVariant}}>
                        {t("no_ministries")}
                    </Text>
                )}
            </List.Section>

            <View style={[styles.buttonRow, {backgroundColor: theme.colors.background}]}>
                <Button mode="contained" style={styles.createLoginButton} onPress={onCreateLogin}>
                    {t("create_login")}
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
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
    saveButton: {
        flex: 1,
        marginRight: 10,
    },
});
