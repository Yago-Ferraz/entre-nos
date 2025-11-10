import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./navigationButtonsStyle";

interface Props {
  onBack: () => void;
  onNext: () => void;
  disableBack?: boolean;   // opcional
  nextLabel?: string;      // opcional
   disableNext?: boolean;
}

const NavigationButtons: React.FC<Props> = ({
  disableNext = false,
  onBack,
  onNext,
  disableBack = false,
  nextLabel = "Próximo",
  
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.back,
          disableBack && { opacity: 0.5 }, // feedback visual
        ]}
        onPress={onBack}
        disabled={disableBack}
        accessibilityState={{ disabled: disableBack }}
      >
        <Text style={styles.backText}>Voltar</Text>
        
      </TouchableOpacity>

      <TouchableOpacity
  style={[
    styles.button,
    styles.next,
    disableNext && { opacity: 0.5 }, 
  ]}
  onPress={onNext}
  disabled={disableNext} 
  accessibilityState={{ disabled: disableNext }} 
  testID="botaoProximo"
>
  <Text style={styles.nextText}>
    {disableNext ? "Carregando..." : nextLabel} {/* opcional: feedback UX */}
  </Text>
</TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
