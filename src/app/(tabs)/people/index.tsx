import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { getUsers } from "@/src/api/peopleService"; // importe sua função real
import { useTranslation } from "@/src/hook/useTranslation";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";

interface Person {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

export default function PeopleListScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [filterActive, setFilterActive] = useState<"filter">("filter");
  const [search, setSearch] = useState("");
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca dados sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchPeople = async () => {
        setLoading(true);
        try {
          const response = await getUsers("?status=active");
          if (isActive && response?.data) {
            // Transforme os dados recebidos para o formato esperado, se necessário
            const people: Person[] = response.data.map((user: any) => ({
              id: user.id,
              name: user.name,
              description: user.ministryName ?? "No ministry", // ajuste conforme API
              avatar: user?.photo
                ? `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user?.photo}`
                : "https://randomuser.me/api/portraits/lego/1.jpg",
            }));
            setPeopleData(people);
          }
        } catch (error) {
          console.error("Erro ao carregar pessoas:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchPeople();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Filtro simples local
  const filteredPeople = peopleData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
        {t("people")}
      </Text>

      <TextInput
        placeholder={t("search") || "Search"}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.searchInput,
          {
            borderColor: theme.colors.outline,
            color: theme.colors.onBackground,
          },
        ]}
        placeholderTextColor={theme.colors.outline}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredPeople}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 16 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.personCard,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/people/people-details",
                  params: { id: item.id },
                })
              }
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.personInfo}>
                <Text
                  style={[styles.personName, { color: theme.colors.onSurface }]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.personDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <ButtonFloatAdd
        pressAction={() => {
          router.push("/people/upsert");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
  headerTitle: {
    fontSize: 28,
    marginTop: 10,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontWeight: "normal",
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
  filterText: {
    fontSize: 16,
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
});
