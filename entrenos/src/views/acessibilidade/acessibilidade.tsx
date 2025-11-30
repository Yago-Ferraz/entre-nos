// src/views/Accessibility/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet,Image } from 'react-native';
import { CardItem } from '../../components/carditem/carditem'; // Importa item de navegação
import { SettingsToggle } from '../../components/acessibilidade/acessibilidade'; // Importa item com switch
import { styles } from './acessibilidadestyle'; // Importa os estilos
import Header from '../../components/header/header';
import { useAuth } from '../../AuthContext'; 
import {baseurl} from '../../services/api';





export const AccessibilityScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const userName = user?.name || 'Usuário';
  const userEmail = user?.email || 'N/A';
  const imageUri =`${baseurl}${user?.empresa?.logo}` || 'URL_DA_IMAGEM_DO_LOGO_PRINCIPAL';
  

  // Estados locais para os Toggles
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDaltonicMode, setIsDaltonicMode] = useState(false);

  const handleUpdateSetting = (setting: string) => {
    console.log(`Navegando/Ação: ${setting}`);
    // Exemplo: navigation.navigate('FontSizeSettings');
  };

  return (
    <View style={{flex: 1}}>
        <Header title="Acessibilidade" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <ScrollView style={styles.container}>

          <View style={styles.header}>
        <View style={styles.profileInfo}>
          {/* <Image
            source={{ uri: user?.profileImage || 'URL_PADRÃO_SE_VAZIO' }}
            style={styles.profileImage}
          /> */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>
        <Image
          source={imageUri ? { uri: imageUri } :{ uri: 'sem imagem' }}
          style={styles.secondaryLogo}
        />
      </View>
        {/* 2. CONTEÚDO PRINCIPAL: ACESSIBILIDADE */}
        <Text style={styles.sectionTitle}>Acessibilidade</Text>
        
        <View style={styles.card}>
            {/* Item 1: Modo Escuro (Toggle) */}
            <SettingsToggle
            title="Modo Escuro"
            iconName="sun-o" // Usando FontAwesome (ou ajuste para Feather/MC)
            iconLibrary="MaterialCommunityIcons" // Ou Feather, dependendo do seu icon set
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            />
            <View style={styles.separator} />
            
            {/* Item 2: Modo Daltônico (Toggle) */}
            <SettingsToggle
            title="Modo daltônico"
            iconName="eye-off-outline" // Ícone comum para acessibilidade/visão
            iconLibrary="MaterialCommunityIcons"
            value={isDaltonicMode}
            onValueChange={setIsDaltonicMode}
            />
            <View style={styles.separator} />

            {/* Item 3: Tamanho da Fonte (Navegação) */}
            <CardItem 
            title="Tamanho da fonte"
            iconName="format-size" // Ícone para texto/tamanho
            onPress={() => handleUpdateSetting('TamanhoDaFonte')} 
            iconLibrary="MaterialCommunityIcons" 
            />
        </View>
        
        <View style={{ height: 50 }} />
        </ScrollView>
    </View>
  );
};