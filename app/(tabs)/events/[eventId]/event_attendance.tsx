import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, StyleSheet, TextInput, View} from 'react-native';
import {Button, Card, Checkbox, Divider, Text} from 'react-native-paper';
import {useLocalSearchParams} from 'expo-router';
import {api} from '@/api/peopleService';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Animated, {FadeIn} from 'react-native-reanimated';
import {Picker} from "@react-native-picker/picker";

interface Person {
    id: string;
    name: string;
    type: string;
    present: boolean;
}

export default function EventAttendanceScreen() {
    const {eventId} = useLocalSearchParams();
    const [people, setPeople] = useState<Person[]>([]);
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
    const [pendingChanges, setPendingChanges] = useState<{ id: string; present: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await api.get(`/attendance/event/${eventId}`);
                const sortedPeople = response.data.attendees.sort((a: Person, b: Person) =>
                    a.name.localeCompare(b.name)
                );
                setPeople(sortedPeople);
                setFilteredPeople(sortedPeople);
            } catch (error) {
                console.error('Erro ao buscar participantes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPeople();
    }, [eventId]);

    const togglePresence = (id: string) => {
        setPendingChanges((prevChanges) => {
            const existingChange = prevChanges.find(change => change.id === id);
            if (existingChange) {
                return prevChanges.filter(change => change.id !== id);
            }
            const currentPerson = people.find(p => p.id === id);
            return [...prevChanges, {id, present: !currentPerson?.present}];
        });

        setPeople((prevPeople) =>
            prevPeople.map((person) =>
                person.id === id ? {...person, present: !person.present} : person
            )
        );

        setFilteredPeople((prevFiltered) =>
            prevFiltered.map((person) =>
                person.id === id ? {...person, present: !person.present} : person
            )
        );
    };

    const confirmAttendance = async () => {
        if (pendingChanges.length === 0) return;

        try {
            const toMark = pendingChanges.filter(change => change.present).map(change => change.id);
            const toUnmark = pendingChanges.filter(change => !change.present).map(change => change.id);

            if (toMark.length > 0) {
                await api.post(`/attendance/mark-multiple`, {
                    event_id: eventId,
                    person_ids: toMark
                });
            }

            if (toUnmark.length > 0) {
                for (const personId of toUnmark) {
                    await api.post(`/attendance/toggle`, {
                        event_id: eventId,
                        person_id: personId
                    });
                }
            }

            setPendingChanges([]);
            Alert.alert("Sucesso", "Presença confirmada com sucesso!");
        } catch (error) {
            console.error('Erro ao confirmar presença:', error);
            Alert.alert("Erro", "Falha ao registrar presença. Tente novamente.");
        }
    };

    const translateType = (type: string) => {
        switch (type) {
            case 'regular_attendee':
                return 'Frequentador';
            case 'visitor':
                return 'Visitante';
            case 'member':
                return 'Membro';
            default:
                return 'Desconhecido';
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        filterPeople(query, selectedType);
    };

    const handleFilterByType = (type: string | null) => {
        const selected = type ?? ""; // Garantir que "Todos" seja tratado corretamente
        setSelectedType(selected);
        filterPeople(searchQuery, selected);
    };


    const filterPeople = (query: string, type: string | null) => {
        let filteredList = people;

        if (query.trim() !== '') {
            filteredList = filteredList.filter(person =>
                person.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (type && type !== 'all') {
            filteredList = filteredList.filter(person => person.type === type);
        }

        setFilteredPeople(filteredList);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998"/>
                <Text style={styles.loadingText}>Carregando participantes...</Text>
            </View>
        );
    }

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(600)}>
            <Text style={styles.title}>Registro de Presença</Text>

            {/* Campo de Pesquisa */}
            <TextInput
                placeholder="Pesquisar participante..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <Picker
                selectedValue={selectedType}
                style={styles.picker}
                onValueChange={(itemValue) => handleFilterByType(itemValue)}
            >
                <Picker.Item label="Todos" value="all"/>
                <Picker.Item label="Frequentador" value="regular_attendee"/>
                <Picker.Item label="Visitante" value="visitor"/>
                <Picker.Item label="Membro" value="member"/>
            </Picker>


            <FlatList
                data={filteredPeople}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Card
                        style={[styles.card, item.present && styles.cardChecked]}
                        onPress={() => togglePresence(item.id)}
                    >
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.personInfo}>
                                <MaterialCommunityIcons
                                    name={item.present ? "account-check" : "account"}
                                    size={24}
                                    color={item.present ? "#4CAF50" : "#555"}
                                />
                                <Text style={styles.personText}>{item.name} ({translateType(item.type)})</Text>
                            </View>
                            <Checkbox
                                status={item.present ? 'checked' : 'unchecked'}
                                onPress={() => togglePresence(item.id)}
                            />
                        </Card.Content>
                        <Divider/>
                    </Card>
                )}
            />
            <Button
                mode="contained"
                icon="check-circle"
                onPress={confirmAttendance}
                disabled={pendingChanges.length === 0}
                style={[styles.button, pendingChanges.length > 0 ? styles.buttonActive : {}]}
            >
                Confirmar Presença
            </Button>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#f5f5f5'},
    loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    loadingText: {marginTop: 10, fontSize: 16, color: '#555'},
    title: {textAlign: 'center', marginBottom: 20, fontSize: 22, fontWeight: 'bold', color: '#3b5998'},
    searchInput: {marginBottom: 10, padding: 10, fontSize: 16, borderRadius: 8, backgroundColor: '#fff', elevation: 2},
    filterButton: {marginBottom: 10},
    card: {marginBottom: 10, padding: 10, backgroundColor: '#ffffff', elevation: 3, borderRadius: 8},
    cardChecked: {borderWidth: 2, borderColor: '#4CAF50'},
    cardContent: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    personInfo: {flexDirection: 'row', alignItems: 'center'},
    personText: {fontSize: 16, marginLeft: 8, color: '#333'},
    button: {marginTop: 20, backgroundColor: '#ccc'},
    buttonActive: {backgroundColor: '#3b5998'},
    picker: { marginBottom: 10, backgroundColor: '#fff', borderRadius: 8 },

});
