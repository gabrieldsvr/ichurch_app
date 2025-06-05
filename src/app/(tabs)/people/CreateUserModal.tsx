import React, {useState} from "react";
import {Button, Modal, Text, TextInput} from "react-native-paper";
import api from "@/src/api/api";
import {logToDiscord} from "@/src/api/logService";
import {useLocalSearchParams} from "expo-router"; // substitua pelo seu serviço real

export default function CreateUserModal() {
    const {id, name} = useLocalSearchParams();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleCreateAccount = async () => {
        if (!email) return;

        setLoading(true);
        try {
            await api.post("/sca/users", {
                name,
                email,
                password: "adm123",
                is_master: false,
                person_id: id,
            });

            setSuccess(true);
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            await logToDiscord(`❌ Erro ao criar conta: ${error.message}`, "ERROR");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal visible contentContainerStyle={{margin: 20, backgroundColor: "white", padding: 20, borderRadius: 8}}>
            {success ? (
                <>
                    <Text>✅ Conta criada com sucesso! Senha padrão: <Text
                        style={{fontWeight: 'bold'}}>adm123</Text></Text>
                </>
            ) : (
                <>
                    <Text>Informe o e-mail da nova conta:</Text>
                    <TextInput
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{marginTop: 12}}
                    />
                    <Button mode="contained" onPress={handleCreateAccount} loading={loading} disabled={!email}
                            style={{marginTop: 16}}>
                        Criar conta
                    </Button>
                </>
            )}
        </Modal>
    );
}
