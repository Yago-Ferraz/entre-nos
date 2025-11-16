import React, { ReactNode } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  DimensionValue, 
  StyleProp,      
  ViewStyle       
} from 'react-native';
import { colors } from '../../styles/colors';


interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  color?: string;
  onPressColor?: string;
  textColor?: string;
  width?: DimensionValue;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false,
  icon,
  color = colors.primary, 
  onPressColor,
  textColor = '#FFFFFF', 
  width = 300,           
}) => {

 
  const textAndIconStyle = [
    styles.buttonText, 
    { color: textColor } 
  ];
  
  const getDynamicStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => {
    

    const style: StyleProp<ViewStyle> = [
      styles.button, 
      { width: width },
      { backgroundColor: color } 
    ];


    if (disabled) {
      style.push(styles.buttonDisabled);
      return style;
    }


    if (pressed) {
      if (onPressColor) {
      
        style.push({ backgroundColor: onPressColor });
      } else {
       
        style.push({ opacity: 0.7 });
      }
    }
    
    return style;
  };


  return (
    <Pressable
      style={getDynamicStyle}
      onPress={onPress}
      disabled={disabled}
    >
     
      {icon}
      
    
      <Text style={[
        textAndIconStyle,
        icon ? { marginLeft: 10 } : null 
      ]}>
        {title}
      </Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  button: {

    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    
    
    flexDirection: 'row',
   
   
  },
  
  buttonDisabled: {
    backgroundColor: colors.secondary, 
  },
  
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
   
  },
});

export default CustomButton;