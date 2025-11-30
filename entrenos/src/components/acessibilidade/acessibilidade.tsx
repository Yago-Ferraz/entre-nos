import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './acessibilidadestyles'; // Estilos serão criados abaixo

type IconName = keyof typeof Feather.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;

interface SettingsToggleProps {
  iconName: IconName;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconLibrary?: 'Feather' | 'MaterialCommunityIcons';
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ 
  iconName, 
  title, 
  value, 
  onValueChange,
  iconLibrary = 'Feather'
}) => {
  
  const IconComponent = 
    iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <IconComponent name={iconName as any} size={20} color="#2F9E44" />
        <Text style={styles.text}>{title}</Text>
      </View>
      <Switch 
        trackColor={{ false: "#767577", true: "#76b784" }} // Cor clara para o track
        thumbColor={value ? "#2F9E44" : "#f4f3f4"} // Cor do thumb (círculo)
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

// Estilos para o SettingsToggle (src/components/SettingsToggle/styles.ts)
