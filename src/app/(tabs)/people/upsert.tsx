import React, {useState} from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text as RNText,
    TouchableOpacity,
    View,
} from "react-native";
import {Avatar, Button, RadioButton, Text, TextInput, useTheme,} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import {useRouter} from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useTranslation} from "@/src/hook/useTranslation";
import {Controller, useForm} from "react-hook-form";
import {createUser} from "@/src/api/peopleService";

interface FormData {
    name: string;
    birthDate: string;
    email: string;
    phone: string;
    address: string;
    type: 'visitor' | 'regular_attendee' | 'member';
}

export default function RegisterMemberScreen() {
    const theme = useTheme();
    const router = useRouter();
    const {t} = useTranslation();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            birthDate: "",
            email: "",
            phone: "",
            address: "",
            type: "member",
        },
    });

    const birthDateValue = watch("birthDate");
    const birthDateObj = birthDateValue ? new Date(birthDateValue) : null;

    async function pickImage() {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert(t("permission_camera_required"));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    }

    function removeImage() {
        setImageUri(null);
    }

    function onChangeDate(event: any, selectedDate?: Date) {
        if (Platform.OS !== "ios") {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setValue("birthDate", selectedDate.toISOString().split("T")[0], {shouldValidate: true});
        }
    }


    async function onSave(data: FormData) {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const formData = new FormData();

            const sanitizedData: Record<string, string> = {
                name: data.name || "",
                phone: data.phone || "",
                birth_date: data.birthDate || "",  // transformando birthDate para birth_date aqui
                email: data.email || "",
                address: data.address || "",
                type: data.type || "member",
            };

            Object.entries(sanitizedData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (imageUri) {
                formData.append("photo", {
                    uri: imageUri,
                    type: "image/jpeg",
                    name: `profile-${Date.now()}.jpg`,
                } as any);
            }

            // Troque `id` por sua lógica para editar/novo
            if (false /* id */) {
                // await updateUser(id as string, formData);
            } else {
                await createUser(formData);
            }

            router.replace("/people");
        } catch (error) {
            console.error("Erro ao manipular usuário:", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                        {t("insert_new_member")}
                    </Text>
                </View>

                {/* Upload Button */}
                <Button
                    mode="outlined"
                    onPress={pickImage}
                    style={[styles.button, {backgroundColor: theme.colors.surface}]}
                    textColor={theme.colors.onSurface}
                >
                    {imageUri ? t("change_photo") : t("take_photo")}
                </Button>

                {/* Image Preview */}
                {imageUri ? (
                    <Image source={{uri: imageUri}} style={styles.imagePreview}/>
                ) : (
                    <Avatar.Icon size={120} icon="account" style={styles.imagePreview}/>
                )}


                <Text style={{marginBottom: 8, fontWeight: "bold", color: theme.colors.onBackground}}>
                    {t('type_member')}
                </Text>
                <Controller
                    control={control}
                    name="type"
                    render={({field: {onChange, value}}) => (
                        <RadioButton.Group onValueChange={onChange} value={value}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <RadioButton value="member"/>
                                    <Text>{t('member')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <RadioButton value="regular_attendee"/>
                                    <Text>{t('regular_attendee')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <RadioButton value="visitor"/>
                                    <Text>{t('visitor')}</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                    )}
                />

                {/* Full Name */}
                <Controller
                    control={control}
                    name="name"
                    rules={{required: t("requiredField")}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            label={t("full_name")}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                            mode="flat"
                            error={!!errors.name}
                        />
                    )}
                />
                {errors.name && (
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>
                        {errors.name.message}
                    </Text>
                )}

                {/* Date Picker */}
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.input, styles.dateInput]}
                    activeOpacity={0.7}
                >
                    <RNText
                        style={{
                            color: birthDateObj ? theme.colors.onBackground : theme.colors.outline,
                        }}
                    >
                        {birthDateObj ? birthDateObj.toLocaleDateString() : t("birth_date")}
                    </RNText>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={birthDateObj ?? new Date()}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={onChangeDate}
                    />
                )}
                {errors.birthDate && (
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>
                        {errors.birthDate.message}
                    </Text>
                )}

                {/* Email */}
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: t("requiredField"),
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t("invalidEmail"),
                        },
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            label={t("email")}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                            mode="flat"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={!!errors.email}
                        />
                    )}
                />
                {errors.email && (
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>
                        {errors.email.message}
                    </Text>
                )}

                {/* Phone */}
                <Controller
                    control={control}
                    name="phone"
                    rules={{required: t("requiredField")}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            label={t("phone")}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                            mode="flat"
                            keyboardType="phone-pad"
                            error={!!errors.phone}
                        />
                    )}
                />
                {errors.phone && (
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>
                        {errors.phone.message}
                    </Text>
                )}

                {/* Address */}
                <Controller
                    control={control}
                    name="address"
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            label={t("address")}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                            mode="flat"
                            multiline
                        />
                    )}
                />
            </ScrollView>


            {/* Buttons fixados no rodapé */}
            <View style={[styles.buttonRow, {backgroundColor: theme.colors.background}]}>
                <Button mode="contained" onPress={handleSubmit(onSave)} style={styles.saveButton} loading={isLoading}
                        disabled={isLoading}>
                    {t("register")}
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
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    input: {
        marginBottom: 16,
        backgroundColor: "transparent",
    },
    dateInput: {
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: "rgba(186,186,186,0.86)",
    },
    uploadSection: {
        marginBottom: 16,
    },
    uploadLabel: {
        fontWeight: "600",
        marginBottom: 8,
    },
    uploadButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: "#bbb",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginVertical: 10,
    },
    removeImageButton: {
        marginLeft: 8,
        marginTop: -8,
    },
    buttonRow: {
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
    },
    saveButton: {
        flex: 1,
        marginRight: 10,
    },
    errorText: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
});
