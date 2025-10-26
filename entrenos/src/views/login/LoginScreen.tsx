import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import Header from "../../components/header/header";
import CadastroInput from "../../components/inputs/cadastroInput";
import { styles } from "./LoginStyle";
import { ROUTES } from '../../Routes';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../types/navigationTypes";
import { useAuth } from "../../AuthContext";

const loginImage = require("../../../assets/images/logoEntreNos.png");

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { login } = useAuth(); // pega a função login do contexto
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      console.log("Login realizado com sucesso!");
      // O RootNavigator vai automaticamente trocar para AppStack
    } catch (err) {
      console.error("Erro ao logar:", err);
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate(ROUTES.SIGN_UP); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={loginImage} style={styles.image} resizeMode="contain" />

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <CadastroInput
              placeholder="Insira seu E-mail"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Senha</Text>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </View>
            <CadastroInput
              placeholder="Insira sua senha"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Entrando..." : "Fazer Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
            <Text style={styles.createAccountText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
