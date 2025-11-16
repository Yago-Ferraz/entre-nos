import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { styles } from './configsistemastyle'; // Importa os estilos

// Importações do Header: Reutilizando o header da ProfileScreen
// IMPORTANTE: Se você decidir mover o Header para um componente reutilizável, 
// o código abaixo seria simplificado. Por enquanto, mantemos o visual do header aqui.
import { useAuth } from '../../AuthContext'; 

export const AboutScreen = () => {
  const { user } = useAuth(); // Usado apenas para obter os dados do header

  const handleUpdateApp = () => {
    // Lógica para abrir a loja de aplicativos (Google Play/App Store)
    console.log("Iniciando processo de atualização do App.");
    alert("Redirecionando para a loja de aplicativos...");
  };

  // Se o usuário ainda não tiver sido carregado (embora improvável, pois esta é uma tela secundária)
  const userName = user?.name || 'Usuário';
  const userEmail = user?.email || 'N/A';

  return (
    <View style={styles.fullContainer}>
      <ScrollView style={styles.container}>
        {/* 1. SEÇÃO DO HEADER (Mantém o mesmo layout da ProfileScreen) */}
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
            source={{ uri: 'URL_DA_IMAGEM_DO_LOGO_SECUNDARIO' }}
            style={styles.secondaryLogo}
          />
        </View>

        {/* 2. CONTEÚDO PRINCIPAL: SOBRE O SISTEMA */}
        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>Sobre o Sistema</Text>
          
          <Text style={styles.contentText}>
            O Entre Nos é um aplicativo criado para fortalecer as comunidades locais, 
            conectando moradores de periferias a pequenos comércios e prestadores de 
            serviços da sua própria região. Nosso objetivo é impulsionar a economia 
            local, promover o pertencimento e facilitar o acesso a produtos e serviços 
            de forma simples, acessível e segura.
          </Text>

          <Text style={styles.contentTextHighlight}>
            Aqui, cada pessoa tem voz, cada negócio tem valor e cada conexão faz a 
            diferença para o crescimento da comunidade.
          </Text>

          <Text style={[styles.contentTextHighlight, styles.missionStatement]}>
            Entre Nos: fortalecendo laços, gerando oportunidades.
          </Text>

          {/* Imagem Ilustrativa */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'URL_DA_IMAGEM_DA_MOÇA' }} // Substitua pela URL da imagem da moça
              style={styles.illustrationImage}
            />
          </View>
        </View>
        
        {/* Espaço extra para scroll */}
        <View style={{ height: 20 }} /> 
      </ScrollView>

      {/* 3. BOTÃO FLUTUANTE (Bottom Button) */}
      <View style={styles.bottomButtonArea}>
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={handleUpdateApp}
        >
          <Text style={styles.updateButtonText}>Atualizar App</Text>
        </TouchableOpacity>
      </View>
      
      {/* 4. BARRA DE NAVEGAÇÃO INFERIOR */}
      {/* Você deve substituir esta View pela sua Navigation Bar customizada real */}
      <View style={styles.bottomNavPlaceholder} />
    </View>
  );
};
