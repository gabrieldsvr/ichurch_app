import {useEffect, useState} from 'react';
import {Alert, FlatList, Modal, RefreshControl, StyleSheet, TextInput, View} from 'react-native';
import {Button, Card, IconButton, Switch, Text} from 'react-native-paper';
import {useNavigation, useRouter} from "expo-router";
import {Picker} from '@react-native-picker/picker';
import {api} from '@/api/peopleService';

interface PeopleDTO {
    id: string;
    name: string;
    type: string;
    phone: string;
    instagram?: string;
    birth_date: string;
    status: boolean;
}

export default function PeopleScreen() {
    const [people, setPeople] = useState<PeopleDTO[]>([]);
    const [filteredPeople, setFilteredPeople] = useState<PeopleDTO[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [includeInactive, setIncludeInactive] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        fetchPeople();
    }, [includeInactive]);

    useEffect(() => {
        navigation.setOptions({
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
    }, []);


    const toggleSearch = () => {
        setShowSearch((prev) => {
            if (prev) {
                fetchPeople();
                setSearchQuery(''); // 🔥 Limpa o campo de busca
            }
            return !prev;
        });
    };


    const fetchPeople = async () => {
        try {
            setRefreshing(true);
            const statusParam = includeInactive ? "" : "?status=true";
            const response = await api.get(`/people${statusParam}`);

            const sortedPeople = response.data.sort((a: PeopleDTO, b: PeopleDTO) =>
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


    const handleEdit = (id: string) => {
        router.push({
            pathname: "/people/edit",
            params: {id},
        });
    };


    const translateUserType = (type: string) => {
        switch (type) {
            case 'visitor':
                return 'Visitante';
            case 'regular_attendee':
                return 'Frequentador';
            case 'member':
                return 'Membro';
            default:
                return 'Desconhecido';
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            const response = await api.patch(`/people/${id}/toggle-status`);
            fetchPeople();
            Alert.alert("Sucesso", response.data.message);
        } catch (error: any) {
            console.error('Erro ao alternar status do usuário:', error.message);
            Alert.alert("Erro", "Falha ao alterar status do usuário.");
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
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilterType(null);
        setIncludeInactive(false);
        setFilteredPeople(people);
        setShowFilterModal(false);
    };

    const handleCloseModal = () => {
        setShowFilterModal(false);
    }
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

    return (
        <View style={styles.container}>
            {showSearch && (
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Pesquisar por nome..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={filterPeople}
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPeople}/>}
                renderItem={({item}) => (
                    <Card style={[styles.card, !item.status && styles.inactiveCard]}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userType}>{translateUserType(item.type)}</Text>
                                <Text style={styles.userPhone}>📞 {item.phone}</Text>
                                {item.instagram && <Text style={styles.userInstagram}>📷 {item.instagram}</Text>}
                                <Text
                                    style={styles.userBirthDate}>🎂 {new Date(item.birth_date).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.actionButtons}>
                                <IconButton
                                    icon="pencil"
                                    iconColor="blue"
                                    size={28}
                                    onPress={() => handleEdit(item.id)}
                                />
                                <IconButton
                                    icon={item.status ? "delete" : "account-check"}
                                    iconColor={item.status ? "red" : "green"}
                                    size={28}
                                    onPress={() => toggleStatus(item.id)}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                )}
            />

            {/* MODAL DE FILTROS */}
            <Modal visible={showFilterModal} animationType="slide" transparent>

                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>


                       <View  style={styles.modalTitleContainer}>
                           <IconButton
                               icon="close"
                               size={35}
                               style={styles.closeButton}
                               onPress={handleCloseModal}
                           />
                       </View>

                        <Text style={styles.filterLabel}>Tipo de Pessoa:</Text>
                        <Picker
                            selectedValue={filterType}
                            onValueChange={(value) => setFilterType(value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Todos" value="all"/>
                            <Picker.Item label="Visitante" value="visitor"/>
                            <Picker.Item label="Frequentador" value="regular_attendee"/>
                            <Picker.Item label="Membro" value="member"/>
                        </Picker>

                        <View style={styles.switchContainer}>
                            <Text style={styles.filterLabel}>Incluir Inativos:</Text>
                            <Switch
                                value={includeInactive}
                                onValueChange={() => setIncludeInactive(!includeInactive)}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <Button mode="outlined" onPress={resetFilters}>
                                Resetar
                            </Button>
                            <Button mode="contained" onPress={applyFilters} style={styles.applyFilterButton}>
                                Aplicar
                            </Button>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#f5f5f5'},

    /* 🔍 Barra Superior com Ícones */
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },

    /* 🔎 Campo de Pesquisa */
    searchInput: {
        marginBottom: 10,
        padding: 10,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 2,
    },

    /* 📌 Botão de Filtro */
    filterButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },

    /* 📋 Cartões de Usuário */
    card: {
        marginVertical: 6,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 3,
    },

    inactiveCard: {
        backgroundColor: '#F5F5F5',
        opacity: 0.7,
    },

    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    userType: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },

    userPhone: {
        fontSize: 14,
        color: '#00796B',
    },

    userInstagram: {
        fontSize: 14,
        color: '#D81B60',
    },

    userBirthDate: {
        fontSize: 14,
        color: '#6A1B9A',
    },

    /* 📌 Modal de Filtros */
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        position: 'relative',
    },

    modalTitleContainer: {
        width: '100%', // 🔥 Ocupa a largura total
        flexDirection: 'row', // 🔥 Mantém o layout em linha
        justifyContent: 'flex-end', // 🔥 Alinha o item à direita
        alignItems: 'center', // 🔥 Centraliza verticalmente
    },
    closeButton: {
        marginRight: 10, // 🔥 Garante um pequeno espaçamento da borda
    },

    /* 🔄 Switch para Incluir Inativos */
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },

    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    picker: {
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    applyFilterButton: {
        marginLeft: 10,
    },

    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2, // 🔥 Reduzindo o espaçamento entre os botões
    },

    editButton: {
        borderRadius: 20, // 🔥 Tornando o botão mais compacto
        padding: 2, // 🔥 Reduzindo a área de toque
        width: 28,
        height: 28,
    },

    deleteButton: {
        borderRadius: 20,
        padding: 2,
        width: 28,
        height: 28,
    },
    headerButtons: {
        flexDirection: "row",
        gap: 10, // 🔥 Mantém os ícones organizados
        marginRight: 10, // 🔥 Garante que fiquem alinhados à direita
    },

    headerIcon: {
        backgroundColor: "transparent", // 🔥 Remove qualquer fundo branco
        marginHorizontal: 5,
    },
    searchCloseIcon: {
        position: 'absolute',
        right: 10,
        backgroundColor: 'transparent',
    },
    searchContainer: {
        flexDirection: 'row',  // 🔥 Deixa a lupa, input e X na mesma linha
        alignItems: 'center',  // 🔥 Alinha os itens no centro verticalmente
        backgroundColor: '#fff',  // 🔥 Mantém o fundo branco para destaque
        borderRadius: 8,  // 🔥 Bordas arredondadas para um design mais clean
        paddingHorizontal: 10,  // 🔥 Adiciona um espaçamento interno
        elevation: 3,  // 🔥 Dá um efeito de sombra no Android
        shadowColor: '#000',  // 🔥 Dá um efeito de sombra no iOS
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: {width: 0, height: 2},
        marginBottom: 10,  // 🔥 Dá um espaço entre a busca e os outros componentes
    },
});

