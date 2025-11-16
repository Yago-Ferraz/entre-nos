// CustomButton.tsx
import React, { ReactNode } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  DimensionValue,
  GestureResponderEvent
} from 'react-native';


type CustomButtonProps = {

  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  color: string;
  onPressColor?: string;
  icon?: ReactNode;
  width?: DimensionValue;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};


const CustomButton = ({
  children,
  onPress,
  color,
  onPressColor,
  icon,
  width,
  textColor = '#ffffff',
  style,
}: CustomButtonProps) => {

  // Estilo dinâmico para o texto
  const textStyle: StyleProp<TextStyle> = [
    styles.text,
    { color: textColor },
    icon ? { marginLeft: 10 } : null 
  ];

  return (
    <Pressable
      onPress={onPress}
      
      style={({ pressed }) => {
        
        // Estilos base do botão
        const baseStyles: StyleProp<ViewStyle> = [
          styles.buttonBase,
          { backgroundColor: color }, 
          width ? { width: width } : null, 
          style 
        ];

       
        if (pressed) {
          if (onPressColor) {
           
            baseStyles.push({ backgroundColor: onPressColor });
          } else {
           
            baseStyles.push({ opacity: 0.8 });
          }
        }
        
        return baseStyles;
      }}
    >
    
      {icon}
      <Text style={textStyle}>
        {children}
      </Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24, // Mais espaço horizontal
    borderRadius: 50,      // Totalmente arredondado (pill shape)
    
    // Sombra (como na imagem)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;