import React, {useState} from "react";
import {Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Dimensions} from "react-native";
import {Button, Text, TextInput, useTheme,} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {useRouter} from "expo-router";
import i18n from "@/src/i18n";
import {useTranslation} from "@/src/hook/useTranslation";
export default function RegisterMemberScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { t } = useTranslation();

    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [ministries, setMinistries] = useState("");
    const [baptismDate, setBaptismDate] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permissão para acessar fotos é necessária!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!pickerResult.cancelled) {
            setProfileImage(pickerResult.uri);
        }
    };

    const onSave = () => {
        // Aqui você faz a validação e chama sua API para salvar
        alert("Salvar Membro: " + fullName);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.flexContainer}
        >
            <ScrollView
                contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, {color: theme.colors.onBackground}]}>
                        {t('insert_new_member')}
                    </Text>
                </View>

                {/* Form */}
                <TextInput
                    label={t('full_name')}
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    mode="flat"
                />

                <TextInput
                    label={t("birth_date")}
                    placeholder="YYYY-MM-DD"
                    value={birthDate}
                    onChangeText={setBirthDate}
                    style={styles.input}
                    mode="flat"
                    keyboardType="numeric"
                />

                <TextInput
                    label={t("email")}
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="flat"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    label={t("phone")}
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    mode="flat"
                    keyboardType="phone-pad"
                />

                <TextInput
                    label={t("address")}
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                    mode="flat"
                    multiline
                />

                {/* Profile Picture Upload */}
                <View style={styles.uploadSection}>
                    <Text style={[styles.uploadLabel, {color: theme.colors.onBackground}]}>
                        {t('upload_profile_picture')}
                    </Text>
                    <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                        {profileImage ? (
                            <Image source={{uri: profileImage}} style={styles.profileImage}/>
                        ) : (
                            <Text style={{color: theme.colors.primary}}>{t('choose_photo')}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Espaço inferior para não ficar atrás dos botões */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Buttons fixados no rodapé */}
            <View style={[styles.buttonRow, {backgroundColor: theme.colors.background}]}>
                <Button mode="contained" onPress={onSave} style={styles.saveButton}>
                    {t('register')}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 24,
        // paddingBottom removido, pois agora colocamos View de espaçamento
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        justifyContent: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    input: {
        marginBottom: 16,
        backgroundColor: "transparent",
    },
    uploadSection: {
        marginBottom: 16,
    },
    uploadLabel: {
        fontWeight: "600",
        marginBottom: 8,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: "#bbb",
        paddingVertical: 20,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
    },
    buttonRow: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    saveButton: {
        flex: 1,
        marginRight: 10,
    },
});
