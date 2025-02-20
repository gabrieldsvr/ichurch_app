import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "@/src/api/api";
import Animated, { FadeIn } from "react-native-reanimated";
import {useLocalSearchParams} from "expo-router";

interface Person {
    id: string;
    name: string;
    phone: string;
    present: boolean;
}

export default function EventSelfCheckInScreen() {
    const theme = useTheme();
    const { eventId } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [people, setPeople] = useState<Person[]>([]);
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEventData();
    }, []);

    const fetchEventData = async () => {
        try {
            const response = await api.get(`/community/events/${eventId}`);

            if (response.data) {
                fetchPeople(response.data.id);
            } else {
                Alert.alert("Aviso", "Nenhum evento ativo no momento.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Erro ao buscar evento ativo:", error);
            Alert.alert("Erro", "Falha ao carregar evento.");
            setLoading(false);
        }
    };

    const fetchPeople = async (eventId: string) => {
        try {
            const response = await api.get(`/community/events/${eventId}/people`);
            const sortedPeople = response.data
                .map((person: Person): Person => ({
                    ...person,
                    present: person.present || false, // Garante que a propriedade esteja definida
                }))
                .filter((person: Person) => !person.present) // Filtra apenas os não presentes
                .sort((a: Person, b: Person) => a.name.localeCompare(b.name));

            setPeople(sortedPeople);
            setFilteredPeople(sortedPeople);
        } catch (error) {
            console.error("Erro ao buscar participantes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filteredList = people.filter(person =>
            person.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPeople(filteredList);
    };


    const handleCheckIn = async (id: string) => {
        try {
            await api.post(`/community/attendance/toggle`, {
                event_id: eventId,
                person_id: id
            });

            setPeople(prevPeople =>
                prevPeople.map(person =>
                    person.id === id ? { ...person, present: true } : person
                )
            );

            setFilteredPeople(prevFiltered =>
                prevFiltered
                    .map(person =>
                        person.id === id ? { ...person, present: true } : person
                    )
                    .filter(person => !person.present) // Remove os presentes da listagem
            );

        } catch (error) {
            console.error("Erro ao registrar check-in:", error);
            Alert.alert("Erro", "Falha ao registrar presença. Tente novamente.");
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
                Check-in no Evento
            </Text>

            <TextInput
                placeholder="Digite seu nome..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
                keyboardType="default"
            />

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={filteredPeople}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Animated.View entering={FadeIn}>
                            <Card
                                style={[
                                    styles.card, { backgroundColor: theme.colors.primary }
                                ]}
                                onPress={() => !item.present && handleCheckIn(item.id)}
                            >
                                <Card.Content style={styles.cardContent}>
                                    <View style={styles.personInfo}>
                                        <MaterialCommunityIcons
                                            name={item.present ? "check-circle" : "account"}
                                            size={28}
                                            color={item.present ? theme.colors.primary : theme.colors.onPrimary}
                                        />
                                        <Text style={styles.personText}>
                                            {item.name} - {item.phone}
                                        </Text>
                                    </View>
                                </Card.Content>
                            </Card>
                        </Animated.View>
                    )}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    searchInput: {
        width: "100%",
        fontSize: 18,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        textAlign: "center",
    },
    card: {
        marginVertical: 8,
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    personInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    personText: {
        fontSize: 16,
        marginLeft: 10,
    },
});
