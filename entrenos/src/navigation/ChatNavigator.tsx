import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../views/chat/ChatListScreen';
import ChatDetailScreen from '../views/chat/ChatDetailScreen';

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="ChatList"
      screenOptions={{ headerShown: false }} 
    >
      {/* Tela 1: A Lista de Conversas */}
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      
      {/* Tela 2: O Chat individual */}
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
}