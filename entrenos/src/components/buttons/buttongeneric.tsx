import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from 'react-native';
import { cor_primaria, cor_secundaria, typography } from '../../global';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: number | `${number}%`; 
  invertido?: boolean;
}

const Buttongeneric: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  leftIcon,
  style,
  textStyle,
  width,
  invertido = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Define as cores dinamicamente
  const backgroundColor = invertido
    ? isPressed
      ? cor_primaria
      : '#FFFFFF'
    : isPressed
    ? '#1E6F2E' // tom mais escuro ao clicar
    : cor_primaria;

  const textColor = invertido
    ? isPressed
      ? '#FFFFFF'
      : cor_primaria
    : '#FFFFFF';

  // Estilo base com sombra
  const getButtonStyles = (): StyleProp<ViewStyle> => [
    styles.buttonContainer,
    {
      backgroundColor,
      width,
      opacity: disabled || loading ? 0.6 : 1,
      shadowOpacity: isPressed ? 0.25 : 0.15,
      shadowRadius: isPressed ? 8 : 6,
      elevation: isPressed ? 5 : 3, // Android
    },
    style,
  ];

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <Text style={[typography.button, { color: textColor }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3, // Android sombra
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default Buttongeneric;
