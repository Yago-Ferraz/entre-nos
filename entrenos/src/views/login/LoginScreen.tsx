import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import StepCard from "../../components/cards/stepCard"; // Reutilizado
import Header from "../../components/header/header"; // Reutilizado
import CadastroInput from "../../components/inputs/cadastroInput"; // Reutilizado
import { styles } from "./LoginStyle"; // Importando o novo estilo

// A imagem foi escolhida do seu array de cadastro, você pode trocar por um logo
const loginImage = require("../../../assets/images/Rectangle 339.svg");

const LoginScreen = () => {
  // 1. Estado simplificado apenas para email e senha
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2. Função única para lidar com o clique no botão de login
  const handleLogin = () => {
    // Aqui você colocará a lógica para autenticar o usuário
    console.log("Tentativa de login com:", formData);
  };

  return (
    <View style={styles.container}>
      <Header title="Login" />

      <View style={styles.content}>
        <StepCard>
          <Text style={styles.title}>{"Bem-vindo(a) de volta!"}</Text>

          <Image source={loginImage} style={styles.image} resizeMode="contain" />

          {/* 3. Inputs de E-mail e Senha diretamente na tela */}
          <View style={{ width: "100%", gap: 16 }}>
            <CadastroInput
              placeholder="Digite seu e-mail ou usuário"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
            />
            <CadastroInput
              placeholder="Digite sua senha..."
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
            />
          </View>
          
          {/* Opcional: Link para "Esqueci a senha" */}
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>


          {/* 4. Botão único de "Entrar" no lugar dos botões de navegação */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
          
        </StepCard>
      </View>
    </View>
  );
};

export default LoginScreen;