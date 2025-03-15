import React, {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput,Avatar} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {createUser, updateUser} from '@/src/api/peopleService';
import {router, useLocalSearchParams} from 'expo-router';
import {useAppTheme} from '@/src/contexts/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';
import api from "@/src/api/api";

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
    const {id} = useLocalSearchParams();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userData, setUserData] = useState<any>(null); // 🔥 Estado para armazenar os dados do usuário

    const birth_date = watch('birth_date');
    const birth_dateObj = new Date(birth_date);
    // const isMinor = new Date().getFullYear() - birth_dateObj.getFullYear() < 18;

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const response = await api.get(`community/people/${id}`);
            const data = response.data;
            setUserData(data);
            setValue('name', data.name);
            setValue('phone', data.phone);
            // setValue('instagram', userData.instagram || '');
            setValue('birth_date', data.birth_date);
            setValue('type', data.type);
            // setValue('parentName', userData.parentName || '');
            // setValue('parentPhone', userData.parentPhone || '');

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            Alert.alert('Erro', 'Falha ao carregar os dados do usuário.');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (isLoading) return;
            console.log(isLoading)

            setIsLoading(true);
            const formData = new FormData();
            const sanitizedData: Record<string, string> = {
                name: data.name || "",
                phone: data.phone || "",
                // instagram: data.instagram || "",
                birth_date: data.birth_date || "",
                type: data.type || "",
                // parentName: data.parentName || "",
                // parentPhone: data.parentPhone || "",
            };

            Object.entries(sanitizedData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (imageUri) {
                formData.append("photo", {
                    uri: imageUri,
                    type: "image/jpeg",
                    name: `profile-${Date.now()}.jpg`
                } as any);
            }

            console.log(formData)
            if (id) {
                await updateUser(id as string, formData);
            } else {
                await createUser(formData);
            }

            router.replace('/people');
        } catch (error) {
            console.error('Erro ao manipular usuário:', error);
            setIsLoading(false);
        }
    };
    const pickImage = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Precisamos de permissão para acessar a câmera e galeria.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'], // 🔥 Corrigido: Usa MediaTypeOptions.Images corretamente
            allowsEditing: true,
            quality: 0.6,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri); // Atualiza a URI da imagem no estado
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
                {/* Captura de Foto */}
                <Button mode="outlined" onPress={pickImage}
                        style={[styles.button, {backgroundColor: theme.colors.surface}]}
                        textColor={theme.colors.onSurface}>
                    {imageUri || userData?.photo ? "Alterar Foto" : "Tirar Foto"}
                </Button>

                {imageUri ? (
                    <Image source={{uri: imageUri}} style={styles.imagePreview}/>
                ) : userData?.photo ? (
                    <Image source={{uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${userData.photo}`}}
                           style={styles.imagePreview}/>
                ) : (
                    <Avatar.Icon size={120} icon="account" style={styles.imagePreview}/>
                )}

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
                {errors.name &&
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.name.message}</Text>}

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
                {/*<Controller*/}
                {/*    control={control}*/}
                {/*    name="instagram"*/}
                {/*    render={({field: {onChange, value}}) => (*/}
                {/*        <TextInput*/}
                {/*            label="Instagram"*/}
                {/*            value={value}*/}
                {/*            onChangeText={onChange}*/}
                {/*            mode="outlined"*/}
                {/*            style={[styles.input, {backgroundColor: theme.colors.surface}]}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}

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
                            if (selectedDate) {
                                // 🔥 Converte para YYYY-MM-DD no fuso horário local antes de salvar
                                const localDate = selectedDate.toISOString().split("T")[0];
                                setValue("birth_date", localDate);
                            }
                        }}
                    />
                )}
                {errors.birth_date &&
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.birth_date.message}</Text>}

                {/* Responsável (Menores de Idade) */}
                {/*{isMinor && (*/}
                {/*    <>*/}
                {/*        <Controller*/}
                {/*            control={control}*/}
                {/*            name="parentName"*/}
                {/*            render={({field: {onChange, value}}) => (*/}
                {/*                <TextInput*/}
                {/*                    label="Nome do Responsável"*/}
                {/*                    value={value}*/}
                {/*                    onChangeText={onChange}*/}
                {/*                    mode="outlined"*/}
                {/*                    style={[styles.input, {backgroundColor: theme.colors.surface}]}*/}
                {/*                    error={!!errors.parentName}*/}
                {/*                />*/}
                {/*            )}*/}
                {/*        />*/}
                {/*        {errors.parentName && <Text*/}
                {/*            style={[styles.errorText, {color: theme.colors.error}]}>{errors.parentName.message}</Text>}*/}

                {/*        <Controller*/}
                {/*            control={control}*/}
                {/*            name="parentPhone"*/}
                {/*            render={({field: {onChange, value}}) => (*/}
                {/*                <TextInput*/}
                {/*                    label="Telefone do Responsável"*/}
                {/*                    value={value}*/}
                {/*                    onChangeText={onChange}*/}
                {/*                    mode="outlined"*/}
                {/*                    keyboardType="phone-pad"*/}
                {/*                    style={[styles.input, {backgroundColor: theme.colors.surface}]}*/}
                {/*                    error={!!errors.parentPhone}*/}
                {/*                />*/}
                {/*            )}*/}
                {/*        />*/}
                {/*        {errors.parentPhone && <Text*/}
                {/*            style={[styles.errorText, {color: theme.colors.error}]}>{errors.parentPhone.message}</Text>}*/}
                {/*    </>*/}
                {/*)}*/}

                {/* Tipo de Pessoa */}
                <Text style={[styles.label, {color: theme.colors.onSurface}]}>Tipo de Pessoa:</Text>
                <Controller
                    control={control}
                    name="type"
                    render={({field: {onChange, value}}) => (
                        <View style={[styles.pickerContainer, {backgroundColor: theme.colors.surface}]}>
                            <Picker
                                selectedValue={value}
                                onValueChange={onChange}
                                mode="dropdown" // 🔥 Evita o modal branco no Android
                                style={styles.picker}
                                dropdownIconColor={theme.colors.onSurface} // 🔥 Ajusta a cor do ícone da seta
                            >
                                <Picker.Item label="Visitante" value="visitor" style={{color: theme.colors.onSurface}}/>
                                <Picker.Item label="Frequentador" value="regular_attendee"
                                             style={{color: theme.colors.onSurface}}/>
                                <Picker.Item label="Membro" value="member" style={{color: theme.colors.onSurface}}/>
                            </Picker>
                        </View>
                    )}
                />


                {errors.type &&
                    <Text style={[styles.errorText, {color: theme.colors.error}]}>{errors.type.message}</Text>}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    style={[styles.button, {backgroundColor: theme.colors.primary}]}
                >
                    {isLoading ? "Salvando..." : id ? "Salvar Alterações" : "Cadastrar"}
                </Button>
            </View>
        </ScrollView>
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
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginVertical: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    errorText: {fontSize: 12, marginBottom: 5},
});
