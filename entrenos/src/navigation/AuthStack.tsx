// em src/navigation/AuthStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../Routes"; // Suas constantes de rota

// Importe todas as telas de autenticação
import Cadastro from "../views/cadastro/cadastro";
import ForgotPasswordScreen from "../views/esqueciASenha/esqueciASenha";
import LoginScreen from '../views/login/LoginScreen'; // <-- 1. IMPORTAR SUA TELA
import { AuthStackParamList } from "../types/navigationTypes";
import CadastroEmpresa from "../views/cadastro/Cadastroloja";



const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    // 3. DEFINIR A TELA DE LOGIN COMO INICIAL --v
    <Stack.Navigator initialRouteName={ROUTES.LOGIN}> 
    
      {/* 2. REGISTRAR A TELA DE LOGIN AQUI --v */}
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} /> 
      
      {/* As outras telas continuam registradas */}
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.SIGN_UP} component={Cadastro} options={{ headerShown: false }}/>
      <Stack.Screen name={ROUTES.SING_UP_LOJA} component={CadastroEmpresa} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}