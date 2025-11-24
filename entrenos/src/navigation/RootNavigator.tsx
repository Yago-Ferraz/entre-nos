import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { storageService } from "../services/storageService";
import { OnboardingScreen } from "../views/onboarding/OnboardingScreen";
import { SplashScreen } from "../views/splash/SplashScreen";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import Empresastack from "./empresaStack";

export default function RootNavigator() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const hasSeenOnboarding = await storageService.hasSeenOnboarding();
    setShowOnboarding(!hasSeenOnboarding);
  };

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleOnboardingFinish = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

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
