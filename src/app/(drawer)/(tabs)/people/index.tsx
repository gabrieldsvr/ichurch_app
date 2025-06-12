import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { getUsers } from "@/src/api/peopleService";
import { useTranslation } from "@/src/hook/useTranslation";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";
import { useAuth } from "@/src/contexts/AuthProvider";
import { PeopleDTO } from "@/src/dto/PeopleDTO";

interface PeopleCardProps {
  person: PeopleDTO;
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
        <Image source={{ uri: person.photo as any }} style={styles.avatar} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoContainer}>
          <Text
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {person.name}
          </Text>
          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
            numberOfLines={1}
          >
            {person.email}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PeopleListScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const auth = useAuth();

  const [filterActive, setFilterActive] = useState<"filter">("filter");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [peopleData, setPeopleData] = useState<PeopleDTO[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Busca dados sempre que a tela ganha foco
  const fetchPeople = async () => {
    try {
      const response = await getUsers("?status=active");

      const people: PeopleDTO[] = response.data.map((user: any) => ({
        ...user,
        photo: user?.photo
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
  const filteredPeople = peopleData.filter((p) => {
    const searchText = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchText) ||
      (p.email && p.email.toLowerCase().includes(searchText))
    );
  });

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
        left={<TextInput.Icon icon="magnify" />}
        style={styles.searchInput}
        theme={{
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.surface,
            text: theme.colors.onSurface,
            placeholder: theme.colors.outline,
            outline: theme.colors.outline,
          },
        }}
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
      {auth.user?.isMaster ? (
        <ButtonFloatAdd
          pressAction={() => {
            router.push("/people/upsert");
          }}
        />
      ) : (
        <></>
      )}
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
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowRadius: 8,
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
    fontWeight: "500",
    textTransform: "capitalize",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});
