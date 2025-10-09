import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native'; 
interface SettingsItemProps {
  icon?: LucideIcon; 
  label: string;
  onPress?: () => void;
}

const SettingsItem = ({ icon: Icon, label, onPress }: SettingsItemProps) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        {Icon && <Icon size={20} color="#0F5132" style={{ marginRight: 8 }} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <ChevronRight size={18} color="#aaa" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#0F5132',
    fontWeight: '500',
  },
});

export default SettingsItem;
