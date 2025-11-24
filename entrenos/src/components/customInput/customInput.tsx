import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { typography, cor_backgroud, cor_primaria } from '@/src/global';

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  width?: number | string; // agora aceita '50%', '80%', etc.
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  width = '100%',
}) => {
  return (
    <View style={[styles.container, width ? { width } : {}] as any}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    ...typography.h3,
    marginBottom: 3,
  },
  input: {
    width: '100%', // sempre 100% da view
    borderColor: cor_primaria,
    backgroundColor: cor_backgroud,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
});

export default CustomInput;
