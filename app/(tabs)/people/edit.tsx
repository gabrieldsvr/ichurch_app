import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@/api/peopleService';
import { router, useLocalSearchParams } from 'expo-router';

const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    instagram: yup.string().optional(),
    birth_date: yup.string().required('Data de Nascimento é obrigatória'), // Mantendo como string
    type: yup.string().oneOf(['visitor', 'regular_attendee', 'member']).required('Tipo de pessoa é obrigatório'),
    parentName: yup.string().optional(),
    parentPhone: yup.string().optional(),
}).required();

interface FormData {
    name: string;
    phone: string;
    instagram?: string;
    birth_date: string;
    type: 'visitor' | 'regular_attendee' | 'member';
    parentName?: string;
    parentPhone?: string;
}

export default function PeopleEditScreen() {
    const { id } = useLocalSearchParams();
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            phone: '',
            instagram: '',
            birth_date: new Date().toISOString(),
            type: 'visitor',
            parentName: '',
            parentPhone: '',
        },
    });

    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const birth_date = watch('birth_date');
    const birth_dateObj = new Date(birth_date);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/people/${id}`);
            const userData = response.data;

            setValue('name', userData.name);
            setValue('phone', userData.phone);
            setValue('instagram', userData.instagram || '');
            setValue('birth_date', userData.birth_date);
            setValue('type', userData.type);
            setValue('parentName', userData.parentName || '');
            setValue('parentPhone', userData.parentPhone || '');

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            Alert.alert('Erro', 'Falha ao carregar os dados do usuário.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const formattedData = {
                ...data,
                birth_date: new Date(data.birth_date).toISOString(),
            };

            await api.put(`/people/${id}`, formattedData);

            Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
            router.replace('/people'); // Redireciona para a lista de pessoas

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            Alert.alert('Erro', 'Falha ao atualizar os dados.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* Nome */}
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <TextInput label="Nome" value={value} onChangeText={onChange} mode="outlined" style={styles.input} error={!!errors.name} />
                )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

            {/* Telefone */}
            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                    <TextInput label="Telefone" value={value} onChangeText={onChange} mode="outlined" keyboardType="phone-pad" style={styles.input} error={!!errors.phone} />
                )}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

            {/* Instagram */}
            <Controller
                control={control}
                name="instagram"
                render={({ field: { onChange, value } }) => (
                    <TextInput label="Instagram" value={value} onChangeText={onChange} mode="outlined" style={styles.input} />
                )}
            />

            {/* Data de Nascimento */}
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.button}>
                {birth_date ? `Data de Nascimento: ${birth_dateObj.toLocaleDateString()}` : 'Selecionar Data de Nascimento'}
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={birth_dateObj}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setValue('birth_date', selectedDate.toISOString());
                    }}
                />
            )}
            {errors.birth_date && <Text style={styles.errorText}>{errors.birth_date.message}</Text>}

            {/* Tipo de Pessoa */}
            <Text style={styles.label}>Tipo de Pessoa:</Text>
            <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                    <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                        <Picker.Item label="Visitante" value="visitor" />
                        <Picker.Item label="Frequentador" value="regular_attendee" />
                        <Picker.Item label="Membro" value="member" />
                    </Picker>
                )}
            />
            {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}

            {/* Botão de Atualização */}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                Atualizar Usuário
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    label: {
        marginTop: 10,
        fontSize: 16,
    },
    picker: {
        marginTop: 10,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
});
