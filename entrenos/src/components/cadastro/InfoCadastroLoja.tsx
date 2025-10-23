import React from "react";
import { StepProps } from "../../types/cadastro/cadastro";
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'; // Importa StyleSheet e Dimensions
import { typography, cinza } from '../../global'; // Importa a tipografia e cores globais
import Buttongeneric from '../../components/buttons/buttongeneric';

// Pega as dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Infoloja: React.FC<StepProps> = ({ formData, setFormData, onNext, onDecline }) => {
  return (
    // Usa o container com estilos locais
    <View style={styles.container}>
      <Text style={[typography.h1, styles.titulo]}>
        Olá! Vamos criar agora o perfil da sua loja?!
      </Text>

      <Image
        source={require('../../../assets/images/Rectangle 322.png')} 
        style={styles.ilustracao} // Usa o estilo local
      />

      <Text style={[styles.textoPasso, typography.detalhes]}>Passo 1 de 6</Text>

      <View style={styles.botaoContainer}>
       

        <Buttongeneric
          title="Vamos lá!"
          onPress={onNext}
          width={'90%'}
        /> 
      </View>
    </View>
  );
};

// --- Estilos Locais ---
// (Seguindo o padrão de CategoriaLoja.tsx e da sua imagem)
const styles = StyleSheet.create({
  container: {
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '90%', // Garante que o texto quebre
  },
  ilustracao: {
    width: screenWidth * 0.4, // 40% da largura da tela
    height: screenWidth * 0.4,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textoPasso: {
    color: cinza,
    marginBottom: 30, // Mais espaço antes dos botões
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    
  },
});

export default Infoloja;