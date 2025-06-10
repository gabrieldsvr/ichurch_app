import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, IconButton, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthProvider";

export default function MinistryTab() {
  const theme = useTheme();
  const router = useRouter();
  const auth = useAuth();

  const ministry = {
    name: "GABS - Adolescentes",
    description: "Ministério voltado para adolescentes de 12 a 17 anos.",
    id: "abc123",
  };

  const cellGroups = [
    { id: "c1", name: "Célula Alpha" },
    { id: "c2", name: "Célula Omega" },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Title
          title={ministry.name}
          subtitle={ministry.description}
          right={(props) => (
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => router.push(`/ministery/${ministry.id}/edit`)}
            />
          )}
        />
      </Card>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Células
      </Text>
      {cellGroups.map((cell) => (
        <Card
          key={cell.id}
          style={{ marginBottom: 12 }}
          onPress={() =>
            router.push(`/ministery/${ministry.id}/cell-groups/${cell.id}`)
          }
        >
          <Card.Title
            title={cell.name}
            left={(props) => <IconButton {...props} icon="account-group" />}
          />
        </Card>
      ))}

      <Button
        icon="plus"
        mode="contained-tonal"
        onPress={() =>
          router.push(`/ministery/${ministry.id}/cell-groups/upsert`)
        }
        style={{ marginBottom: 24 }}
      >
        Nova célula
      </Button>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Atalhos
      </Text>
      <View style={{ gap: 12 }}>
        <Card onPress={() => router.push(`/ministery/${ministry.id}/members`)}>
          <Card.Title
            title="Membros"
            left={(props) => <IconButton {...props} icon="account-multiple" />}
          />
        </Card>

        <Card
          onPress={() => router.push(`/ministery/${ministry.id}/permissions`)}
        >
          <Card.Title
            title="Permissões"
            left={(props) => (
              <IconButton {...props} icon="shield-key-outline" />
            )}
          />
        </Card>

        <Card onPress={() => router.push(`/ministery/${ministry.id}/stats`)}>
          <Card.Title
            title="Estatísticas"
            left={(props) => <IconButton {...props} icon="chart-bar" />}
          />
        </Card>

        <Card onPress={() => router.push(`/ministery/${ministry.id}/settings`)}>
          <Card.Title
            title="Configurações"
            left={(props) => <IconButton {...props} icon="cog" />}
          />
        </Card>
      </View>
    </ScrollView>
  );
}
