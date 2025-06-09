import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMinisteries } from "@/src/api/ministryService";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "@/src/hook/useTranslation";
import { MinistryMetadata } from "@/src/constants/ministryMetadata";
import { VisibilityMetadata } from "@/src/constants/VisibilityMetadata";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";

interface MinistryCardProps {
  ministry: MinistryDTO;
  onPress: () => void;
}

export function MinistryCard({ ministry, onPress }: MinistryCardProps) {
  const meta = MinistryMetadata[ministry.type] || MinistryMetadata["outro"];
  const visibilityInfo =
    VisibilityMetadata[ministry.visibility] || VisibilityMetadata["public"];
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: meta.color + "33" }]}
      >
        <MaterialCommunityIcons
          name={meta.icon as any}
          size={28}
          color={meta.color}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {ministry.name}
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {visibilityInfo.label}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text
          style={[
            styles.membersCount,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {ministry.peopleCount ?? 0} {t("members")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

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
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  membersCount: {
    fontSize: 12,
  },
});
