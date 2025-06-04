import {useEffect, useState} from 'react';
import {Alert, FlatList, Modal, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, FAB, IconButton, Menu, Switch, Text} from 'react-native-paper';
import {useNavigation, useRouter} from "expo-router";
import {getUsers} from '@/src/api/peopleService';
import {useAppTheme} from "@/src/contexts/ThemeProvider";
import {Picker} from "@react-native-picker/picker";
import api from "@/src/api/api";
export default function PeopleScreen() {
    const theme = useAppTheme().theme;
    const [people, setPeople] = useState<PeopleDTO[]>([]);
    const [filteredPeople, setFilteredPeople] = useState<PeopleDTO[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [includeInactive, setIncludeInactive] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleMenus, setVisibleMenus] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        fetchPeople();
    }, [includeInactive]);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: theme.colors.surface }, // 🔥 Aplica a cor do header
            headerTintColor: theme.colors.onSurface, // 🔥 Cor do texto do header
            headerRight: () => (
                <View style={styles.headerButtons}>
                    <IconButton
                        icon="magnify"
                        size={24}
                        onPressOut={toggleSearch}
                        style={styles.headerIcon}
                    />
                    <IconButton
                        icon="filter"
                        size={24}
                        onPressOut={() => setShowFilterModal(true)}
                        style={styles.headerIcon}
                    />
                </View>
            ),
        });
    }, [theme]);

    const toggleSearch = () => {
        setShowSearch((prev) => {
            if (prev) {
                fetchPeople();
                setSearchQuery('');
            }
            return !prev;
        });
    };

    const fetchPeople = async () => {
        try {
            setRefreshing(true);
            const statusParam = includeInactive ? "" : "?status=active";
            const users = await getUsers(statusParam);
            const sortedPeople = users.data.sort((a: PeopleDTO, b: PeopleDTO) =>
                a.name.localeCompare(b.name)
            );

            setPeople(sortedPeople);
            setFilteredPeople(sortedPeople);
        } catch (error: any) {
            console.error('Erro ao buscar usuários:', error.message);
        } finally {
            setRefreshing(false);
        }
    };
    const translateUserType = (type: string) => {
        switch (type) {
            case "visitor":
                return "Visitante";
            case "regular_attendee":
                return "Frequentador";
            case "member":
                return "Membro";
            default:
                return "Desconhecido";
        }
    };

    const applyFilters = () => {
        let filteredList = people;

        if (searchQuery) {
            filteredList = filteredList.filter(person =>
                person.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterType && filterType !== "all") {
            filteredList = filteredList.filter(person => person.type === filterType);
        }

        setFilteredPeople(filteredList);
        setShowFilterModal(false); // 🔥 Fecha automaticamente o modal após aplicar os filtros
    };

    const handleEdit = (id: string) => {
        router.push({
            pathname: "/people/upsert",
            params: { id },
        });
    };

    const toggleStatus = async (id: string) => {
        try {
            const response = await api.patch(`community/people/${id}/toggle-status`);
            fetchPeople();
            Alert.alert("Sucesso", response.data.message);
        } catch (error: any) {
            console.error('Erro ao alternar status do usuário:', error.message);
            Alert.alert("Erro", "Falha ao alterar status do usuário.");
        }
    };

    const filterPeople = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredPeople(people);
        } else {
            const filteredList = people.filter(person =>
                person.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPeople(filteredList);
        }
    };

    const createUserForPerson = async (person: PeopleDTO) => {
        try {
            const nameParts = person.name.trim().split(" ");
            if (nameParts.length < 2) {
                Alert.alert("Erro", "O nome da pessoa deve ter pelo menos um sobrenome.");
                return;
            }

            const firstName = nameParts[0].toLowerCase();
            const lastName = nameParts[nameParts.length - 1].toLowerCase();
            const email = `${firstName}.${lastName}@email.com`;

            const userData = {
                email,
                password: "senha123",
                person_id: person.id,
                role: "user",
            };

            const response = await api.post("/sca/auth/register", userData);

            Alert.alert("Sucesso", `Usuário criado com sucesso!\nEmail: ${email}\nSenha: senha123`);
        } catch (error: any) {
            console.error("Erro ao criar usuário:", error);
            Alert.alert("Erro", "Falha ao criar usuário.");
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {showSearch && (
                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                    <TextInput
                        placeholder="Pesquisar por nome..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={filterPeople}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={toggleSearch}
                        style={styles.searchCloseIcon}
                    />
                </View>
            )}

            <FlatList
                data={filteredPeople}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPeople} />}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listItem}>
                        {/* Avatar */}
                        {item.photo ? (
                            <Avatar.Image size={40} style={styles.avatar} source={{ uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${item.photo}` }} />
                        ) : (
                            <Avatar.Icon size={40} icon="account" style={[styles.avatarIcon, { backgroundColor: theme.colors.surfaceVariant }]} />
                        )}

                        {/* Nome e Tipo */}
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: theme.colors.onSurface }]}>{item.name}</Text>
                            <Text style={[styles.userType, { color: theme.colors.onSurfaceVariant }]}>{translateUserType(item.type)}</Text>
                        </View>

                        {/* Botão de Menu */}
                        <Menu
                            visible={visibleMenus[item.id] || false}
                            onDismiss={() => setVisibleMenus(prev => ({ ...prev, [item.id]: false }))}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    size={24}
                                    iconColor={theme.colors.onSurface}
                                    onPress={() => setVisibleMenus(prev => ({ ...prev, [item.id]: true }))}
                                />
                            }
                        >
                            <Menu.Item onPress={() => handleEdit(item.id)} title="Editar" leadingIcon="pencil" />
                            <Menu.Item onPress={() => toggleStatus(item.id)} title="Inativar" leadingIcon="account-off" />
                        </Menu>
                    </TouchableOpacity>
                )}
            />

            <FAB
                icon="plus"
                color={theme.colors.onPrimary}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => router.push('/people/upsert')}
            />
            <Modal visible={showFilterModal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <IconButton
                            icon="close"
                            size={24}
                            onPress={() => setShowFilterModal(false)}
                            style={styles.modalCloseButton}
                        />

                        <Picker
                            selectedValue={filterType}
                            onValueChange={(value) => setFilterType(value)}
                            style={[styles.picker, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.onSurface }]}
                        >
                            <Picker.Item label="Todos" value="all" />
                            <Picker.Item label="Visitante" value="visitor" />
                            <Picker.Item label="Frequentador" value="regular_attendee" />
                            <Picker.Item label="Membro" value="member" />
                        </Picker>

                        <View style={styles.switchContainer}>
                            <Text style={[styles.filterLabel, { color: theme.colors.onSurface }]}>Incluir Inativos:</Text>
                            <Switch
                                value={includeInactive}
                                onValueChange={() => setIncludeInactive(!includeInactive)}
                            />
                        </View>

                        <Button mode="contained" onPress={applyFilters} style={[styles.applyFilterButton, { backgroundColor: theme.colors.primary }]}>
                            Aplicar Filtro
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 10 },
    searchInput: { flex: 1, fontSize: 16 },
    searchCloseIcon: { marginLeft: 8 },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    avatar: { marginRight: 10 },
    avatarIcon: { marginRight: 10 },
    userInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: 'bold' },
    userType: { fontSize: 14 },
    headerButtons: { flexDirection: "row", gap: 10, marginRight: 10 },
    headerIcon: { backgroundColor: "transparent", marginHorizontal: 5 },
    fab: { position: 'absolute', right: 20, bottom: 30 },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // 🔥 Fundo escuro semi-transparente
    },

    modalContent: {
        width: "85%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },

    modalCloseButton: {
        alignSelf: "flex-end",
        marginBottom: 10,
    },

    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 15,
    },

    filterLabel: {
        fontSize: 16,
        fontWeight: "bold",
    },

    applyFilterButton: {
        marginTop: 10,
        width: "100%",
        borderRadius: 8,
        paddingVertical: 8,
    },
    picker: { width: "100%", borderRadius: 8, marginBottom: 15 },
});
