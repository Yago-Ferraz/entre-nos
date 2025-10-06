import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./cadastroInputStyle";

interface CadastroInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  showMic?: boolean;
  secureTextEntry?: boolean; // 👈 novo para senha
}

const CadastroInput: React.FC<CadastroInputProps> = ({
  placeholder,
  value,
  onChangeText,
  showMic = false,
  secureTextEntry = false, // default false
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry} // 👈 agora funciona para senha
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
