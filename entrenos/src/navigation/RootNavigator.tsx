import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

export default function RootNavigator() {
  const { user } = useAuth();
  console.log("user no RootNavigator:", user); // deve ser null

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
