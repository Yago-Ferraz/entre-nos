import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./cadastroStyle";
import Header from "../../components/header/header";
import StepCard from "../../components/cards/stepCard";
import CadastroInput from "../../components/inputs/cadastroInput";
import NavigationButtons from "../../components/buttons/navigationButtons";

const steps = [
  {
    id: 1,
    title: "Olá Primeiro me\ninforma o que você é?",
    placeholder: "Clique em Próximo para continuar...",
    image: require("../../../../assets/images/Rectangle 320.svg"),
    input: false,
  },
  {
    id: 2,
    title: "Agora, nos\nInforme seu nome:",
    placeholder: "Insira seu nome...",
    image: require("../../../../assets/images/Rectangle 324.svg"),
    input: true,
  },
  {
    id: 3,
    title: "Muito bom! nos\ninforme seu telefone:",
    placeholder: "Digite seu telefone...",
    image: require("../../../../assets/images/Rectangle 321.svg"),
    input: true,
  },
  {
    id: 4,
    title: "Digite seu CNPJ:",
    placeholder: "Digite sua CNPJ...",
    image: require("../../../../assets/images/Rectangle 323.svg"),
    input: true,
  },
  {
    id: 5,
    title: "Quase lá!\nDigite sua senha:",
    placeholder: "Digite sua senha...",
    image: require("../../../../assets/images/Rectangle 339.svg"),
    input: true,
  },
  {
    id: 6,
    title: "Perfeito! Seu cadastro\nfoi realizado!",
    placeholder: "Revise suas informações...",
    image: require("../../../../assets/images/Rectangle 339.svg"),
    input: false,
  },
];

const Cadastro = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Finalizar cadastro:", formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (text: string) => {
    if (step.id === 2) setFormData({ ...formData, name: text });
    if (step.id === 3) setFormData({ ...formData, email: text });
    if (step.id === 4) setFormData({ ...formData, password: text });
    if (step.id === 5) setFormData({ ...formData, phone: text });
  };

  return (
    <View style={styles.container}>
      <Header title="Cadastro" />

      <StepCard>
        <Text style={styles.title}>{step.title}</Text>

        <Image
          source={step.image}
          style={styles.image}
          resizeMode="contain"
        />

        {step.input && (
          <CadastroInput
            placeholder={step.placeholder}
            value={
              step.id === 2
                ? formData.name
                : step.id === 3
                ? formData.email
                : step.id === 4
                ? formData.password
                : step.id === 5
                ? formData.phone
                : ""
            }
            onChangeText={handleInputChange}
            showMic={step.id === 2} // só aparece no nome
          />
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
  );
};

export default Cadastro;
