import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { StepProps } from '../../types/cadastro/cadastro'; 
import { typography, cinza, cor_primaria } from '../../global';
import Buttongeneric from '../../components/buttons/buttongeneric';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ConclusaoLoja: React.FC<StepProps> = ({ 
  formData, 
  onNext, 
  onDecline 
}) => {
  
  return (
    <View style={styles.container}>

      <Text style={[typography.h1, styles.titulo]}>
        Tudo pronto! Estamos gerando o perfil da sua loja!
      </Text>

      <Image
        source={require('../../../assets/images/Rectangle 339.png')} 
        style={styles.ilustracao}
      />

      <Text style={[typography.detalhes, styles.textoPasso]}>
        Passo 6 de 6
      </Text>

      {/* --- BOTÕES DE NAVEGAÇÃO (Voltar / Criar) --- */}
      <View style={styles.buttonContainer}>
        <Buttongeneric
          title="Voltar"
          invertido
          width={'45%'} 
          onPress={onDecline} 
        />
        <Buttongeneric
          title="Criar"
          onPress={onNext} 
          width={'45%'} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02, // Aumenta um pouco o padding vertical geral
    // height: screenHeight * 0.55, // <-- ALTURA FIXA REMOVIDA
    // justifyContent: 'space-between', // Removido para evitar espaçamento excessivo
    justifyContent: 'center', // Centraliza o conteúdo se for menor que a tela
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 30, // Aumenta o espaço abaixo do título
    marginTop: 20, 
    maxWidth: '90%',
  },
  ilustracao: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    resizeMode: 'contain',
    marginBottom: 30, // Aumenta o espaço abaixo da ilustração
  },
  textoPasso: {
    color: cinza,
    marginBottom: 30, // Aumenta o espaço abaixo do texto do passo
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20,


  },
});

export default ConclusaoLoja;

