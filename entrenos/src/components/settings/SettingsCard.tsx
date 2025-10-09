import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SettingsCardProps {
  title: string;
  children: ReactNode;
}

const SettingsCard = ({ title, children }: SettingsCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.dividerContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: '#777',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  dividerContainer: {
    borderTopColor: '#eee',
  },
});

export default SettingsCard;
