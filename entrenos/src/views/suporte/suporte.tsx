// src/views/Support/index.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SupportCardItem } from '../../components/suportcarditem/suportcarditem'; // Importa o novo componente
import { Feather } from '@expo/vector-icons';
import { styles } from './suportestyle'; // Importa os estilos

export const SupportScreen = ({ navigation }: any) => { // Incluí 'navigation' para navegação

  const handleAction = (destination: string) => {
    console.log(`Ação/Navegação: ${destination}`);
    // Ex: navigation.navigate(destination);
  };

  return (
    <View style={styles.fullContainer}>
      
      {/* 1. HEADER ESCURO (CABEÇALHO) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* 2. OPÇÕES DE SUPORTE */}
        <View style={styles.optionsGroup}>
          <SupportCardItem
            iconName="questioncircleo"
            title="FAQ"
            description="Veja se sua dúvida já foi respondida"
            onPress={() => handleAction('FAQScreen')}
            iconLibrary="AntDesign"
          />
          <SupportCardItem
            iconName="comment-text-multiple-outline"
            title="Contate seu suporte"
            description="Fale com alguém"
            onPress={() => handleAction('ChatSupportScreen')}
            iconLibrary="MaterialCommunityIcons"
          />
          <SupportCardItem
            iconName="star-outline"
            title="Faça avaliações"
            description="Deixe uma avaliação nos nossos perfis"
            onPress={() => handleAction('RatingsScreen')}
            iconLibrary="MaterialCommunityIcons"
          />
        </View>
        
        <View style={{ height: 20 }} /> 
      </ScrollView>

      {/* 3. BARRA DE NAVEGAÇÃO INFERIOR */}
      {/* Você deve substituir esta View pela sua Navigation Bar customizada real */}
      <View style={styles.bottomNavPlaceholder} />
    </View>
  );
};