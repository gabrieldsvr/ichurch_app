import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Menu, Text, TextInput, useTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { createEvent, getEventById, updateEvent } from "@/src/api/eventService";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { EventTypeEnum } from "@/src/enum/EventTypeEnum";
import { eventTypeLabels } from "@/src/constants/eventTypeLabels";

type EventForm = {
  name: string;
  event_date: string;
  description: string;
  type: EventTypeEnum;
};

const schema = yup.object({
  name: yup.string().required("O nome do evento é obrigatório"),
  event_date: yup.string().required("A data do evento é obrigatória"),
  description: yup.string().required("A descrição do evento é obrigatória"),
  type: yup
    .mixed<EventTypeEnum>()
    .oneOf(Object.values(EventTypeEnum), "Tipo inválido")
    .required("Selecione o tipo de evento"),
});

export default function EventUpsertScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const isEditing = !!eventId && eventId !== "insert";

  const theme = useTheme();
  const { currentMinistry } = useMinistry();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Editar Evento" : "Cadastrar Evento",
    });
  }, [isEditing, navigation]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      event_date: new Date().toISOString(),
      description: "",
      type: EventTypeEnum.CULT,
    },
  });

  const eventDate = watch("event_date");
  const eventType = watch("type");

  useEffect(() => {
    async function loadEvent() {
      if (!isEditing || !eventId) return;

      try {
        setLoading(true);
        const event = await getEventById(eventId);

        setValue("name", event.name);
        setValue("event_date", new Date(event.eventDate).toISOString());
        setValue("description", event.description || "");
        setValue("type", event.type as EventTypeEnum);
      } catch (error) {
        console.error("Erro ao carregar evento", error);
        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId, isEditing, setValue]);

  const onSubmit = async (formData: EventForm) => {
    if (!currentMinistry?.id || loading) return;

    const data = {
      ...formData,
      ministry_id: currentMinistry.id,
    };

    try {
      setLoading(true);
      if (isEditing && eventId) {
        await updateEvent(eventId, data);
      } else {
        await createEvent(data);
      }
      router.replace("/events");
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    } finally {
      setLoading(false);
    }
  };

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
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Nome do Evento */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Nome do Evento"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.name.message}
              </Text>
            )}

            {/* Tipo do Evento */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.input}
                  textColor={theme.colors.onSurface}
                >
                  {eventTypeLabels[eventType] ?? "Tipo do Evento"}
                </Button>
              }
            >
              {Object.entries(eventTypeLabels).map(([key, label]) => (
                <Menu.Item
                  key={key}
                  onPress={() => {
                    setValue("type", key as EventTypeEnum);
                    setMenuVisible(false);
                  }}
                  title={label}
                />
              ))}
            </Menu>
            {errors.type && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.type.message}
              </Text>
            )}

            {/* Data do Evento */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.input, styles.dateInput]}
            >
              <RNText style={{ color: theme.colors.onBackground }}>
                📅 {new Date(eventDate).toLocaleDateString("pt-BR")}
              </RNText>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(eventDate)}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setValue("event_date", selectedDate.toISOString());
                  }
                }}
              />
            )}
            {errors.event_date && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.event_date.message}
              </Text>
            )}

            {/* Descrição */}
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Descrição"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                  error={!!errors.description}
                />
              )}
            />
            {errors.description && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.description.message}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {isEditing ? "Atualizar Evento" : "Cadastrar Evento"}
            </Button>
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
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  dateInput: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "rgba(186,186,186,0.86)",
    justifyContent: "center",
  },
  button: {
    marginTop: 24,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
});
