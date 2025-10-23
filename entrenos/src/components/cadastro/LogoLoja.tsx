import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importa o seletor de imagens
import { StepProps } from '../../types/cadastro/cadastro';
import { typography, cinza, cor_primaria, FONT_SIZE, cor_backgroud } from '../../global';
import Buttongeneric from '../../components/buttons/buttongeneric';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const LogoLoja: React.FC<StepProps> = ({ formData, setFormData, onNext, onDecline }) => {

  const logoUri = formData.logo; 

  // Função para abrir a galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: false, // Apenas UMA imagem
      quality: 1,
      allowsEditing: true, // Permite cortar
      aspect: [1, 1], // Corte quadrado
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData({ ...formData, logo: result.assets[0].uri });
    }
  };

  // Função para remover a logo
  const handleRemoveLogo = () => {
    Alert.alert("Remover Logo", "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => setFormData({ ...formData, logo: '' }), 
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      
      <Text style={[typography.h1, styles.titulo]}>
        Agora, insira a logo!
      </Text>

      {/* --- ÁREA DE VISUALIZAÇÃO --- */}
      {logoUri ? (
        // Se TEM logo, mostra a logo (clicável para alterar)
        <View style={styles.logoDisplayContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.logoContainer}>
              <Image source={{ uri: logoUri }} style={styles.logoPreview} />
          </TouchableOpacity>
          {/* Adiciona um botão de texto "Remover" */}
          <TouchableOpacity onPress={handleRemoveLogo} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remover Logo</Text>
          </TouchableOpacity>
        </View>

      ) : (
        // Se NÃO TEM logo, mostra a caixa pontilhada (clicável para inserir)
        <TouchableOpacity onPress={pickImage} style={styles.ilustracaoContainer}>
          <Image
            source={require('../../../assets/images/Rectangle 320.png')} // Sua ilustração
            style={styles.ilustracao}
          />
          <Text style={[typography.h4, styles.ilustracaoTexto]}>
            Clique para adicionar a logo
          </Text>
        </TouchableOpacity>
      )}
        
      <Text style={[typography.detalhes, styles.textoPasso]}>
        Passo 4 de 6
      </Text>

      {/* --- BOTÕES DE NAVEGAÇÃO (Voltar / Feito) --- */}
      <View style={styles.navigationContainer}>
        <Buttongeneric
          title="Voltar"
          invertido
          width="45%"
          onPress={onDecline} // Botão branco "Voltar"
        />
        <Buttongeneric
          title="Feito" // Botão verde "Feito"
          width="45%"
          onPress={onNext}
          // Desabilita se nenhuma logo foi selecionada
          disabled={!logoUri} 
        />
      </View>

    </View>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    maxWidth: '90%',
  },

  // --- Estilos da Logo (Quando selecionada) ---
  logoDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: (screenWidth * 0.4) / 2, // Redondo
    borderWidth: 2,
    borderColor: cor_primaria,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#EEE'
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    marginTop: 10,
  },
  
  // --- CORREÇÃO AQUI ---
  removeButtonText: {
    ...typography.detalhes,  // 1. Aplica o estilo base (que inclui 'color: cinza')
    color: '#E53935',      // 2. Sobrescreve a cor para vermelho
    fontWeight: 'bold',
  },
  // --- FIM DA CORREÇÃO ---

  // --- Estilos da Ilustração (Quando NÃO selecionada) ---
  ilustracaoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '90%', 
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: cinza,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  ilustracao: {
    width: screenWidth * 0.35, 
    height: screenWidth * 0.35,
    resizeMode: 'contain',
  },
  ilustracaoTexto: {
    color: cinza,
    textAlign: 'center',
    marginTop: 15,
  },

  // --- Estilos de Navegação ---
  textoPasso: {
    color: cinza,
    marginBottom: 20,
    marginTop: 15,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,

    paddingTop: 20,
  }
});

export default LogoLoja;