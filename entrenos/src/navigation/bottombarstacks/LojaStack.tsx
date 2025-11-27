import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LojaScreen from "../../views/loja/TelaLoja";
import ProductDetailScreen from "../../views/loja/TelaProduto";

const Stack = createNativeStackNavigator();

export default function Lojastack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TelaLoja" component={LojaScreen} />
      <Stack.Screen name="TelaProduto" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
