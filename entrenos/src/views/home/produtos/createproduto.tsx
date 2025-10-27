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
import { cor_primaria, cor_backgroud, typography } from "@/src/global";
import { ProdutoPayload } from "@/src/types/produto";

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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, imagem: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
  try {
    if (!form.nome || !form.preco || !form.quantidade) {
      Alert.alert("⚠️ Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("descricao", form.descricao);
    formData.append("preco", form.preco.toString());
    formData.append("quantidade", form.quantidade.toString());

    if (form.imagem) {
      const uriParts = form.imagem.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split(".").pop();

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
        <Header title="Produto" />
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
          />
        </View>
      ))}

      {/* Campo de imagem */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Imagem</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>
            {form.imagem ? "Trocar imagem" : "Selecionar imagem"}
          </Text>
        </TouchableOpacity>
        {form.imagem ? (
          <Image source={{ uri: form.imagem }} style={styles.preview} />
        ) : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateProduto;

const styles = StyleSheet.create({
  titleContainer:{
    width: '100%' ,

  },
  container: {
    flexGrow: 1,
    backgroundColor: cor_backgroud,

  },
  title: {
    ...typography.h1,
    color: cor_primaria,
    textAlign: "center",
    marginBottom: height * 0.03,
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
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  imageButton: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  imageButtonText: {
    color: "#333",
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
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
