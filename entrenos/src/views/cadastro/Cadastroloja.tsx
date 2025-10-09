import React, { useState } from "react";
import { View } from "react-native";
import Header from "../../components/header/header";
import NavigationButtons from "../../components/buttons/navigationButtons";
import {Infoloja} from '../../components/cadastro/InfoCadastroLoja'
import {CategoriaLoja} from '../../components/cadastro/categorialoja';
import { FormDataCadastroLojaType } from "../../types/cadastro/cadastro";
import { useRoute } from '@react-navigation/native';
import StepCard from '../../components/cards/stepCard'
import { styles } from "./cadastroStyle";

const CadastroEmpresa = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const route = useRoute();
  const initialFormData = (route.params as { formData: FormDataCadastroLojaType }).formData;
  const [formData, setFormData] = useState<FormDataCadastroLojaType>(initialFormData);



  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else console.log("Cadastro completo:", formData);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

    const steps = [
    <Infoloja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack} />,
        <CategoriaLoja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack}/>
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header title="Criar Loja" />
        <View style={styles.content}>
            <StepCard>
                {steps[currentStep]}
            </StepCard>
        </View>
      
    </View>
  );
};

export default CadastroEmpresa;
