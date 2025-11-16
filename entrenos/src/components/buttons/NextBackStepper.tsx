import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';

import {typography} from '@/src/global'

const { width, height } = Dimensions.get('window');


type StepperProps = {
  value: number;
  onChange: (newValue: number) => void; // Callback que recebe um número e não retorna nada
};

const Stepper:React.FC<StepperProps> = ({ value, onChange }) => {
  

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    // Impede que o valor se torne negativo (opcional)
    onChange(value > 0 ? value - 1 : 0);
  };

  return (
    <View style={styles.container}>
      {/* Botão de Decrementar (-) */}
      <TouchableOpacity
        onPress={handleDecrement}
        style={[styles.buttonBase, styles.buttonLeft]}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      {/* Visor do Valor */}
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>

      {/* Botão de Incrementar (+) */}
      <TouchableOpacity
        onPress={handleIncrement}
        style={[styles.buttonBase, styles.buttonRight]}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  appContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    ... typography ,
    marginBottom: 20,
  },
  // Estilos do componente Stepper
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000ff', // Verde escuro para a borda
    borderRadius: 8,        // Cantos arredondados
    overflow: 'hidden',     // Garante que os filhos não "vazem" dos cantos
     alignSelf: 'flex-start'
  },
  buttonBase: {
    backgroundColor: '#008000', // Verde
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // Texto branco
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 26, // Ajuda a centralizar o + e -
  },
  buttonLeft: {
    // Adiciona arredondamento apenas nos cantos esquerdos
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  buttonRight: {
    // Adiciona arredondamento apenas nos cantos direitos
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  valueContainer: {
    backgroundColor: '#FFFFFF', // Fundo branco
    paddingVertical: 10,
    paddingHorizontal: 30,
    // Adiciona bordas para separar dos botões verdes
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#006400', // Mesma cor da borda externa
  },
  valueText: {
    ... typography.h3,
    color: '#333333', // Texto preto/cinza escuro
  },
});

export default Stepper;