import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ForgotPasswordScreen from './app/src/views/esqueciASenha/esqueciASenha';
import Cadastro from './app/src/views/cadastro'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="esqueciSenha">
        <Stack.Screen
          name="esqueciSenha"
          component={Cadastro}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;