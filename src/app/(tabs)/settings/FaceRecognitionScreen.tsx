import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button, Image } from "react-native";
import { CameraView, useCameraPermissions, CameraType, CameraCapturedPicture } from "expo-camera";

export default function FaceRecognitionScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("front");
    const cameraRef = useRef<CameraView | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [recognitionResult, setRecognitionResult] = useState<string | null>(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Precisamos de permissão para acessar a câmera</Text>
                <Button onPress={requestPermission} title="Conceder Permissão" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photoData: CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync();
                if (photoData?.uri) {
                    setPhoto(photoData.uri);
                    console.log("Foto capturada:", photoData.uri);

                    // Enviar para o backend
                    await sendToServer(photoData.uri);
                } else {
                    console.warn("Falha ao capturar a foto.");
                }
            } catch (error) {
                console.error("Erro ao tirar foto:", error);
            }
        }
    };

    const sendToServer = async (imageUri: string) => {
        const formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            name: "face.jpg",
            type: "image/jpeg",
        } as any);

        try {
            console.log(formData)
            const response = await fetch("localhost:3000/face-recognition/recognize", {
                method: "POST",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            const result = await response.json();
            console.log("Resultado:", result);
            setRecognitionResult(result.message);
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>Inverter Câmera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.text}>Tirar Foto</Text>
                </TouchableOpacity>
            </View>
            {photo && <Image source={{ uri: photo }} style={styles.preview} />}
            {recognitionResult && <Text style={styles.message}>{recognitionResult}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    message: {
        textAlign: "center",
        fontSize: 16,
        color: "black",
        marginBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    button: {
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 5,
    },
    text: {
        color: "#fff",
        fontSize: 16,
    },
    preview: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginTop: 10,
    },
});
