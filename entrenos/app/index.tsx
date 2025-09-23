// index.tsx
import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa suas páginas
import ForgotPasswordScreen from './src/views/esqueciASenha/esqueciASenha';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="esqueciSenha">
        {/* Defina suas rotas */}
        <Stack.Screen name="esqueciSenha" component={ForgotPasswordScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
