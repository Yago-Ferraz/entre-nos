import React, { useState } from 'react'; // ⬅️ Adicionado: useState
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { CardItem } from '../../components/carditem/carditem'; // Importa o componente reutilizável
import { AccountsModal } from '../../components/trocaperfil/trocaperfil'; // ⬅️ Adicionado: Importa o modal
import { styles } from './configuracaostyles'; // Importa os estilos separados
// ⬇️ ATENÇÃO: Verifique e ajuste o caminho se AuthContext.tsx estiver em outro lugar!
import { useAuth } from '../../AuthContext'; 

export const ProfileScreen = () => {
  
  // ⬇️ Estado para controlar a visibilidade do modal de contas
  const [isModalVisible, setIsModalVisible] = useState(false); 

  // 🎯 PEGA OS DADOS REAIS E A FUNÇÃO DE LOGOUT DO CONTEXTO
  const { user, logout, setUser } = useAuth(); // ⬅️ Adicionado: setUser (necessário para trocar de conta)

  // Função para lidar com a seleção ou navegação no modal
  const handleSelectAccount = (selectedAccount: any) => { // 'any' temporário, use o tipo User real
    // 1. Lógica para trocar o usuário no contexto global
    // 2. Feche o modal
    setIsModalVisible(false);
    console.log("Conta selecionada:", selectedAccount.name);
    // Exemplo de troca de usuário: setUser(selectedAccount);
  };

  // Função para lidar com navegação e ações no modal (Criar, Sair)
  const handleNavigate = (action: string) => {
    setIsModalVisible(false); // Fecha o modal após a ação
    if (action === 'SairDaConta') {
      logout();
    } else {
      console.log(`Ação/Navegação: ${action}`);
      // navigation.navigate(action)
    }
  };


  const handlePress = (item: string) => {
    
    // ⬇️ AÇÃO PARA ABRIR O MODAL
    if (item === 'TrocarPerfil') {
      setIsModalVisible(true);
      return;
    }
    
    console.log(`Navegando ou Ação: ${item}`);
    
    // Se for 'Sair/Logout', chame a função de logout
    if (item === 'Sair') {
      logout();
    }
    // Aqui você adicionaria sua lógica de navegação (ex: navigation.navigate(item))
  };

  // ⚠️ TRATAMENTO DE CARREGAMENTO/AUSÊNCIA DO USUÁRIO
  // Isso garante que a tela não quebre se o usuário ainda estiver sendo carregado ou não existir
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2F9E44" />
        <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }
  
  // O componente renderiza apenas se 'user' tiver dados
  return (
    <ScrollView style={styles.container}>
      {/* 1. SEÇÃO DO HEADER/PERFIL */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          {/* Adicionei o Image novamente, era só um comentário antes */}
{/*           <Image
            // Usa 'user.profileImage' (se existir) ou uma URL padrão de fallback
            source={{ uri: user.profileImage || 'URL_PADRÃO_SE_VAZIO' }} 
            style={styles.profileImage}
          /> */}
          <View style={styles.userInfo}>
            {/* Usa o nome real do usuário, tratando possíveis campos diferentes (name, first_name) */}
            <Text style={styles.userName}>{user.name || 'Usuário'}</Text> 
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        <Image
          // Substitua pela URL da imagem do logo secundário (círculo colorido)
          source={{ uri: 'URL_DA_IMAGEM_DO_LOGO_SECUNDARIO' }}
          style={styles.secondaryLogo}
        />
      </View>

      {/* 2. SEÇÃO CONTA */}
      <Text style={styles.sectionTitle}>Conta</Text>
      <View style={styles.card}>
        <CardItem 
          title="Trocar Perfil"
          iconName="user" 
          onPress={() => handlePress('TrocarPerfil')} // ⬅️ Ação para abrir o modal
          iconLibrary="Feather"
        />
        <View style={styles.separator} />
        <CardItem 
          title="Configurações do Sistema"
          iconName="settings" 
          onPress={() => handlePress('ConfiguracoesSistema')} 
          iconLibrary="Feather"
        />
      </View>

      {/* 3. SEÇÃO AJUDA */}
      <Text style={styles.sectionTitle}>Ajuda</Text>
      <View style={styles.card}>
        <CardItem 
          title="Acessibilidade"
          iconName="wheelchair" 
          onPress={() => handlePress('Acessibilidade')} 
          iconLibrary="MaterialCommunityIcons" 
        />
        <View style={styles.separator} />
        <CardItem 
          title="Suporte"
          iconName="questioncircleo" 
          onPress={() => handlePress('Suporte')} 
          iconLibrary="AntDesign" 
        />
      </View>

      <View style={{ height: 50 }} />
      
      {/* ⬇️ COMPONENTE MODAL DE CONTAS */}
      <AccountsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        currentAccount={user} // Passa o usuário atual
        availableAccounts={[]} // Você precisará buscar e preencher esta lista
        onSelectAccount={handleSelectAccount}
        onNavigate={handleNavigate}
      />
    </ScrollView>
  );
};