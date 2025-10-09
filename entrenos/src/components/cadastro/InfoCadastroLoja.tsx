import React from "react";
import { StepProps } from "../../types/cadastro/cadastro";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {styles} from './stepstyles'
import { typography } from '../../global'
import Buttongeneric from '../../components/buttons/buttongeneric'


export const Infoloja: React.FC<StepProps> = ({ formData, setFormData, onNext, onDecline }) => {
  return (
    <View style={styles.container}>
      <Text style={typography.h1}>
        Olá! Vamos criar agora o perfil da sua loja?!
      </Text>

      <Image
        source={require('../../../assets/images/Rectangle 322.png')} 
        style={styles.illustration}
      />

      <Text style={[styles.stepText, typography.detalhes]}>Passo 1 de 7</Text>

      <View style={styles.buttonContainer}>
        <Buttongeneric
        title="Não quero agora"
        invertido
        onPress={onDecline}
        width={'45%'}
        /> 

        <Buttongeneric
        title="Vamos lá!"
        onPress={onNext}
        
        width={'45%'}
        /> 
      </View>
    </View>
  );
};

export default Infoloja;
