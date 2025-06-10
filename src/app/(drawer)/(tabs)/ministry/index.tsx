import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { getMinistryById, getMinistryMembers } from "@/src/api/ministryService";
import { useMinistry } from "@/src/contexts/MinistryProvider";

import { MinistryEnum } from "@/src/enum/MinistryEnum";
import { MinistryMetadata } from "@/src/constants/ministryMetadata";
import { VisibilityMetadata } from "@/src/constants/VisibilityMetadata";
import { MinistryVisibility } from "@/src/types/MinistryVisibility";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import { ModalAddRemoveMembers } from "@/src/component/modal/ModalAddRemoveMembers";
import { router } from "expo-router";

export default function MinistryDetailsScreen() {
  const theme = useTheme();
  const { currentMinistry } = useMinistry();
  const ministryId = currentMinistry?.id;

  const [ministry, setMinistry] = useState<any | null>(null);
  const [members, setMembers] = useState<PeopleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ministryData, memberData] = await Promise.all([
          getMinistryById(ministryId!),
          getMinistryMembers(ministryId!),
        ]);
        setMinistry(ministryData);
        setMembers(memberData);
        setSelected(new Set(memberData.map((m) => m.id)));
      } catch (err) {
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do ministério.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (ministryId) fetchData();
  }, [ministryId]);

  const handleCopyCode = () => {
    if (ministry?.accessCode) Clipboard.setStringAsync(ministry.accessCode);
  };

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSaveModal = () => {
    setShowModal(false);
    // Aqui você pode persistir os dados, se necessário
  };

  if (!ministry || loading) return null;

  const typeMeta = MinistryMetadata[ministry.type as MinistryEnum];
  const visibilityMeta =
    VisibilityMetadata[ministry.visibility as MinistryVisibility];

  const leaders = members.filter(
    (m) => m.role === "LEADER" || m.role === "AUX",
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Identidade */}
      <View style={styles.headerRow}>
        <Avatar.Icon
          icon={typeMeta?.icon || "folder"}
          size={60}
          style={{ backgroundColor: typeMeta?.color || theme.colors.primary }}
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text variant="titleLarge">{ministry.name}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            Tipo: {typeMeta?.label || ministry.type}
          </Text>
        </View>
        {ministry.visibility !== "private" && ministry.accessCode && (
          <IconButton icon="content-copy" onPress={handleCopyCode} />
        )}
      </View>

      {ministry.visibility !== "private" && ministry.accessCode && (
        <Text style={styles.codeText}>
          Código de acesso: {ministry.accessCode}
        </Text>
      )}

      <Divider style={{ marginVertical: 16 }} />

      {/* Resumo */}
      <Card style={styles.card}>
        <Card.Title
          title="Resumo"
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon={visibilityMeta.icon}
              style={{ backgroundColor: visibilityMeta.color }}
            />
          )}
        />
        <Card.Content>
          <Text>📍 Visibilidade: {visibilityMeta.label}</Text>
          <Text>🔧 Plugins: {ministry.plugins?.join(", ") || "Nenhum"}</Text>
          <Text>👥 Total de membros: {members.length}</Text>
          <Text>
            📆 Última atividade: {ministry.lastActivity || "Sem atividades"}
          </Text>
        </Card.Content>
      </Card>

      {/* Liderança */}
      <Card style={styles.card}>
        <Card.Title
          title="Liderança"
          left={(props) => <Avatar.Icon {...props} icon="account-group" />}
        />
        <Card.Content>
          {leaders.map((leader) => (
            <View key={leader.id} style={styles.leaderRow}>
              {leader.photo ? (
                <Avatar.Image
                  size={40}
                  source={{
                    uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${leader.photo}`,
                  }}
                />
              ) : (
                <Avatar.Icon icon="account" size={40} />
              )}
              <View style={{ marginLeft: 12 }}>
                <Text>{leader.name}</Text>
                <Text style={{ fontSize: 12, color: theme.colors.outline }}>
                  {leader.role === "LEADER"
                    ? "Líder"
                    : leader.role === "AUX"
                      ? "Auxiliar"
                      : leader.role}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => setShowModal(true)}>
            Ver todos os membros
          </Button>
        </Card.Actions>
      </Card>

      {/* Ação principal */}
      <Button
        icon="home-group"
        mode="contained"
        style={{ marginTop: 24 }}
        onPress={() => router.push(`/ministery/${ministryId}/cell-groups`)}
      >
        Abrir células
      </Button>

      {/* Modal */}
      <ModalAddRemoveMembers
        visible={showModal}
        onClose={() => setShowModal(false)}
        selected={selected}
        onToggle={handleToggle}
        onSave={handleSaveModal}
        search={search}
        setSearch={setSearch}
        title="Membros do ministério"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  codeText: {
    marginTop: 4,
    color: "#888",
    fontStyle: "italic",
  },
  card: {
    marginBottom: 16,
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
