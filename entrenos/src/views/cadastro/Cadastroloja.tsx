import React, { useState } from "react";
import { View,KeyboardAvoidingView,Platform } from "react-native";
import Header from "../../components/header/header";
import NavigationButtons from "../../components/buttons/navigationButtons";
import {Infoloja} from '../../components/cadastro/InfoCadastroLoja';
import {ConclusaoLoja} from '../../components/cadastro/ConclusaoLoja';
import {DescricaoLoja} from '../../components/cadastro/DescricaoLoja';
import { LogoLoja} from '../../components/cadastro/LogoLoja';
import {FotosLoja} from '../../components/cadastro/FotosLoja';
import {CategoriaLoja} from '../../components/cadastro/categorialoja';
import { FormDataCadastroLojaType } from "../../types/cadastro/cadastro";
import { useRoute } from '@react-navigation/native';
import StepCard from '../../components/cards/stepCard'
import { styles } from "./cadastroStyle";
import {createUser} from '../../services/userService'

const CadastroEmpresa = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const route = useRoute();
  const initialFormData = (route.params as { formData: FormDataCadastroLojaType }).formData;
  const [formData, setFormData] = useState<FormDataCadastroLojaType>(initialFormData);

const handleSubmit = async () => {
  try {
    // Aqui você envia todo o formData como payload
    const response = await createUser(formData);
    console.log('Usuário/Loja criada com sucesso:', response);
    // Se quiser, navegar para outra tela depois de criar
    // navigation.navigate('TelaSucesso');
  } catch (error) {
    console.error('Erro ao criar usuário/loja:', error);
  }
};

  const handleNext = async  () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else {console.log("Cadastro completo:", formData)
          handleSubmit();
    };
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

    const steps = [
    <Infoloja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack} />,
        <CategoriaLoja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack}/>,
        <FotosLoja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack}/>,
        <LogoLoja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack}/>,
        <DescricaoLoja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack}/>,
        <ConclusaoLoja formData={formData} setFormData={setFormData} onNext={handleNext} onDecline={handleBack}/>,
      ];

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // ajuste conforme header
  >
    <View style={{ flex: 1 }}>
      <Header title="Criar Loja" />
        <View style={styles.content}>
            <StepCard>
                {steps[currentStep]}
            </StepCard>
        </View>
      
    </View>
    </KeyboardAvoidingView>
  );
};

export default CadastroEmpresa;
