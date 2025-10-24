import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Buttongeneric from '../../components/buttons/buttongeneric';
import DropdownGeneric from '../../components/inputs/Dropdown';
import { cor_primaria, typography, cinza } from '../../global';
import { StepProps } from '../../types/cadastro/cadastro';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const categorias = [
  { label: 'Vestuário', value: 1 },
  { label: 'Alimentação', value: 2 },
  { label: 'Tecnologia', value: 3 },
  { label: 'Esportes', value: 4 },
];

export const CategoriaLoja: React.FC<StepProps> = ({
  formData,
  setFormData,
  onDecline,
  onNext,
}) => {
  const handleSelectCategoria = (categoria: { label: string; value: number }) => {
    setFormData({ ...formData, categoria: categoria.value });
  };
  const selectedCategoriaObject = categorias.find(cat => cat.value === formData.categoria) || null;
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
        Passo 2 de 6
      </Text>

     <DropdownGeneric // Use o tipo definido
        items={categorias}
        selectedValue={selectedCategoriaObject} // Passe o objeto selecionado
        onSelect={handleSelectCategoria}
        placeholder="Selecione a categoria"
        width={'60%'} 
        // 👇 Adicione esta linha para dizer qual propriedade mostrar
        labelExtractor={(item) => item.label} 
      />

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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '90%',
  },
  ilustracao: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
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
    marginTop: 30,
  },
});

export default CategoriaLoja;
