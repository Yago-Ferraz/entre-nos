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
        style={styles.ilustracao}
      />

      <Text style={[typography.detalhes, styles.textoPasso]}>
        Passo 2 de 7
      </Text>

      <DropdownGeneric<string>
        items={categorias}
        selectedValue={formData.categoria || null}
        onSelect={handleSelectCategoria}
        placeholder="Selecione a categoria"
        width={'50%'}
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
    maxWidth: '80%',
  },
  ilustracao: {
    width: '50%',
    height:'50%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textoPasso: {
    color: cinza,
    marginBottom: 20,
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default CategoriaLoja;
