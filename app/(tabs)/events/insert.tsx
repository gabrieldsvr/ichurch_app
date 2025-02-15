import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "@/api/peopleService";

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
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventForm>({
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
        try {
            await api.post("/events/", data);
            Alert.alert("Sucesso", "Evento cadastrado com sucesso!", [
                { text: "OK", onPress: () => router.push("/events") },
            ]);
        } catch (error) {
            console.error("Erro ao cadastrar evento:", error);
            Alert.alert("Erro", "Falha ao cadastrar evento. Tente novamente.");
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Cadastrar Evento</Text>

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
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

            {/* Data do Evento */}
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                📅 {new Date(eventDate).toLocaleDateString()}
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date(eventDate)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setValue("event_date", selectedDate.toISOString());
                    }}
                />
            )}
            {errors.event_date && <Text style={styles.errorText}>{errors.event_date.message}</Text>}

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
                    />
                )}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

            {/* Botão de Cadastro */}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                Cadastrar Evento
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        fontSize: 22,
        fontWeight: "bold",
        color: "#3b5998",
    },
    input: {
        marginBottom: 10,
    },
    dateButton: {
        marginBottom: 10,
        backgroundColor: "#E3F2FD",
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
