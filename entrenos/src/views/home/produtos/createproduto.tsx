import React, { useState } from "react";
import {
  View,
  Text,
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

import { cor_primaria, cor_backgroud, typography, cinza } from "@/src/global";
import { ProdutoPayload } from "@/src/types/produto";

import { Ionicons } from "@expo/vector-icons";

import CustomInput from "@/src/components/customInput/customInput";
import Stepper from "@/src/components/buttons/NextBackStepper";
import Buttongeneric from "@/src/components/buttons/buttongeneric";
import AlertMessage from "@/src/components/alertas/AlertMessage";

const { width } = Dimensions.get("window");

const CreateProduto = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState<ProdutoPayload>({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: 0,
    imagem: "",
  });
  const [alert, setAlert] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showAlert = (msg: string, type: "success" | "error" = "success") => {
    setAlert({ msg, type });
  };


  const handleChange = (key: keyof ProdutoPayload, value: string | number) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm({ ...form, imagem: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.nome || !form.preco || form.quantidade <= 0) {
        showAlert("Nome, Preço e Quantidade são obrigatórios!", "error");
        return;
      }

      const formData = new FormData();

      formData.append("nome", form.nome);
      formData.append("descricao", form.descricao);
      formData.append("preco", form.preco.toString());
      formData.append("quantidade", form.quantidade.toString());

      if (form.imagem) {
        const uriParts = form.imagem.split("/");
        const fileName = uriParts.pop() || "photo.jpg";
        let fileType = fileName.split(".").pop();

        if (!["jpg", "jpeg", "png"].includes(fileType?.toLowerCase() || "")) {
          fileType = "jpeg";
        }

        formData.append("imagem", {
          uri: form.imagem,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      await createProduto(formData, true);

      showAlert("Produto criado com sucesso!", "success");


      setForm({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: 0,
        imagem: "",
      });

      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao criar produto:", error.response?.data || error.message);
      showAlert("Não foi possível criar o produto.", "error");
    }
  };

  return (
    <View style={{ flex: 1 }}>
       {alert && (
      <AlertMessage
        message={alert.msg}
        type={alert.type}
        onHide={() => setAlert(null)}
      />
    )}
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Header title="Produto" showBackButton={true} onBackPress={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>

        {/* --- Seção de Imagem --- */}
        <View style={styles.sectionContainer}>
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

        {/* --- Inputs customizados --- */}
        <CustomInput
          label="Nome"
          placeholder="Nome do produto"
          value={form.nome}
          onChangeText={(text) => handleChange("nome", text)}
        />

        <CustomInput
          label="Descrição"
          placeholder="Descrição"
          value={form.descricao}
          onChangeText={(text) => handleChange("descricao", text)}
        />

        
        <Text style={styles.textstep}>Quantidade</Text>
        <View style={styles.stepview}>
        <Stepper
          value={form.quantidade}
          onChange={(value) => handleChange("quantidade", value)}
        />
        </View>

        <CustomInput
          label="Preço"
          placeholder="0,00"
          value={String(form.preco)}
          keyboardType="default"
          onChangeText={(text) => handleChange("preco", text)}
        />

        

        {/* Botão */}
        <Buttongeneric
          title="Salvar Produto"
          onPress={handleSubmit}
        />

      </View>
    </ScrollView></View>
  );
  
};

export default CreateProduto;

const styles = StyleSheet.create({
  body: { padding: 20 },
  titleContainer: { width: width },
  container: {
    width: width,
    backgroundColor: cor_backgroud,
  },

  // Imagem
  sectionContainer: { marginBottom: 20 },
  imagePicker: {
    height: 150,
    borderWidth: 2,
    borderColor: "#60A0DF",
    borderStyle: "dotted",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    marginTop: 10,
  },
  imagePickerText: {
    ...typography.detalhes,
    color: cinza,
    marginTop: 8,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },

  sectionLabel: {
    ...typography.p,
    marginBottom: 6,
  },
  stepview:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'center'
  },
  textstep:{
    ... typography.h3,
    marginBottom: 3,
  }
});
