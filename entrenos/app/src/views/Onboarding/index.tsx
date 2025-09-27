import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import OnboardingItem from '../../components/OnboardingItem';
import slides from '../../constants/onboardingSlides';
import { styles } from '../../styles/styles';

const OnboardingView = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const handleNextPress = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  const handleSkip = () => {
    handleFinishOnboarding();
  };

  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem('@viewedOnboarding', 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleBackPress = () => {
    if (currentIndex > 0) {
      slidesRef.current.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      <View style={styles.header}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={slides}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        ref={slidesRef}
        scrollEnabled={false}
        extraData={currentIndex}
      />

      <View style={styles.footer}>
        <Text style={styles.paginationText}>
          Passo {currentIndex + 1} de {slides.length}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNextPress}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Vamos Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingView;