import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import HomeStack from "./bottombarstacks/HomeStack";
import LojaStack from "./bottombarstacks/LojaStack";
import MensagensStacks from "./bottombarstacks/MensagensStacks";
import SettingsStack from "./bottombarstacks/SettingsStack";

import { cor_primaria, cor_secundaria,cor_terciaria, cor_backgroud} from "../global";

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
        },
        tabBarActiveTintColor: cor_secundaria,
        tabBarInactiveTintColor: cor_backgroud,
        tabBarIcon: ({ color, size }) => {
          // render direto no JSX
          if (route.name === "Home") {
            return <Ionicons name="home" size={size} color={color} />;
          }
          if (route.name === "Loja") {
            return <MaterialCommunityIcons name="shopping-outline" size={size} color={color} />;
          }
          if (route.name === "Mensagens") {
            return <FontAwesome name="comments-o" size={size} color={color} />;
          }
          // Configurações
          return <Ionicons name="settings-outline" size={size} color={color} />;
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
