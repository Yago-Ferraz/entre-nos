import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { styles } from './carditemstyle'; // ⬅️ Importando os estilos

// Tipos de ícones (mantidos aqui pois são essenciais para a interface do componente)
type IconName = 
  keyof typeof Feather.glyphMap | 
  keyof typeof Ionicons.glyphMap | 
  keyof typeof MaterialCommunityIcons.glyphMap | 
  keyof typeof AntDesign.glyphMap;

interface CardItemProps {
  iconName: IconName;
  title: string;
  onPress: () => void;
  iconLibrary?: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons' | 'AntDesign';
}

export const CardItem: React.FC<CardItemProps> = ({ iconName, title, onPress, iconLibrary = 'Feather' }) => {
  
  const IconComponent = 
    iconLibrary === 'Ionicons' ? Ionicons : 
    iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
    iconLibrary === 'AntDesign' ? AntDesign : Feather;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContent}>
        <IconComponent name={iconName as any} size={20} color="#2F9E44" />
        <Text style={styles.text}>{title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#888" />
    </TouchableOpacity>
  );
};