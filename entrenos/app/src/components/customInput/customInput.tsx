import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';


interface CustomInputProps {
  label:string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}) => {
  return (
  <View style={styles.container}>
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
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 20,
    marginBottom: 3,
    fontWeight: 'bold',

  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#FFA629', 
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 5,

    
  },
});

export default CustomInput;