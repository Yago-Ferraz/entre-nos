import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import { storageService } from '../../services/storageService';
import { colors } from '../../styles/colors';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Bem-vindo(a) ao\nEntreNós',
    description: 'Aqui fortalecemos os laços comunidade e ajudamos a pequenas empreendedores e empresas a crescer',
    image: require('../../../assets/images/page1.png'),
  },
  {
    id: '2',
    title: 'Apoie o comércio\nda sua comunidade',
    description: 'Cada compra aqui gera impacto real',
    image: require('../../../assets/images/page2.png'),
  },
  {
    id: '3',
    title: 'Converse com\nclientes, e receba\npedidos',
    description: 'Crie laços de qualidade e confiança a partir da sua comunicação',
    image: require('../../../assets/images/page3.png'),
  },
  {
    id: '4',
    title: 'Ferramenta simples\ne intuitiva',
    description: 'Cadastre sua loja em minutos use a IA para organizar seu estoque e crie campanhas que vendem mais',
    image: require('../../../assets/images/page4.png'),
  },
  {
    id: '5',
    title: 'Vamos Começar?',
    description: 'Você pode ser consumidor ou empreendedor. Escolha como deseja participar.',
    image: require('../../../assets/images/page5.png'),
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await storageService.setHasSeenOnboarding(true);
    onFinish();
  };

  const handleSkip = async () => {
    await storageService.setHasSeenOnboarding(true);
    onFinish();
  };

  const renderItem = ({ item, index }: { item: OnboardingItem; index: number }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        {currentIndex > 0 && (
          <TouchableOpacity 
            onPress={() => slidesRef.current?.scrollToIndex({ index: currentIndex - 1 })}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={scrollTo}>
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Passo {currentIndex + 1} de {onboardingData.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: colors.onboardingGreen,
    zIndex: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    flex: 1,
    paddingTop: 100,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    maxHeight: 300,
  },
  textContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.onboardingNavy,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.onboardingGreen,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});
