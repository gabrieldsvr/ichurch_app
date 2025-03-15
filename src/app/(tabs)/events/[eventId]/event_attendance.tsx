import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, View } from "react-native";
import {Avatar, Button, Card, Checkbox, Divider, IconButton, Text, TextInput, useTheme} from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import api from "@/src/api/api";

interface Person {
    id: string;
    name: string;
    type: string;
    present: boolean;
    photo?: string;
}

export default function EventAttendanceScreen() {
    const theme = useTheme();
    const { eventId } = useLocalSearchParams();
    const navigation = useNavigation();

    const [people, setPeople] = useState<Person[]>([]);
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
    const [pendingChanges, setPendingChanges] = useState<{ id: string; present: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>("all");
    const [showFilterModal, setShowFilterModal] = useState(false);

    useEffect(() => {
        fetchPeople();
    }, [eventId]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="filter"
                    size={24}
                    onPressOut={() => setShowFilterModal(true)}
                    iconColor={theme.colors.onSurface}
                />
            ),
        });
    }, []);

    const fetchPeople = async () => {
        try {
            console.log(eventId)
            const response = await api.get(`/community/events/${eventId}/people`);
            const sortedPeople = response.data.sort((a: Person, b: Person) => a.name.localeCompare(b.name));

            setPeople(sortedPeople);
            setFilteredPeople(sortedPeople);
        } catch (error) {
            console.error("Erro ao buscar participantes:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePresence = (id: string) => {
        setPendingChanges((prevChanges) => {
            const existingChange = prevChanges.find(change => change.id === id);
            if (existingChange) {
                return prevChanges.filter(change => change.id !== id);
            }
            return [...prevChanges, { id, present: !people.find(p => p.id === id)?.present }];
        });

        setPeople(prevPeople =>
            prevPeople.map(person =>
                person.id === id ? { ...person, present: !person.present } : person
            )
        );

        setFilteredPeople(prevFiltered =>
            prevFiltered.map(person =>
                person.id === id ? { ...person, present: !person.present } : person
            )
        );
    };

    const confirmAttendance = async () => {
        if (pendingChanges.length === 0) return;

        try {
            const toMark = pendingChanges.filter(change => change.present).map(change => change.id);
            const toUnmark = pendingChanges.filter(change => !change.present).map(change => change.id);

            if (toMark.length > 0) {
                await api.post(`/community/attendance/mark-multiple`, {
                    event_id: eventId,
                    person_ids: toMark,
                });
            }

            if (toUnmark.length > 0) {
                for (const personId of toUnmark) {
                    await api.post(`/community/attendance/toggle`, {
                        event_id: eventId,
                        person_id: personId,
                    });
                }
            }

            setPendingChanges([]);
            Alert.alert("Sucesso", "Presença confirmada com sucesso!");
        } catch (error) {
            console.error("Erro ao confirmar presença:", error);
            Alert.alert("Erro", "Falha ao registrar presença. Tente novamente.");
        }
    };

    const translateType = (type: string) => {
        switch (type) {
            case "regular_attendee":
                return "Frequentador";
            case "visitor":
                return "Visitante";
            case "member":
                return "Membro";
            default:
                return "Desconhecido";
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        filterPeople(query, selectedType);
    };

    const handleFilterByType = (type: string | null) => {
        setSelectedType(type ?? "all");
        filterPeople(searchQuery, type ?? "all");
    };

    const handleCloseModal = () => {
        setShowFilterModal(false);
    };

    const filterPeople = (query: string, type: string | null) => {
        let filteredList = people;

        if (query.trim() !== "") {
            filteredList = filteredList.filter(person =>
                person.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (type && type !== "all") {
            filteredList = filteredList.filter(person => person.type === type);
        }

        setFilteredPeople(filteredList);
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor: theme.colors.background }]} entering={FadeIn.duration(600)}>
            <TextInput
                placeholder="Pesquisar participante..."
                style={[styles.searchInput, { backgroundColor: theme.colors.surface }]}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <FlatList
                data={filteredPeople}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card
                        style={[
                            styles.card,
                            { backgroundColor: theme.colors.surface },
                            item.present && { borderWidth: 2, borderColor: theme.colors.primary }
                        ]}
                        onPress={() => togglePresence(item.id)}
                    >
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.personInfo}>
                                {item.photo ? (
                                    <Avatar.Image size={40} style={styles.avatar} source={{ uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${item.photo}` }} />
                                ) : (
                                    <Avatar.Icon size={40} icon="account" style={[styles.avatarIcon, { backgroundColor: theme.colors.surfaceVariant }]} />
                                )}
                                <Text style={[styles.personText, { color: theme.colors.onSurface }]}>
                                    {item.name} ({translateType(item.type)})
                                </Text>
                            </View>
                            <Checkbox
                                status={item.present ? "checked" : "unchecked"}
                                onPress={() => togglePresence(item.id)}
                            />
                        </Card.Content>
                        <Divider />
                    </Card>
                )}
            />

            <Button
                mode="contained"
                disabled={pendingChanges.length === 0}
                style={[styles.button, pendingChanges.length === 0 ? { backgroundColor: theme.colors.surfaceDisabled, opacity: 0.5 } : {}]}
                onPress={confirmAttendance}
            >
                Confirmar Presença
            </Button>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "transparent"
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        fontSize: 22,
        fontWeight: "bold"
    },
    searchInput: {
        marginBottom: 10,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: "transparent",
        borderWidth: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)" // 🔥 Fundo escuro semi-transparente
    },
    modalContent: {
        width: "85%",
        padding: 20,
        backgroundColor: "#1E1E1E", // 🔥 Fundo do modal no Dark Mode
        borderRadius: 10,
        alignItems: "center",
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF", // 🔹 Garante contraste no Dark Mode
        marginBottom: 15
    },
    modalTitleContainer: {
        width: '100%', // 🔥 Ocupa a largura total
        flexDirection: 'row', // 🔥 Mantém o layout em linha
        justifyContent: 'flex-end', // 🔥 Alinha o item à direita
        alignItems: 'center', // 🔥 Centraliza verticalmente
    },
    picker: {
        width: "100%",
        backgroundColor: "#333", // 🔥 Melhor contraste no Dark Mode
        color: "#FFF", // 🔥 Texto branco para legibilidade
        borderRadius: 8,
        marginBottom: 15
    },
    avatar: { marginRight: 10 },
    avatarIcon: { marginRight: 10 },
    container: { flex: 1, padding: 20 },
    card: { marginBottom: 10, padding: 10, elevation: 3, borderRadius: 8 },
    cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    personInfo: { flexDirection: "row", alignItems: "center" },
    personText: { fontSize: 16, marginLeft: 8, fontWeight: "500" },
    button: { marginTop: 20, borderRadius: 8 },
});
