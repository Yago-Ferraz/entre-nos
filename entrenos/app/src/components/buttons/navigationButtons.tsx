import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./navigationButtonsStyle";

interface Props {
  onBack: () => void;
  onNext: () => void;
  disableBack?: boolean;   // opcional
  nextLabel?: string;      // opcional
}

const NavigationButtons: React.FC<Props> = ({
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
          disableBack && { opacity: 0.5 }, // desabilita visualmente
        ]}
        onPress={onBack}
        disabled={disableBack}
      >
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.next]} onPress={onNext}>
        <Text style={styles.nextText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
