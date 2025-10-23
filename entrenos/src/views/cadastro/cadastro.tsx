import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import StepCard from "../../components/cards/stepCard";
import Header from "../../components/header/header";
import CadastroInput from "../../components/inputs/cadastroInput";
import { styles } from "./cadastroStyle";
import { useNavigation } from '@react-navigation/native';
import NavigationButtons from "../../components/buttons/navigationButtons";
import { AuthStackParamList } from '../../types/navigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
    id: 6,
    title: "Perfeito! Seu cadastro\nfoi realizado!",

    image: require("../../../assets/images/Rectangle 339.png"),
    input: false,
  },
];

const Cadastro = () => {
  const navigation = useNavigation<CadastroNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    phone: "",
    cnpj: "",
    password: "",
    confirmPassword: "",
    categoria:'',
    fotos: []
  });

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Finalizar cadastro:", formData);
      navigation.navigate('singuploja', { formData });
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
    if (step.id === 4) setFormData({ ...formData, cnpj: text });
    if (step.id === 5) setFormData({ ...formData, password: text });
  };

  return (
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
                formData.userType === "empresa" && styles.choiceButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, userType: "empresa" })}
            >
              <Text
                style={[
                  styles.choiceText,
                  formData.userType === "empresa" && styles.choiceTextSelected,
                ]}
              >
                Empresa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceButton,
                formData.userType === "consumidor" &&
                  styles.choiceButtonSelected,
              ]}
              onPress={() =>
                setFormData({ ...formData, userType: "consumidor" })
              }
            >
              <Text
                style={[
                  styles.choiceText,
                  formData.userType === "consumidor" &&
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
                ? formData.cnpj
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
          disableBack={currentStep === 0}
          nextLabel={currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
        />
      </StepCard>

        </View>
    
    </View>
  );
};

export default Cadastro;
