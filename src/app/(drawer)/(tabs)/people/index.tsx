import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
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

interface PeopleCardProps {
  person: Person;
  onPress: () => void;
}

export function PersonCard({ person, onPress }: PeopleCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer]}>
        <Image source={{ uri: person.avatar }} style={styles.avatar} />
      </View>
      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {person.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PeopleListScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [filterActive, setFilterActive] = useState<"filter">("filter");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Busca dados sempre que a tela ganha foco
  const fetchPeople = async () => {
    try {
      const response = await getUsers("?status=active");

      const people: Person[] = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        description: user.ministryName ?? "No ministry", // ajuste conforme API
        avatar: user?.photo
          ? `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user?.photo}`
          : "https://randomuser.me/api/portraits/lego/1.jpg",
      }));
      setPeopleData(people);
    } catch (error) {
      console.error("Erro ao carregar ministérios:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPeople();
    }, []),
  );

  // Filtro simples local
  const filteredPeople = peopleData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPeople();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TextInput
        placeholder={t("search")}
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
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <PersonCard
              person={item}
              onPress={() => {
                router.push({
                  pathname: "/people/people-details",
                  params: { id: item.id },
                });
              }}
            />
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
  container: { flex: 1, paddingHorizontal: 16 },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  searchInput: {
    marginTop: 12,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
});
