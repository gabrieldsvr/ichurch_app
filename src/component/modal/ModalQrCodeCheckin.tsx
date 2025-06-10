import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";

interface QrCodeModalProps {
  visible: boolean;
  onDismiss: () => void;
  eventId: string;
}

export default function ModalQrCodeCheckin({
  visible,
  onDismiss,
  eventId,
}: QrCodeModalProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          QR Code para Check-in
        </Text>

        <View style={styles.qrWrapper}>
          <QRCode value={JSON.stringify({ eventId })} size={240} />
        </View>

        <Button onPress={onDismiss} style={styles.closeButton} mode="outlined">
          Fechar
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 24,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
  },
  closeButton: {
    marginTop: 24,
    alignSelf: "stretch",
  },
});
