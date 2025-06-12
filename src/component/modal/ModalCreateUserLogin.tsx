import React from "react";
import {
  Modal,
  Surface,
  Text,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";

interface ModalContentProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  handleCreateAccount: () => void;
  t: (key: string) => string;
}

export const ModalCreateUserLogin: React.FC<ModalContentProps> = ({
  modalVisible,
  setModalVisible,
  email,
  setEmail,
  loading,
  handleCreateAccount,
  t,
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={modalVisible}
      onDismiss={() => {
        setModalVisible(false);
        setEmail("");
      }}
      contentContainerStyle={StyleSheet.absoluteFill}
    >
      <View style={styles.centeredContainer}>
        <Surface
          style={[
            styles.modalSurface,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={3}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
            {t("info_email_new_account")}
          </Text>

          <TextInput
            label={t("email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
                text: theme.colors.onSurface,
                placeholder: theme.colors.outline,
              },
            }}
          />

          <Button
            mode="contained"
            onPress={handleCreateAccount}
            loading={loading}
            disabled={!email}
            style={styles.modalButton}
            contentStyle={{ paddingVertical: 6 }}
          >
            {t("create_account")}
          </Button>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalSurface: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  modalButton: {
    marginTop: 8,
  },
});
