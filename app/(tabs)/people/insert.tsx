import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUser } from '@/api/peopleService';
import { router } from 'expo-router';

const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    instagram: yup.string().optional(),
    birth_date: yup.string().required('Data de Nascimento é obrigatória'), // Agora sempre será string
    type: yup.string().oneOf(['visitor', 'regular_attendee', 'member']).required('Tipo de pessoa é obrigatório'),
    parentName: yup.string().optional(),
    parentPhone: yup.string().optional(),
}).required();

interface FormData {
    name: string;
    phone: string;
    instagram?: string;
    birth_date: string; // Agora birth_date é sempre string
    type: 'visitor' | 'regular_attendee' | 'member';
    parentName?: string;
    parentPhone?: string;
}

export default function PeopleInsertScreen() {
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
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

    const [showDatePicker, setShowDatePicker] = useState(false);
    const birth_date = watch('birth_date');
    const birth_dateObj = new Date(birth_date);

    const isMinor = new Date().getFullYear() - birth_dateObj.getFullYear() < 18;

    const onSubmit = async (data: FormData) => {
        try {
            const formattedData = {
                ...data,
                birth_date: new Date(data.birth_date).toISOString(),
            };
            await createUser(formattedData);

            router.replace('/people');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Cadastro</Text>

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
                    <TextInput label="Telefone" value={value} onChangeText={onChange} mode="outlined"
                               keyboardType="phone-pad" style={styles.input} error={!!errors.phone} />
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
                        if (selectedDate) setValue('birth_date', selectedDate.toISOString()); // Sempre armazenamos string
                    }}
                />
            )}
            {errors.birth_date && <Text style={styles.errorText}>{errors.birth_date.message}</Text>}

            {/* Campos para menores de idade */}
            {isMinor && (
                <>
                    <Controller
                        control={control}
                        name="parentName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput label="Nome do Responsável" value={value} onChangeText={onChange} mode="outlined"
                                       style={styles.input} error={!!errors.parentName} />
                        )}
                    />
                    {errors.parentName && <Text style={styles.errorText}>{errors.parentName.message}</Text>}

                    <Controller
                        control={control}
                        name="parentPhone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput label="Telefone do Responsável" value={value} onChangeText={onChange} mode="outlined"
                                       keyboardType="phone-pad" style={styles.input} error={!!errors.parentPhone} />
                        )}
                    />
                    {errors.parentPhone && <Text style={styles.errorText}>{errors.parentPhone.message}</Text>}
                </>
            )}

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

            {/* Botão de Cadastro */}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                Cadastrar
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
});
