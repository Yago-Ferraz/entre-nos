import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const OnboardingItem = ({ item }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image source={item.image} style={[styles.image, { width: width * 0.8 }]} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40, // Espaço para o header
  },
  image: {
    flex: 0.6, // Ajuste a proporção da imagem na tela
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 0.4,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: '800', // Bold
    fontSize: 24,
    marginBottom: 15,
    color: '#333', // Cor escura para o texto
    textAlign: 'center',
  },
  description: {
    fontWeight: '400', // Regular
    fontSize: 16,
    color: '#666', // Cor mais clara para a descrição
    textAlign: 'center',
    paddingHorizontal: 20, // Para quebrar a linha de forma elegante
  },
});

export default OnboardingItem;