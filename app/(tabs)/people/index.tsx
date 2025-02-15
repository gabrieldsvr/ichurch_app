import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, Alert, TextInput } from 'react-native';
import { Button, Card, Text, IconButton, Switch } from 'react-native-paper';
import { router } from "expo-router";
import { api } from '@/api/peopleService';

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
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPeople();
    }, [showAll]);

    const fetchPeople = async () => {
        try {
            setRefreshing(true);
            const statusParam = showAll ? "" : "?status=true";
            const response = await api.get(`/people${statusParam}`);

            // 🔥 Ordena os nomes alfabeticamente antes de definir o estado
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

    // 🔥 Função para filtrar usuários pelo nome
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filteredList = people.filter(person =>
            person.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPeople(filteredList);
    };

    return (
        <View style={styles.container}>
            <Button
                icon="plus"
                mode="contained"
                onPress={() => router.navigate('/people/insert')}
                style={styles.addButton}
                labelStyle={styles.addButtonText}
            >
                Adicionar Usuário
            </Button>

            {/* 🔥 Campo de busca por nome */}
            <TextInput
                placeholder="Pesquisar por nome..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* 🔥 Filtro para mostrar ativos e inativos */}
            <View style={styles.filterContainer}>
                <Text style={styles.filterText}>Exibir ativos e inativos</Text>
                <Switch
                    value={showAll}
                    onValueChange={() => setShowAll(!showAll)}
                />
            </View>

            {/* 🔥 Lista de usuários */}
            <FlatList
                data={filteredPeople}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPeople} />}
                renderItem={({ item }) => (
                    <Card style={[styles.card, !item.status && styles.inactiveCard]}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userType}>{item.type}</Text>
                                <Text style={styles.userPhone}>📞 {item.phone}</Text>
                                {item.instagram && <Text style={styles.userInstagram}>📷 {item.instagram}</Text>}
                                <Text style={styles.userbirth_date}>🎂 {new Date(item.birth_date).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.actionButtons}>
                                {/* 🔥 Se ativo, mostra lixeira (que apenas inativa) */}
                                {item.status ? (
                                    <IconButton
                                        icon="delete"
                                        iconColor="red"
                                        size={28}
                                        style={styles.toggleButton}
                                        onPress={() => toggleStatus(item.id)}
                                    />
                                ) : (
                                    /* 🔥 Se inativo, mostra botão verde para ativar */
                                    <IconButton
                                        icon="account-check"
                                        iconColor="green"
                                        size={28}
                                        style={styles.toggleButton}
                                        onPress={() => toggleStatus(item.id)}
                                    />
                                )}
                            </View>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    addButton: {
        backgroundColor: '#1E88E5',
        borderRadius: 8,
        paddingVertical: 8,
        marginBottom: 15,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchInput: {
        marginBottom: 10,
        padding: 10,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 2,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 2,
    },
    filterText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        marginVertical: 6,
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        backgroundColor: 'white',
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
    userbirth_date: {
        fontSize: 14,
        color: '#6A1B9A',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButton: {
        borderRadius: 30,
        padding: 8,
    },
});
