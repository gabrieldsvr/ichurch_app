import {useEffect, useLayoutEffect, useState} from 'react';
import { FlatList, StyleSheet, View, RefreshControl, Alert, TextInput, Modal } from 'react-native';
import { Button, Card, Text, IconButton, Switch } from 'react-native-paper';
import { useNavigation, useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import { api } from '@/api/peopleService';
import { Stack } from 'expo-router';
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
    const [filterType, setFilterType] = useState<string | null>('all');
    const [includeInactive, setIncludeInactive] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
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
                        onPress={toggleSearch}
                        style={styles.headerIcon}
                    />
                    <IconButton
                        icon="filter"
                        size={24}
                        onPress={() => setShowFilterModal(true)}
                        style={styles.headerIcon}
                    />
                </View>
            ),
        });
    }, [toggleSearch, setShowFilterModal]);

    const toggleSearch = () => {
        setSearchVisible((prev) => {
            if (prev) {
                setSearchQuery(''); // 🔥 Reseta a pesquisa ao esconder
                setFilteredPeople(people);
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
            params: { id },
        });
    };

    const translateUserType = (type: string) => {
        switch (type) {
            case 'visitor': return 'Visitante';
            case 'regular_attendee': return 'Frequentador';
            case 'member': return 'Membro';
            default: return 'Desconhecido';
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
        setFilterType('all');
        setIncludeInactive(false);
        setFilteredPeople(people);
        setShowFilterModal(false);
    };

    const [count, setCount] = useState(0);


    useLayoutEffect(() => {
        // 🔥 Atualiza dinamicamente o botão no header
        navigation.setOptions({
            headerRight: () => (
                <Button title={`Contar: ${count}`} onPress={() => setCount((c) => c + 1)} />
            ),
        });
    }, [count]); // 🚀 Atualiza sempre que count muda

    return (
       <>
           <Text>Count: {count}</Text>
           <View style={styles.container}>
               {searchVisible && (
                   <TextInput
                       placeholder="Pesquisar por nome..."
                       style={styles.searchInput}
                       value={searchQuery}
                       onChangeText={(query) => setSearchQuery(query)}
                   />
               )}

               <FlatList
                   data={filteredPeople}
                   keyExtractor={(item) => item.id}
                   refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPeople} />}
                   renderItem={({ item }) => (
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
                                       size={24}
                                       onPress={() => handleEdit(item.id)}
                                       style={styles.iconButton}
                                   />
                                   <IconButton
                                       icon={item.status ? "delete" : "account-check"}
                                       iconColor={item.status ? "red" : "green"}
                                       size={24}
                                       onPress={() => toggleStatus(item.id)}
                                       style={styles.iconButton}
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
                           <IconButton
                               icon="close"
                               size={30}
                               style={styles.closeButton}
                               onPress={() => setShowFilterModal(false)}
                           />

                           <Text style={styles.modalTitle}>Filtros</Text>

                           <Text style={styles.filterLabel}>Tipo de Pessoa:</Text>
                           <Picker
                               selectedValue={filterType}
                               onValueChange={(value) => setFilterType(value)}
                               style={styles.picker}
                           >
                               <Picker.Item label="Todos" value="all" />
                               <Picker.Item label="Visitante" value="visitor" />
                               <Picker.Item label="Frequentador" value="regular_attendee" />
                               <Picker.Item label="Membro" value="member" />
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
           </View></>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },

    /* 🔍 Barra de Pesquisa */
    searchInput: {
        marginBottom: 10,
        padding: 10,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: '#fff'
    },

    /* 📌 Botões no Header */
    headerButtons: {
        flexDirection: "row",
        marginRight: 10
    },

    headerIcon: {
        marginHorizontal: 5
    },

    /* 📋 Cartões de Usuário */
    card: {
        marginVertical: 6,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 3
    },

    inactiveCard: {
        backgroundColor: '#F5F5F5',
        opacity: 0.7
    },

    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    userInfo: {
        flex: 1
    },

    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },

    userType: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5
    },

    userPhone: {
        fontSize: 14,
        color: '#00796B'
    },

    userInstagram: {
        fontSize: 14,
        color: '#D81B60'
    },

    userBirthDate: {
        fontSize: 14,
        color: '#6A1B9A'
    },

    /* 🔧 Botões de Ação */
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },

    iconButton: {
        padding: 4,
        marginHorizontal: 2,
        width: 28,
        height: 28
    },

    /* 📌 Modal de Filtros */
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        position: 'relative'
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },

    /* ❌ Botão Fechar no Modal */
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },

    /* 🔄 Switch para Incluir Inativos */
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },

    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },

    picker: {
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },

    applyFilterButton: {
        marginLeft: 10
    }
});

