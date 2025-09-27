import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import LoginView from '../views/login/login';
import OnboardingView from '../views/Onboarding';
import SplashScreen from '../views/splashScreen';

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  const [initialRoute, setInitialRoute] = useState<'Splash' | 'Onboarding' | 'Login' | null>(null);

  useEffect(() => {
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const viewed = await AsyncStorage.getItem('@viewedOnboarding');
      setInitialRoute(viewed === 'true' ? 'Login' : 'Onboarding');
    };
    setInitialRoute('Splash');
    prepare();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {initialRoute === 'Splash' && (
          <Stack.Screen name="Splash" component={SplashScreen} />
        )}
        {initialRoute !== 'Splash' && (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingView} />
            <Stack.Screen name="Login" component={LoginView} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;