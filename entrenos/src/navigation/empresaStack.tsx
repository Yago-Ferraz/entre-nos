import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../Routes";
import CadastroEmpresa from "../views/cadastro/Cadastroloja"
import HomeScreen from "../views/home/HomeScreen";
const Stack = createNativeStackNavigator();

export default function Empresastack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.SING_UP_LOJA}>
         <Stack.Screen name={ROUTES.SING_UP_LOJA} component={CadastroEmpresa} options={{ headerShown: false }} />
         
    </Stack.Navigator>
  );
}
