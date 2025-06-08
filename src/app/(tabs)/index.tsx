import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";
import api from "@/src/api/api";
import { useFocusEffect } from "expo-router";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { useMinistry } from "@/src/contexts/MinistryProvider";

export default function HomeScreen() {
  const theme = useAppTheme().theme;
  const [ministries, setMinistries] = useState<MinistryDTO[]>([]);
  const [loadingMinistries, setLoadingMinistries] = useState(true);

  const { currentMinistry, setCurrentMinistry, loading } = useMinistry();

  const fetchMinistries = async () => {
    try {
      const response = await api.get("/ministry/ministries");
      const list: MinistryDTO[] = response.data;
      setMinistries(list);

      if (!loading && !currentMinistry && list.length > 0) {
        setCurrentMinistry({
          id: list[0].id,
          type: list[0].type || "default",
          name: list[0].name,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar ministérios:", error);
    } finally {
      setLoadingMinistries(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMinistries();
    }, []),
  );

  return (
    <ThemeProvider>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Animated.Text
          entering={FadeInDown.duration(600)}
          style={[styles.title, { color: theme.colors.secondary }]}
        >
          📖 iChurch
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.duration(800)}
          style={[styles.subtitle, { color: theme.colors.secondary }]}
        >
          "Servindo com excelência, amando com propósito."
        </Animated.Text>

        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
          🙌 Ministérios
        </Text>
        <View style={styles.view}>
          {loadingMinistries || loading ? (
            <ActivityIndicator size="small" color={theme.colors.secondary} />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={ministries}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    setCurrentMinistry({
                      id: item.id,
                      type: item.type || "default",
                      name: item.name,
                    })
                  }
                  style={[
                    styles.ministryCard,
                    currentMinistry?.id === item.id && styles.selectedCard,
                  ]}
                >
                  <Card.Content>
                    <Text style={styles.ministryName}>{item.name}</Text>
                    <Text style={styles.ministryInfo}>
                      👥 Membros: {item.members || 0}
                    </Text>
                  </Card.Content>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 8,
  },
  ministryCard: {
    width: 160,
    height: 100,
    marginRight: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#1E90FF",
  },
  ministryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  ministryInfo: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
