import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./cadastroInputStyle";

interface CadastroInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  showMic?: boolean;
}

const CadastroInput: React.FC<CadastroInputProps> = ({
  placeholder,
  value,
  onChangeText,
  showMic = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {showMic && (
        <TouchableOpacity>
          <Ionicons name="mic-outline" size={22} color="#0D823B" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CadastroInput;
