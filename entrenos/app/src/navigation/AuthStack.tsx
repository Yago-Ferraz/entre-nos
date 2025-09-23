import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "../views/esqueciASenha/esqueciASenha";
import { ROUTES } from "../../Routes";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.FORGOT_PASSWORD}>
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
 