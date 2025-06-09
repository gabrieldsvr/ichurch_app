import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { createEvent } from "@/src/api/eventService";
import { router } from "expo-router";

interface EventForm {
  name: string;
  event_date: string;
  description: string;
}

const schema = yup.object({
  name: yup.string().required("O nome do evento é obrigatório"),
  event_date: yup.string().required("A data do evento é obrigatória"),
  description: yup.string().required("A descrição do evento é obrigatória"),
});

export default function EventInsertScreen() {
  const theme = useTheme(); // 🔥 Obtém o tema atual
  const { currentMinistry } = useMinistry();
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
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const eventDate = watch("event_date");

  const onSubmit = async (data: EventForm) => {
    if (!currentMinistry?.id) return;

    const eventDTOPromise = await createEvent({
      ...data,
      ministry_id: currentMinistry.id,
    });
    if (eventDTOPromise) {
      Alert.alert("Sucesso", "Evento cadastrado com sucesso!", [
        { text: "OK", onPress: () => router.push("/events") },
      ]);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      {/* Data do Evento */}
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
        textColor={theme.colors.onSurface}
      >
        📅 {new Date(eventDate).toLocaleDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(eventDate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate)
              setValue("event_date", selectedDate.toISOString());
          }}
        />
      )}
      {errors.event_date && (
        <Text style={styles.errorText}>{errors.event_date.message}</Text>
      )}

      {/* Descrição do Evento */}
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
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description.message}</Text>
      )}

      {/* Botão de Cadastro */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        textColor={theme.colors.onPrimary}
      >
        Cadastrar Evento
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
  },
  dateButton: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
});
