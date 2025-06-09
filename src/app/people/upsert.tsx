import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "@/src/hook/useTranslation";
import { Controller, useForm } from "react-hook-form";
import { createUser, getUserById, updateUser } from "@/src/api/peopleService";

interface FormData {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  type: "visitor" | "regular_attendee" | "member";
}

export default function RegisterMemberScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      try {
        if (!id) return;
        const response = await getUserById(id);
        const userData = response.data;

        setValue("name", userData.name);
        setValue("birthDate", userData.birth_date);
        setValue("email", userData.email);
        setValue("phone", userData.phone);
        setValue("address", userData.address);
        setValue("type", userData.type);

        if (userData.photo) {
          const photoUrl = `https://ichurch-storage.s3.us-east-1.amazonaws.com/${userData.photo}`;
          setImageUri(photoUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário para edição", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [id]);

  const birthDateValue = watch("birthDate");
  const birthDateObj = birthDateValue ? new Date(birthDateValue) : null;

  async function pickImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
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

  function onChangeDate(_: any, selectedDate?: Date) {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (selectedDate) {
      setValue("birthDate", selectedDate.toISOString().split("T")[0], {
        shouldValidate: true,
      });
    }
  }

  async function onSave(data: FormData) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const formData = new FormData();

      const sanitizedData: Record<string, string> = {
        name: data.name || "",
        birth_date: data.birthDate || "",
        email: data.email,
        phone: data.phone,
        address: data.address,
        type: data.type || "member",
      };

      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (imageUri) {
        formData.append("photo", {
          uri: imageUri,
          type: "image/jpeg",
          name: `profile-${Date.now()}.jpg`,
        } as any);
      }

      if (id) {
        await updateUser(id as string, formData);
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.flexContainer}>
          <ScrollView
            contentContainerStyle={[
              styles.container,
              { backgroundColor: theme.colors.background, paddingBottom: 100 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text
                style={[styles.title, { color: theme.colors.onBackground }]}
              >
                {id ? t("edit_member") : t("insert_new_member")}
              </Text>
            </View>

            <Button
              mode="outlined"
              onPress={pickImage}
              style={[styles.button, { backgroundColor: theme.colors.surface }]}
              textColor={theme.colors.onSurface}
            >
              {imageUri ? t("change_photo") : t("take_photo")}
            </Button>

            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Avatar.Icon
                size={120}
                icon="account"
                style={styles.imagePreview}
              />
            )}

            <Text style={styles.sectionLabel}>{t("type_member")}</Text>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <RadioButton.Group onValueChange={onChange} value={value}>
                  <View style={styles.radioGroup}>
                    <View style={styles.radioItem}>
                      <RadioButton value="member" />
                      <Text>{t("member")}</Text>
                    </View>
                    <View style={styles.radioItem}>
                      <RadioButton value="regular_attendee" />
                      <Text>{t("regular_attendee")}</Text>
                    </View>
                    <View style={styles.radioItem}>
                      <RadioButton value="visitor" />
                      <Text>{t("visitor")}</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              )}
            />

            {/* Reutilização dos campos de formulário */}
            {[
              {
                name: "name",
                label: t("full_name"),
                rules: { required: t("requiredField") },
              },
              {
                name: "email",
                label: t("email"),
                keyboardType: "email-address",
                rules: {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("invalidEmail"),
                  },
                },
              },
              {
                name: "phone",
                label: t("phone"),
                keyboardType: "phone-pad",
                rules: {
                  pattern: {
                    value: /^\+?[\d\s()-]{7,}$/,
                    message: t("invalidPhone"),
                  },
                },
              },
              { name: "address", label: t("address"), multiline: true },
            ].map(({ name, label, ...rest }) => (
              <Controller
                key={name}
                control={control}
                name={name as keyof FormData}
                rules={rest.rules}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={label}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                    mode="flat"
                    multiline={rest.multiline}
                    autoCapitalize="none"
                    error={!!errors[name as keyof FormData]}
                  />
                )}
              />
            ))}

            {errors.name && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.name.message}
              </Text>
            )}
            {errors.email && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.email.message}
              </Text>
            )}
            {errors.phone && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.phone.message}
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
                  color: birthDateObj
                    ? theme.colors.onBackground
                    : theme.colors.outline,
                }}
              >
                {birthDateObj
                  ? birthDateObj.toLocaleDateString()
                  : t("birth_date")}
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
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.birthDate.message}
              </Text>
            )}

            <View
              style={[
                styles.buttonRow,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Button
                mode="contained"
                onPress={handleSubmit(onSave)}
                style={styles.saveButton}
                loading={isLoading}
                disabled={isLoading}
              >
                {id ? t("update") : t("save")}
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonRow: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  saveButton: {
    flex: 1,
  },
  errorText: {
    marginBottom: 10,
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});
