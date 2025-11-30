import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "../../views/configuracao/configuracao";
import { AboutScreen } from "../../views/configsistema/configsistema";
import { AccessibilityScreen } from "../../views/acessibilidade/acessibilidade";
import { SupportScreen } from "../../views/suporte/suporte";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ConfiguracoesSistema" component={AboutScreen} />
      <Stack.Screen name="Acessibilidade" component={AccessibilityScreen} />
      <Stack.Screen name="Suporte" component={SupportScreen} />
    </Stack.Navigator>
  );
}
