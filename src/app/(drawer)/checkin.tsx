import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useAuth } from "@/src/contexts/AuthProvider";
import api from "@/src/api/api";

export default function CheckinScannerScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [eventId, setEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [alreadyChecked, setAlreadyChecked] = useState(false);

  useEffect(() => {
    if (permission?.status === "undetermined") {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (isScanning || dialogVisible) return;
    setIsScanning(true);
    setLoading(true);
    let parsedEventId: string | null = null;

    // Interpreta o QR como JSON ou UUID
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed.eventId === "string") {
        parsedEventId = parsed.eventId;
      }
    } catch {
      if (/^[a-f0-9\-]{36}$/.test(data)) {
        parsedEventId = data;
      }
    }

    if (!parsedEventId) {
      setStatusMessage("Formato do QR Code inválido.");
      finalizeScan();
      return;
    }

    try {
      const { data: eventData } = await api.get(
        `/community/events/${parsedEventId}`,
      );
      const { data: check } = await api.get(
        `/community/events/${parsedEventId}/check-status`,
      );
      finalizeScan();
      setEventId(parsedEventId);
      setEventName(eventData.name);

      if (check?.alreadyChecked) {
        setAlreadyChecked(true);
        setStatusMessage("Você já marcou presença neste evento.");
      } else {
        setAlreadyChecked(false);
        setStatusMessage(null);
      }
    } catch (err: any) {
      console.error("Erro ao buscar evento:", err?.message || err);
      setStatusMessage("Evento não encontrado ou QR inválido.");
    } finally {
      setDialogVisible(true);
      setLoading(false);
    }
  };

  const confirmCheckin = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      await api.post(`/community/events/${eventId}/checkin`);
      setStatusMessage("Presença confirmada com sucesso!");
      setAlreadyChecked(true);
      setTimeout(() => handleCloseDialog(), 2000);
    } catch {
      setStatusMessage("Erro ao registrar presença.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setEventId(null);
    setEventName("");
    setStatusMessage(null);
    setAlreadyChecked(false);
    setIsScanning(false);
  };

  const finalizeScan = () => {
    setDialogVisible(true);
    setLoading(false);
    setIsScanning(false);
  };

  if (permission === null || permission.status === "undetermined") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating color={theme.colors.primary} />
        <Text>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>Permissão da câmera não concedida.</Text>
        <Button mode="contained" onPress={requestPermission}>
          Permitir Acesso
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!dialogVisible && (
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        >
          <View style={styles.layerContainer}>
            <View style={styles.layerTop} />
            <View style={styles.layerCenter}>
              <View style={styles.layerSide} />
              <View style={styles.focused} />
              <View style={styles.layerSide} />
            </View>
            <View style={styles.layerBottom} />
          </View>
        </CameraView>
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleCloseDialog}>
          <Dialog.Title>Check-in do Evento</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {statusMessage ??
                `Deseja confirmar presença no evento "${eventName}"?`}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseDialog}>Fechar</Button>
            {!statusMessage && !alreadyChecked && (
              <Button
                onPress={confirmCheckin}
                loading={loading}
                disabled={loading}
              >
                Confirmar
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  layerContainer: {
    flex: 1,
  },
  layerTop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  layerCenter: {
    flexDirection: "row",
  },
  layerSide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  focused: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#00FF00",
    borderRadius: 8,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});
