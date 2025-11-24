import React, { ReactNode } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  StyleProp,      
  ViewStyle,      
  DimensionValue, 
  GestureResponderEvent 
} from 'react-native';

type CardBaseProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;


  onPress?: (event: GestureResponderEvent) => void;


  width?: DimensionValue; 
};


const CardBase = ({ 
  children, 
  style, 
  onPress, 
  width = '100%' 
}: CardBaseProps) => {
  
  const ComponenteRaiz = onPress ? TouchableOpacity : View;


  const combinedStyle: StyleProp<ViewStyle> = [
    styles.card,       
    { width: width },  
    style              
  ];

  return (
    <ComponenteRaiz 
      style={combinedStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1.0}
    >
      {children}
    </ComponenteRaiz>
  );
};


const styles = StyleSheet.create({
  card: {

    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    

    alignSelf: 'center', 
  },
});

export default CardBase;