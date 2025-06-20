import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Avatar, IconButton, List, Text, useTheme } from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";
import { getCellGroupsByMinistry } from "@/src/api/ministryService";
import { CellGroupDTO } from "@/src/dto/CellGroupDTO";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";

export default function CellGroupListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { currentMinistry } = useMinistry();

  const [cells, setCells] = useState<CellGroupDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const ministryId = currentMinistry?.id || "";

  const loadCells = async () => {
    try {
      setLoading(true);
      const response = await getCellGroupsByMinistry(ministryId);
      setCells(response.data || []);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar as células.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (ministryId) loadCells();
    }, [ministryId]),
  );

  const renderItem = ({ item }: { item: CellGroupDTO }) => (
    <List.Item
      title={item.name}
      description={`Líder: ${item.leader?.name || "Desconhecido"} • ${item.totalMembers || 0} membro(s)`}
      left={() =>
        item.leader?.photo ? (
          <Avatar.Image
            size={40}
            source={{
              uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${item.leader.photo}`,
            }}
          />
        ) : (
          <Avatar.Icon icon="account-group" size={40} />
        )
      }
      right={() => (
        <IconButton
          icon="chevron-right"
          onPress={() =>
            router.push({
              pathname: "/cell_group/cell-group-detail",
              params: { cellGroupId: item.id },
            })
          }
        />
      )}
      onPress={() =>
        router.push({
          pathname: "/cell_group/cell-group-detail",
          params: { cellGroupId: item.id },
        })
      }
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={cells}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <ButtonFloatAdd pressAction={() => router.push("/cell_group/upsert")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
});
