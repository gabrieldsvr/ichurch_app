import {Stack} from "expo-router";
import {Button} from "react-native-paper";

export default function PeopleLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{title: "Pessoas"}}/>
            <Stack.Screen name="insert" options={{title: "Adicionar Pessoa"}}/>
            <Stack.Screen name="edit" options={{title: "Editar Pessoas"}}/>
            <Stack.Screen name="upload" options={{ title: "Importar Pessoas" }} />
        </Stack>
    );
}
