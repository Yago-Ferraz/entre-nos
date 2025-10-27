import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Header from "@/src/components/header/header";
import { createProduto } from "@/src/services/produto";
import { cor_primaria, cor_backgroud, typography, cinza } from "@/src/global"; // Adicione 'cinza'
import { ProdutoPayload } from "@/src/types/produto";
import { Ionicons } from '@expo/vector-icons'; // Importar Ionicons para o ícone de imagem

const { width, height } = Dimensions.get("window");

const CreateProduto = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState<ProdutoPayload>({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: 0,
    imagem: "",
  });

  const handleChange = (key: keyof ProdutoPayload, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8, // Qualidade um pouco menor para melhor performance
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm({ ...form, imagem: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.nome || !form.preco || form.quantidade <= 0) {
        Alert.alert("⚠️ Atenção", "Nome, Preço e Quantidade (maior que 0) são obrigatórios.");
        return;
      }

      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("descricao", form.descricao);
      formData.append("preco", form.preco.toString());
      formData.append("quantidade", form.quantidade.toString());

      if (form.imagem) {
        const uriParts = form.imagem.split("/");
        const fileName = uriParts.pop() || 'photo.jpg';
        let fileType = fileName.split('.').pop();
        if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileType?.toLowerCase() || '')) {
            fileType = 'jpeg';
        }
        
        formData.append("imagem", {
          uri: form.imagem,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      await createProduto(formData, true);

      Alert.alert("✅ Sucesso", "Produto criado com sucesso!");
      setForm({ nome: "", descricao: "", preco: "", quantidade: 0, imagem: "" });
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao criar produto:", error.response?.data || error.message);
      Alert.alert("❌ Erro", "Não foi possível criar o produto.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Header title="Produto" showBackButton={true} onBackPress={() => navigation.goBack()} />
      </View>
      <View style={styles.body}>
      {/* --- Seção Adicionar Foto do Item --- */}
      <View style={styles.sectionContainer}>
        {/* Este é o componente que replicamos da imagem */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {form.imagem ? (
            <Image source={{ uri: form.imagem }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="image-outline" size={60} color={cinza} />
              <Text style={styles.imagePickerText}>Clique para adicionar uma foto</Text>
            </>
          )}
        </TouchableOpacity>
        
      </View>


    
      {["nome", "descricao", "preco", "quantidade"].map((field) => (
        <View key={field} style={styles.inputContainer}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Digite ${field}`}
            value={form[field as keyof ProdutoPayload]?.toString()}
            onChangeText={(text) => handleChange(field as keyof ProdutoPayload, text)}
            keyboardType={
              field === "preco" || field === "quantidade" ? "numeric" : "default"
            }
            multiline={field === "descricao" ? true : false} // Adicionado para descrição
            numberOfLines={field === "descricao" ? 4 : 1} // Adicionado para descrição
            textAlignVertical={field === "descricao" ? 'top' : 'center'} // Adicionado para descrição
          />
        </View>
      ))}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Produto</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    
    
  );
};

export default CreateProduto;

const styles = StyleSheet.create({
  body:{
    padding: 20,
  },
  titleContainer:{
    width: width ,
  },
  container: {
    width: width,
    backgroundColor: cor_backgroud,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    ...typography.p, 
    marginBottom: 4,
    color: "#333", 
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#CCC', 
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  

  sectionContainer: {
    marginBottom: 20,
  },
  imagePicker: {
    height: 150, 
    borderWidth: 2,
    borderColor: '#60A0DF', 
    borderStyle: 'dotted', 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9', // Fundo cinza claro
    marginTop: 10, // Espaço após o título/descrição da seção
  },
  imagePickerText: {
    ...typography.detalhes, // Ajuste para o seu estilo de texto menor
    color: cinza, // Cor do texto cinza
    marginTop: 8,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // Borda arredondada para a imagem
    resizeMode: 'cover', // Para cobrir a área sem distorcer muito
  },
  // --- FIM DOS NOVOS ESTILOS ---

  // Botão de salvar (mantido)
  button: {
    backgroundColor: cor_primaria,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});