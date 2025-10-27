import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, 
    Image, TouchableOpacity, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StepProps } from '../../types/cadastro/cadastro';
import { 
    typography, cinza, cor_primaria, 
    FONT_SIZE, cor_backgroud 
} from '../../global';
import Buttongeneric from '../../components/buttons/buttongeneric';
import { Dimensions } from 'react-native';

// Pega as dimensões para o layout, assim como em CategoriaLoja
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- COMPONENTE ---
export const FotosLoja: React.FC<StepProps> = ({
  formData,
  setFormData,
  onDecline,
  onNext,
}) => {
  // Estado local para as URIs
  const [selectedImages, setSelectedImages] = useState<string[]>(formData.fotos || []);

  // Efeito para sincronizar o estado local com o formData principal
  useEffect(() => {
    if (formData.fotos !== selectedImages) {
      setFormData({ ...formData, fotos: selectedImages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  // Função para abrir a galeria
  const pickImage = async () => {
    if(formData.fotos.length <6){
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Correção final para o warning
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 6 - selectedImages.length, // Limite de 10 fotos
    });

    if (!result.canceled && result.assets) {
      const newImageUris = result.assets.map(asset => asset.uri);
      if(formData.fotos.length <6){

      setSelectedImages(prevUris => [...prevUris, ...newImageUris]);
    }}}else{
      Alert.alert('Limite de fotos', 'Você pode adicionar até 6 fotos.');
    }
  };

  // Função para remover imagem
  const removeImage = (uriToRemove: string) => {
    Alert.alert("Remover Foto", "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => setSelectedImages(prevUris => prevUris.filter(uri => uri !== uriToRemove)),
          style: "destructive"
        }
      ]
    );
  };

  return (
    // Container principal, igual ao de CategoriaLoja
    <View style={styles.container}>
      <Text style={[typography.h1, styles.titulo]}>
        Vamos deixar a sua cara!
      </Text>
      <Text style={[typography.h2, styles.subtitulo]}>
        Insira aqui fotos!
      </Text>
      <Text style={[typography.detalhes, styles.detalhesTexto]}>
        Insira fotos da loja, fachada, fotos dos seus produtos e tudo que tiver!
      </Text>

      {/* Área de Fotos: Mostra a ilustração ou as miniaturas */}
      {selectedImages.length === 0 ? (
        // 1. Ilustração (quando não há fotos)
        <TouchableOpacity onPress={pickImage} style={styles.ilustracaoContainer}>
          <Image
            source={require('../../../assets/images/Rectangle 320.png')}
            style={styles.ilustracao}
          />
          <Text style={[typography.h4, styles.ilustracaoTexto]}>
            Clique para adicionar as fotos
          </Text>
        </TouchableOpacity>
      ) : (
        // 2. Miniaturas (quando HÁ fotos)
        <View style={styles.thumbnailContainer}>
          {/* Usamos .map() em vez de FlatList para evitar o erro de nesting */}
          {selectedImages.map((uri) => (
            <View key={uri} style={styles.thumbnailWrapper}>
              <TouchableOpacity onPress={() => removeImage(uri)} style={styles.removeImageButton}>
                <Text style={styles.removeImageText}>X</Text>
              </TouchableOpacity>
              <Image source={{ uri }} style={styles.thumbnail} />
            </View>
          ))}
          {/* Botão para adicionar mais se já houver fotos */}
          <TouchableOpacity onPress={pickImage} style={styles.addMorePhotosButton}>
            <Text style={styles.addMorePhotosButtonText}>Adicionar Mais Fotos</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[typography.detalhes, styles.textoPasso]}>
        Passo 3 de 6
      </Text>

      {/* Botões de navegação, igual ao de CategoriaLoja */}
      <View style={styles.botaoContainer}>
        <Buttongeneric
          title="Voltar"
          invertido
          width="45%"
          onPress={onDecline} // Botão de voltar
        />
        <Buttongeneric
          title="Feito" // "Avançar" ou "Feito"
          width="45%"
          onPress={onNext} // Avança para o próximo passo
        />
      </View>
    </View>
  );
};

// --- ESTILOS ---
// (Seguindo o padrão de CategoriaLoja.tsx)
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
    // Removido flex: 1 para funcionar dentro do StepCard
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 5,
    maxWidth: '80%',
  },
  subtitulo: {
    textAlign: 'center',
    marginBottom: 10,
  },
  detalhesTexto: {
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '90%',
  },
  textoPasso: {
    color: cinza,
    marginBottom: 20,
    marginTop: 15,
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },

  // --- Estilos da Ilustração ---
  ilustracaoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: cinza,
    borderRadius: 10,
    backgroundColor: '#FAFAFA'
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

  // --- Estilos das Miniaturas ---
  thumbnailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que as fotos quebrem a linha
    justifyContent: 'center',
    width: '100%',
  },
  thumbnailWrapper: {
    margin: 5,
    position: 'relative',
  },
  thumbnail: {
    width: screenWidth * 0.22, // Ajusta o tamanho da miniatura
    height: screenWidth * 0.22,
    borderRadius: 8,
    backgroundColor: '#EEE'
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: cor_backgroud, // Fundo branco do popup
  },
  removeImageText: {
    color: '#FFF',
    fontSize: FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  addMorePhotosButton: {
    backgroundColor: cor_primaria,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    width: '90%',
    alignSelf: 'center'
  },
  addMorePhotosButtonText: {
    color: '#FFF',
    ...typography.button,
  },
});

export default FotosLoja;