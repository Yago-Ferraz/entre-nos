import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../views/home/HomeScreen";
import ProdutoScreem from "../../views/home/produtos/viewproduto";
import Createproduto from "../../views/home/produtos/createproduto";
import {AuthStackParamList} from "../../Routes";
import FluxoCaixaScreen from "../../views/home/moeda/caixa";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PRODUTOSCREEM" component={ProdutoScreem} />
      <Stack.Screen name="CREATEPRODUTO" component={Createproduto} />
      <Stack.Screen name="CAIXA" component={FluxoCaixaScreen} />

    </Stack.Navigator>
  );
}
