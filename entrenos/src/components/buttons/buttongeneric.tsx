import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { cor_primaria, typography } from '../../global';

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
  testID?: string;
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
  testID,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const backgroundColor = invertido
    ? isPressed ? cor_primaria : '#FFFFFF'
    : isPressed ? '#1E6F2E' : cor_primaria;

  const textColor = invertido
    ? isPressed ? '#FFFFFF' : cor_primaria
    : '#FFFFFF';

  const getButtonStyles = (): StyleProp<ViewStyle> => [
    buttonGenericStyles.buttonContainer,
    {
      backgroundColor,
      width,
      opacity: disabled || loading ? 0.6 : 1,
      shadowOpacity: isPressed ? 0.25 : 0.15,
      shadowRadius: isPressed ? 8 : 6,
      elevation: isPressed ? 5 : 3,
    },
    style,
  ];

  return (
    <TouchableOpacity
      testID={testID}
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={buttonGenericStyles.contentContainer}>
          {leftIcon && <View style={buttonGenericStyles.iconContainer}>{leftIcon}</View>}
          <Text style={[typography.button, { color: textColor }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const buttonGenericStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Ajustado para ficar mais compacto como no card
    paddingHorizontal: 16,
    borderRadius: 20, // Mais arredondado como na imagem
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
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