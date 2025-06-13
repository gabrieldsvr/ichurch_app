import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AnimatedFAB,
  SegmentedButtons,
  TextInput,
  useTheme,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AvatarWithCamera } from "@/src/component/AvatarWithCamera";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router, useLocalSearchParams } from "expo-router";
import { createUser, getUserById, updateUser } from "@/src/api/peopleService";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .email("E-mail inválido"),
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  address: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export default function RegisterMemberScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [type, setType] = useState("member");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isExtended, setIsExtended] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: null,
      phone: null,
      address: null,
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setBirthDate(selectedDate);
  };

  const formatPhone = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    const [, ddd, first, second] = match;
    if (second) return `(${ddd}) ${first}-${second}`;
    if (first) return `(${ddd}) ${first}`;
    if (ddd) return `(${ddd}`;
    return "";
  };

  async function onSubmit(data: any) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const formData = new FormData();

      const sanitizedData: Record<string, string> = {
        name: data.name || "",
        birth_date: birthDate ? birthDate.toISOString().split("T")[0] : "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        type: type || "member",
      };

      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (imageUri && !imageUri.startsWith("http")) {
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
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const user = await getUserById(id as string);
        console.log(user);
        reset({
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
        });
        setType(user.type || "member");
        if (user.birthDate) {
          const [year, month, day] = user.birthDate
            .toString()
            .split("-")
            .map(Number);
          setBirthDate(new Date(year, month - 1, day, 12));
        }

        if (user.photo)
          setImageUri(
            `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user.photo}`,
          );
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    })();
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) =>
          setIsExtended(event.nativeEvent.contentOffset.y <= 0)
        }
        scrollEventThrottle={16}
      >
        <AvatarWithCamera imageUri={imageUri} onPressCamera={pickImage} />

        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={[
            {
              value: "member",
              label: "Membro",
              style: { borderColor: theme.colors.primary },
              checkedColor: theme.colors.onPrimary,
            },
            {
              value: "regular_attendee",
              label: "Frequente",
              style: { borderColor: theme.colors.primary },
              checkedColor: theme.colors.onPrimary,
            },
            {
              value: "visitor",
              label: "Visitante",
              style: { borderColor: theme.colors.primary },
              checkedColor: theme.colors.onPrimary,
            },
          ]}
          style={[styles.segmented]}
        />

        {/* Nome */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Nome completo*"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.name}
              />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.name?.message || " "}
              </Text>
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="E-mail"
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                error={!!errors.email}
              />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.email?.message || " "}
              </Text>
            </View>
          )}
        />

        {/* Telefone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Telefone"
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                onBlur={onBlur}
                value={formatPhone(value || "")}
                onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                error={!!errors.phone}
              />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.phone?.message || " "}
              </Text>
            </View>
          )}
        />

        {/* Endereço */}
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Endereço"
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                error={!!errors.address}
              />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.address?.message || " "}
              </Text>
            </View>
          )}
        />

        {/* Data de nascimento */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          accessibilityRole="button"
        >
          <TextInput
            label="Data de nascimento"
            value={birthDate ? birthDate.toLocaleDateString() : ""}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
      </KeyboardAwareScrollView>

      <AnimatedFAB
        icon="check"
        label="Salvar"
        extended={isExtended}
        onPress={handleSubmit(onSubmit)}
        style={[
          styles.fab,
          {
            right: 16,
            bottom: insets.bottom + 16,
            backgroundColor: theme.colors.primary,
          },
        ]}
        color={theme.colors.onPrimary}
        animateFrom="right"
        iconMode="dynamic"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  segmented: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
  },
  fab: {
    position: "absolute",
  },
});
