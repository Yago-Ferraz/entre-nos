import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../Routes";
import Cadastro from "../views/cadastro/cadastro";
import ForgotPasswordScreen from "../views/esqueciASenha/esqueciASenha";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.SIGN_UP}>
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.SIGN_UP} component={Cadastro} />
    </Stack.Navigator>
  );
}
 