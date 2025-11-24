import React from "react";
import { Platform } from "react-native"; // <--- Importante: Importar Platform
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

// Seus Stacks
import HomeStack from "./bottombarstacks/HomeStack";
import LojaStack from "./bottombarstacks/LojaStack";
import MensagensStacks from "./bottombarstacks/MensagensStacks"; 
import SettingsStack from "./bottombarstacks/SettingsStack";

import { cor_primaria, cor_secundaria, cor_backgroud } from "../global";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cor_primaria,
          borderTopColor: cor_backgroud,
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 70 : 85, 
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          paddingTop: 8, 
          // -----------------------------
        },
        tabBarActiveTintColor: cor_secundaria,
        tabBarInactiveTintColor: cor_backgroud,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Ionicons name="home" size={size} color={color} />;
          }
          if (route.name === "Loja") {
            return <MaterialCommunityIcons name="basket" size={size} color={color} />;
          }
          if (route.name === "Mensagens") {
            return <FontAwesome name="comment" size={size} color={color} />;
          }
          return <Ionicons name="settings" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Loja" component={LojaStack} />
      <Tab.Screen name="Mensagens" component={MensagensStacks} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}