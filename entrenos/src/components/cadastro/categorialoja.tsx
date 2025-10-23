import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Buttongeneric from '../../components/buttons/buttongeneric';
import DropdownGeneric from '../../components/inputs/Dropdown';
import {
  cor_primaria,
  typography,
  cinza,
} from '../../global';
import { StepProps } from '../../types/cadastro/cadastro';
import { Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const categorias = ['Vestuário', 'Alimentação', 'Tecnologia', 'Esportes'];

export const CategoriaLoja: React.FC<StepProps> = ({
  formData,
  setFormData,
  onDecline,
  onNext,
}) => {

  const handleSelectCategoria = (categoria: string) => {
    setFormData({ ...formData, categoria });
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h1, styles.titulo]}>
        Agora, conta pra gente: que tipo de loja é a sua?
      </Text>

      <Image
        source={require('../../../assets/images/Rectangle 339.png')}
        style={styles.ilustracao} // O estilo corrigido está abaixo
      />

      <Text style={[typography.detalhes, styles.textoPasso]}>
        Passo 2 de 6
      </Text>

      <DropdownGeneric<string>
        items={categorias}
        selectedValue={formData.categoria || null}
        onSelect={handleSelectCategoria}
        placeholder="Selecione a categoria"
        width={'60%'} // Aumentei um pouco para bater com a imagem
      />

      {/* Botões de navegação */}
      <View style={styles.botaoContainer}>
        <Buttongeneric
          title="Voltar"
          invertido
          width="45%"
          onPress={onDecline}
        />
        <Buttongeneric
          title="Avançar"
          width="45%"
          onPress={onNext}
          disabled={!formData.categoria}
        />
      </View>
    </View>
  );
};

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
    maxWidth: '90%', // Aumentei para permitir mais texto
  },
  
  // --- CORREÇÃO AQUI ---
  ilustracao: {
    width: screenWidth * 0.4, // 40% da largura da tela
    height: screenWidth * 0.4, // Mesma altura para manter a proporção
    resizeMode: 'contain',
    marginBottom: 20,
  },
  // --- FIM DA CORREÇÃO ---

  textoPasso: {
    color: cinza,
    marginBottom: 20,
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30, // Mais espaço após o dropdown
  },
});

export default CategoriaLoja;