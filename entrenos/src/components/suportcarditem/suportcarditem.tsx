// src/components/SupportCardItem/index.tsx
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof Feather.glyphMap | keyof typeof AntDesign.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;

interface SupportCardItemProps {
  iconName: IconName;
  title: string;
  description: string;
  onPress: () => void;
  iconLibrary?: 'Feather' | 'AntDesign' | 'MaterialCommunityIcons';
}

export const SupportCardItem: React.FC<SupportCardItemProps> = ({ 
  iconName, 
  title, 
  description, 
  onPress, 
  iconLibrary = 'Feather' 
}) => {
  
  const IconComponent = 
    iconLibrary === 'AntDesign' ? AntDesign : 
    iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContent}>
        <IconComponent name={iconName as any} size={24} color="#003366" style={styles.icon} />
        <View style={styles.textGroup}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );
};

// Estilos para o SupportCardItem (src/components/SupportCardItem/styles.ts)
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF', // Fundo branco
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 15,
  },
  textGroup: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
  },
});