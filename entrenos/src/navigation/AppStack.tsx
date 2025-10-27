import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import HomeScreen from "../views/home/HomeScreen";
import HomeStack from "./bottombarstacks/HomeStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#ccc",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#00a86b",
        tabBarInactiveTintColor: "gray",
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

    </Tab.Navigator>
  );
}
