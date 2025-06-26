import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMinisteries } from "@/src/api/ministryService";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { useTheme } from "react-native-paper";
import { useTranslation } from "@/src/hook/useTranslation";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";
import { MinistryCard } from "@/src/component/MinistryCard";

export default function MinistryHome() {
  const [ministeries, setMinisteries] = useState<MinistryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();

  const fetchMinisteries = async () => {
    try {
      const data = await getMinisteries();
      setMinisteries(data);
    } catch (error) {
      console.error("Erro ao carregar ministérios:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMinisteries();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMinisteries();
  };

  const handleOpen = (id: string) => {
    router.push({
      pathname: "/ministry/ministry-detail",
      params: { id },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : ministeries.length === 0 ? (
        <Text
          style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
        >
          {t("no_ministries_found")}
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={ministeries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <MinistryCard ministry={item} onPress={() => handleOpen(item.id)} />
          )}
        />
      )}

      <ButtonFloatAdd
        pressAction={() => router.push("/ministry/upsert-ministry")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 30,
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
  },
});
