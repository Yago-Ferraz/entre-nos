import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import Empresastack from "./empresaStack";

export default function RootNavigator() {
  const { user } = useAuth();

  if (user === undefined) return null; // Loading

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.empresa ? (
        <AppStack />
      ) : (
        <Empresastack />
      )}
    </NavigationContainer>
  );
}
