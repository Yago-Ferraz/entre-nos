import { AuthProvider } from "./src/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { useFonts } from 'expo-font';


export default function App() {
   const [fontsLoaded] = useFonts({
      'JOST_REGULAR': require('./assets/fonts/Jost-Regular.ttf'),
      'JOST_MEDIUM': require('./assets/fonts/Jost-Medium.ttf'),
      'JOST_BOLD': require('./assets/fonts/Jost-Bold.ttf'),
      'JOST_SEMIBOLD': require('./assets/fonts/Jost-SemiBold.ttf'),
    });
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
