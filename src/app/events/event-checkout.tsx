import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Checkbox,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getEventById, saveAttendances } from "@/src/api/eventService";
import { EventDTO } from "@/src/dto/EventDTO";
import { getMinistryMembers } from "@/src/api/ministryService";

interface FormDataMember {
  id: string;
  personId: string;
  role: string;
  status: string;
  name: string;
  email: string | null;
  photo?: string | null;
}

export default function EventAttendanceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { eventId, ministryId } = useLocalSearchParams<{
    eventId?: string;
    ministryId?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventDTO>({} as EventDTO);
  const [members, setMembers] = useState<FormDataMember[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<{
    [personId: string]: boolean;
  }>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!eventId || !ministryId) return;

    const load = async () => {
      try {
        setLoading(true);

        const eventData = await getEventById(eventId);
        setEvent(eventData);

        const people = await getMinistryMembers(ministryId);
        setMembers(people);

        const map: { [personId: string]: boolean } = {};
        (eventData.attendances || []).forEach((a) => {
          if (a.personId) {
            map[a.personId] = true;
          }
        });
        setAttendanceMap(map);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId, ministryId]);

  const toggleCheck = (personId: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [personId]: !prev[personId],
    }));
  };

  const handleSave = async () => {
    if (!eventId) return;

    const selected = Object.entries(attendanceMap)
      .filter(([_, isPresent]) => isPresent)
      .map(([personId]) => personId);

    try {
      await saveAttendances(eventId, selected);
      router.back();
    } catch (error) {
      console.error("Erro ao salvar presenças:", error);
      Alert.alert("Erro", "Falha ao salvar presenças.");
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const totalPresent = Object.values(attendanceMap).filter(Boolean).length;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating color={theme.colors.primary} />
        <Text style={{ marginTop: 12 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TextInput
        placeholder="Buscar por nome"
        value={search}
        onChangeText={setSearch}
        style={[styles.searchInput, { borderColor: theme.colors.outline }]}
        placeholderTextColor={theme.colors.outline}
      />

      <ScrollView>
        {filteredMembers.map((user) => (
          <Pressable
            key={user.personId}
            onPress={() => toggleCheck(user.personId)}
            style={styles.memberCard}
          >
            <View style={styles.memberLeft}>
              {user.photo ? (
                <Avatar.Image
                  size={40}
                  source={{
                    uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user.photo}`,
                  }}
                />
              ) : (
                <Avatar.Icon size={40} icon="account" />
              )}
              <Text
                style={[
                  styles.memberName,
                  { color: theme.colors.onBackground },
                ]}
              >
                {user.name}
              </Text>
            </View>
            <Checkbox
              status={attendanceMap[user.personId] ? "checked" : "unchecked"}
              onPress={() => toggleCheck(user.personId)}
            />
          </Pressable>
        ))}
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleSave}
        style={{ marginVertical: 16 }}
      >
        Salvar presença
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    marginLeft: 12,
    fontSize: 16,
  },
});
