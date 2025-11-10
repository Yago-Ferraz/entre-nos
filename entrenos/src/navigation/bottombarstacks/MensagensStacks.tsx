import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../views/home/HomeScreen";
import ProdutoScreem from "../../views/home/produtos/viewproduto";
import Createproduto from "../../views/home/produtos/createproduto";

const Stack = createNativeStackNavigator();

export default function Mensagensstacks() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProdutoScreem" component={ProdutoScreem} />
      <Stack.Screen name="Createproduto" component={Createproduto} />

    </Stack.Navigator>
  );
}
