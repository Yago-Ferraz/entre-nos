import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Text, TouchableOpacity, View,StyleSheet,KeyboardAvoidingView,Platform,Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'; 
import StepCard from "../../components/cards/stepCard";
import Header from "../../components/header/header";
import { cor_primaria } from "@/src/global";
import CadastroInput from "../../components/inputs/cadastroInput";
import { styles } from "./cadastroStyle";
import { useNavigation } from '@react-navigation/native';
import NavigationButtons from "../../components/buttons/navigationButtons";
import { AuthStackParamList } from '../../types/navigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUser, loginUser } from '../../services/userService';
import { useAuth } from '../..//AuthContext';
import axios from 'axios';


type CadastroNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup' // a tela onde você está agora (Cadastro básico)
>;


const steps = [
  {
    id: 1,
    title: "Olá Primeiro me\ninforma o que você é?",

    image: require("../../../assets/images/Rectangle 320.png"),
    type: "choice", // 👈 tipo especial

  },
  {
    id: 2,
    title: "Agora, nos\nInforme seu nome:",
    placeholder: "Insira seu nome...",
    image: require("../../../assets/images/Rectangle 324.png"),
    input: true,
  },
  {
    id: 3,
    title: "Muito bom! nos\ninforme seu telefone:",
    placeholder: "Digite seu telefone...",
    image: require("../../../assets/images/Rectangle 321.png"),
    input: true,
  },
  {
    id: 4,
    title: "Digite seu CNPJ:",

    placeholder: "Digite seu CNPJ...",
    image: require("../../../assets/images/Rectangle 323.png"),
    input: true,
  },
  {
    id: 5,
    title: "Quase lá!\nDigite sua senha:",

    image: require("../../../assets/images/Rectangle 339.png"),
    type: "password", // 👈 tipo especial

  },
  {
    id: 6, // <-- Novo ID
    title: "Qual o seu e-mail?",
    placeholder: "Digite seu e-mail...",
    // Escolha uma imagem apropriada ou reuse uma
    image: require("../../../assets/images/Rectangle 323.png"), // Exemplo: Reutilizando imagem
    input: true,
  },
  {
    id: 7,
    title: "Perfeito! Seu cadastro\nfoi realizado!",

    image: require("../../../assets/images/Rectangle 339.png"),
    input: false,
    
  },
  
];

const Cadastro = () => {
  const navigation = useNavigation<CadastroNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userType: 1,
    name: "",
    phone: "",
    documento: "",
    password: "",
    confirmPassword: "",
    categoria:1,
    fotos: [],
    logo:'',
    descricao: '',
    email: '', 
  });

  const step = steps[currentStep];

  const { login } = useAuth()
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const handleNext = async () => {
  const currentStepId = steps[currentStep].id;

          if (currentStepId === 2 && !formData.name.trim()) {
              Alert.alert("Erro", "O campo Nome é obrigatório.");
              return; // Impede o avanço
          }
        
          if (currentStepId === 5) {

              if (formData.password.length < 6) {
                  Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
                  return; 
              }
          }
          
          if (currentStepId === 6) {
              if (!formData.email.trim()) {
                  Alert.alert("Erro", "O campo E-mail é obrigatório.");
                  return;
              }
              
              if (!isValidEmail(formData.email)) {
                  Alert.alert("Erro", "O endereço de e-mail inserido é inválido.");
                  return;
              }
          }

  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    const standardizedEmail = formData.email.toLowerCase();
    console.log("Finalizar cadastro:", formData);
    setLoading(true);
    try {
        await createUser({...formData, email: standardizedEmail });
        console.log("Usuário criado com sucesso!");
        await login(standardizedEmail, formData.password);

        navigation.navigate('singuploja', { formData:{ ...formData, email: standardizedEmail } });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response ? error.response.status : null;        
            if (statusCode === 409) {
                Alert.alert(
                    "Cadastro Existente", 
                    "Este e-mail já está sendo usado. Tente fazer login ou use outro e-mail."
                );
                return; 
            }
        }
                
        console.error("Erro ao criar usuário ou logar:", error);
        Alert.alert("Erro", "Não foi possível criar o usuário ou logar. Verifique os dados e tente novamente.");
    }finally {
      setLoading(false);
    }
  }
};

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (text: string) => {
    if (step.id === 2) setFormData({ ...formData, name: text });
    if (step.id === 3) setFormData({ ...formData, phone: text });
    if (step.id === 4) setFormData({ ...formData, documento: text });
    if (step.id === 5) setFormData({ ...formData, password: text });
    if (step.id === 6) setFormData({ ...formData, email: text });
  };

  return (
    
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // ajuste conforme header
  >
    <View style={styles.container}>
      <Header title="Cadastro" />


        <View style={styles.content}>
        <StepCard>
        <Text style={styles.title}>{step.title}</Text>

        <Image source={step.image} style={styles.image} resizeMode="contain" />

        {/* Step 1: Escolha entre Empresa e Consumidor */}
        {step.type === "choice" && (
          <View style={styles.choiceContainer}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                formData.userType === 1 && styles.choiceButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, userType: 1 })}
            >
              <Text
                style={[
                  styles.choiceText,
                  formData.userType === 1 && styles.choiceTextSelected,
                ]}
              >
                Empresa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceButton,
                formData.userType === 2 &&
                  styles.choiceButtonSelected,
              ]}
              onPress={() =>
                setFormData({ ...formData, userType:2 })
              }
            >
              <Text
                style={[
                  styles.choiceText,
                  formData.userType === 2 &&
                    styles.choiceTextSelected,
                ]}
              >
                Consumidor
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Steps com input único */}
        {step.input && (
        <CadastroInput
            placeholder={step.placeholder ?? ""}
            value={
            step.id === 2
                ? formData.name
                : step.id === 3
                ? formData.phone
                : step.id === 4
                ? formData.documento
                :step.id === 6 
                ? formData.email 
                : ""
                
            }
            onChangeText={handleInputChange}
          
        />
        )}


        {/* Step 5: senha e confirmar senha */}
        {step.type === "password" && (
          <View style={{ width: "100%", gap: 12 }}>
            <CadastroInput
              placeholder="Digite sua senha..."
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
            />
            <CadastroInput
              placeholder="Confirme sua senha..."
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
            />
          </View>
        )}

        <Text style={styles.stepText}>
          Passo {step.id} de {steps.length}
        </Text>

        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          disableNext={loading}
           
          disableBack={currentStep === 0}
          nextLabel={currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
        />
      </StepCard>

        </View>
    
    </View>
    </KeyboardAvoidingView>
  );
};


export default Cadastro;
