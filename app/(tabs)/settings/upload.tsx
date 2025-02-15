import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { api } from "@/api/peopleService";

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // 📌 Selecionar arquivo
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
                    "application/vnd.ms-excel" // XLS
                ],
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets?.length) {
                Alert.alert("Seleção cancelada", "Nenhum arquivo foi selecionado.");
                return;
            }

            setSelectedFile(result.assets[0]);
        } catch (error) {
            console.error("Erro ao selecionar arquivo:", error);
            Alert.alert("Erro", "Ocorreu um erro ao selecionar o arquivo.");
        }
    };

    // 📌 Enviar arquivo para o backend
    const uploadFile = async () => {
        if (!selectedFile) {
            Alert.alert("Erro", "Por favor, selecione um arquivo primeiro.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.mimeType || "application/octet-stream",
            } as any);

            console.log("Enviando para o backend:", formData);

            const response = await api.post("/people/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Alert.alert("Sucesso", `Arquivo enviado com sucesso! ${response.data.message}`);
            console.log("Resposta do servidor:", response.data);
        } catch (error: any) {
            console.error("Erro ao enviar o arquivo:", error);
            Alert.alert("Erro", "Falha ao enviar o arquivo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload de Pessoas via Excel</Text>

            <Button mode="contained" icon="file-upload" onPress={pickDocument} style={styles.button}>
                Selecionar Arquivo
            </Button>

            {selectedFile && <Text style={styles.fileName}>📂 {selectedFile.name}</Text>}

            <Button
                mode="contained"
                icon="cloud-upload"
                onPress={uploadFile}
                disabled={!selectedFile || uploading}
                loading={uploading}
                style={[styles.button, { backgroundColor: selectedFile ? "#1E88E5" : "#ccc" }]}
            >
                {uploading ? "Enviando..." : "Enviar Arquivo"}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#3b5998",
    },
    button: {
        width: "80%",
        marginTop: 10,
    },
    fileName: {
        fontSize: 16,
        marginVertical: 10,
        color: "#333",
    },
});
