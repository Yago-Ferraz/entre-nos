import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../AuthContext"; // ajuste o caminho real
import AuthStack from "../navigation/AuthStack";
import AppStack from "../navigation/AppStack";

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
