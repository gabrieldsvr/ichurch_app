import React, { useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    Text,
} from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import {router, useFocusEffect} from "expo-router";

interface Person {
    id: string;
    name: string;
    description: string;
    avatar: string;
}

const peopleData: Person[] = [
    {
        id: "1",
        name: "Sowe Name",
        description: "Ministry",
        avatar:
            "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: "2",
        name: "Corise",
        description: "Some Non",
        avatar:
            "https://randomuser.me/api/portraits/women/72.jpg",
    },
    {
        id: "3",
        name: "Mawe Name",
        description: "Minn Non",
        avatar:
            "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        id: "4",
        name: "Mowy Name",
        description: "Reme Recr",
        avatar:
            "https://randomuser.me/api/portraits/women/66.jpg",
    },
    {
        id: "5",
        name: "Soblietiom",
        description: "Creme Rem",
        avatar:
            "https://randomuser.me/api/portraits/women/75.jpg",
    },
];

export default function PeopleListScreen() {
    const theme = useTheme();

    const [filterActive, setFilterActive] = useState<"filter" | "ministry" | "role">("filter");
    const [search, setSearch] = useState("");

    const filteredPeople = peopleData.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={styles.headerTitle}>People <Text style={styles.headerSubtitle}>/ Members</Text></Text>

            <TextInput
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { borderColor: theme.colors.disabled }]}
                placeholderTextColor={theme.colors.disabled}
            />

            {/* Filtros */}
            <View style={styles.filtersRow}>
                <TouchableOpacity
                    style={[styles.filterTab, filterActive === "filter" && styles.filterTabActive]}
                    onPress={() => setFilterActive("filter")}
                >
                    <Text style={[styles.filterText, filterActive === "filter" && styles.filterTextActive]}>
                        Filter by
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterTab, filterActive === "ministry" && styles.filterTabActive]}
                    onPress={() => setFilterActive("ministry")}
                >
                    <Text style={[styles.filterText, filterActive === "ministry" && styles.filterTextActive]}>
                        Ministry
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterTab, filterActive === "role" && styles.filterTabActive]}
                    onPress={() => setFilterActive("role")}
                >
                    <Text style={[styles.filterText, filterActive === "role" && styles.filterTextActive]}>
                        Role
                    </Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />
                <Button
                    mode="contained"
                    onPress={() => {
                        router.push("/people/upsert");
                    }}
                    compact
                    contentStyle={{ paddingVertical: 4, paddingHorizontal: 12 }}
                >
                    Add New Person
                </Button>
            </View>

            {/* Lista de pessoas */}
            <FlatList
                data={filteredPeople}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 16 }}
                renderItem={({ item }) => (
                    <View style={[styles.personCard, { backgroundColor: theme.colors.surface }]}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />

                        <View style={styles.personInfo}>
                            <Text style={[styles.personName, { color: theme.colors.onSurface }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.personDescription, { color: theme.colors.onSurfaceVariant }]}>
                                {item.description}
                            </Text>
                        </View>

                        <IconButton
                            icon="account-circle-outline"
                            size={28}
                            onPress={() => alert(`Profile: ${item.name}`)}
                            style={styles.profileButton}
                            color={theme.colors.primary}
                        />
                    </View>
                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
    },
    headerSubtitle: {
        fontWeight: "normal",
        color: "#888",
    },
    searchInput: {
        marginTop: 12,
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    filtersRow: {
        flexDirection: "row",
        marginTop: 12,
        alignItems: "center",
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    filterTabActive: {
        borderBottomColor: "#3B82F6",
    },
    filterText: {
        fontSize: 16,
        color: "#000",
    },
    filterTextActive: {
        color: "#3B82F6",
        fontWeight: "bold",
    },
    personCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    personInfo: {
        flex: 1,
        marginLeft: 12,
    },
    personName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    personDescription: {
        fontSize: 14,
        marginTop: 2,
    },
    profileButton: {
        marginLeft: 12,
    },
    bottomNav: {
        height: 60,
        borderTopWidth: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
    },
});
