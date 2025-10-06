
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/header/header";
import CadastroInput from "../../components/inputs/cadastroInput";
import { styles } from "./LoginStyle";

const loginImage = require("../../../assets/images/logoEntreNos.png");

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    console.log("Tentativa de login com:", formData);
  };
  
  const handleCreateAccount = () => {
   
    console.log("Navegar para a tela de Cadastro");
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
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
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
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Fazer Login</Text>
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