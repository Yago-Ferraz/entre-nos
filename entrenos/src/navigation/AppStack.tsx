import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../Routes";
import ForgotPasswordScreen from "../views/esqueciASenha/esqueciASenha";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
