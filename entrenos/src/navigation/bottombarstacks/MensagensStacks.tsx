import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Certifique-se que o caminho de importação está correto para o seu projeto
import ChatListScreen from '../../views/chat/ChatListScreen';
import ChatDetailScreen from '../../views/chat/ChatDetailScreen';

const Stack = createNativeStackNavigator();

export default function MensagensStacks() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* A primeira tela é a Lista de Conversas */}
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      
      {/* A segunda tela é o Detalhe, que vai abrir por cima quando clicada */}
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
}