import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {createUser} from '@/src/api/peopleService';
import {router} from 'expo-router';
import {useAppTheme} from '@/src/contexts/ThemeProvider';

const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    instagram: yup.string().optional(),
    birth_date: yup.string().required('Data de Nascimento é obrigatória'),
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

export default function PeopleInsertScreen() {
    const {theme} = useAppTheme();
    const {control, handleSubmit, watch, setValue, formState: {errors}} = useForm<FormData>({
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
            const formattedData = {...data, birth_date: new Date(data.birth_date).toISOString()};
            await createUser(formattedData);
            router.replace('/people');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            {/* Nome */}
            <Controller
                control={control}
                name="name"
                render={({field: {onChange, value}}) => (
                    <TextInput
                        label="Nome"
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        style={[styles.input, {backgroundColor: theme.colors.surface}]}
                        error={!!errors.name}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                )}
            />
            {errors.name && <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.name.message}</Text>}

            {/* Telefone */}
            <Controller
                control={control}
                name="phone"
                render={({field: {onChange, value}}) => (
                    <TextInput
                        label="Telefone"
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        keyboardType="phone-pad"
                        style={[styles.input, {backgroundColor: theme.colors.surface}]}
                        error={!!errors.phone}
                    />
                )}
            />
            {errors.phone &&
                <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.phone.message}</Text>}

            {/* Instagram */}
            <Controller
                control={control}
                name="instagram"
                render={({field: {onChange, value}}) => (
                    <TextInput
                        label="Instagram"
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        style={[styles.input, {backgroundColor: theme.colors.surface}]}
                    />
                )}
            />

            {/* Data de Nascimento */}
            <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={[styles.button, {backgroundColor: theme.colors.surface}]}
                textColor={theme.colors.onSurface}
            >
                {birth_date ? `Nascimento: ${birth_dateObj.toLocaleDateString()}` : 'Selecionar Data'}
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
            {errors.birth_date &&
                <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.birth_date.message}</Text>}

            {/* Responsável (Menores de Idade) */}
            {isMinor && (
                <>
                    <Controller
                        control={control}
                        name="parentName"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                label="Nome do Responsável"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={[styles.input, {backgroundColor: theme.colors.surface}]}
                                error={!!errors.parentName}
                            />
                        )}
                    />
                    {errors.parentName && <Text
                        style={[styles.errorText, {color: theme.colors.error}]}>{errors.parentName.message}</Text>}

                    <Controller
                        control={control}
                        name="parentPhone"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                label="Telefone do Responsável"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                keyboardType="phone-pad"
                                style={[styles.input, {backgroundColor: theme.colors.surface}]}
                                error={!!errors.parentPhone}
                            />
                        )}
                    />
                    {errors.parentPhone && <Text
                        style={[styles.errorText, {color: theme.colors.error}]}>{errors.parentPhone.message}</Text>}
                </>
            )}

            {/* Tipo de Pessoa */}
            <Text style={[styles.label, {color: theme.colors.onSurface}]}>Tipo de Pessoa:</Text>
            <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                    <View style={[styles.pickerContainer, { backgroundColor: theme.colors.surface }]}>
                        <Picker
                            selectedValue={value}
                            onValueChange={onChange}
                            mode="dropdown" // 🔥 Evita o modal branco no Android
                            style={styles.picker}
                            dropdownIconColor={theme.colors.onSurface} // 🔥 Ajusta a cor do ícone da seta
                        >
                            <Picker.Item label="Visitante" value="visitor" style={{ color: theme.colors.onSurface }} />
                            <Picker.Item label="Frequentador" value="regular_attendee" style={{ color: theme.colors.onSurface }} />
                            <Picker.Item label="Membro" value="member" style={{ color: theme.colors.onSurface }} />
                        </Picker>
                    </View>
                )}
            />


            {errors.type && <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.type.message}</Text>}

            {/* Botão de Cadastro */}
            <Button mode="contained" onPress={handleSubmit(onSubmit)}
                    style={[styles.button, {backgroundColor: theme.colors.primary}]}>
                Cadastrar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    input: {marginBottom: 10},
    button: {marginTop: 10},
    label: {marginTop: 10, fontSize: 16},
    pickerContainer: {
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 10,
    },
    picker: {
        color: "#BFC6DC", // 🔥 Define a cor do texto no Picker
    },
    errorText: {fontSize: 12, marginBottom: 5},
});
