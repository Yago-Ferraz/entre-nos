import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
    primary: '#1E6F2E', // Verde escuro do header/botões
    primaryLight: '#E8F5E9',
    secondary: '#F57C00', // Laranja
    textDark: '#1A237E', // Azul escuro dos títulos/valores
    textGray: '#666666',
    red: '#D32F2F',
    greenValid: '#2E7D32',
    yellow: '#FFB300',
    background: '#F5F5F5',
    white: '#FFFFFF',
  };

interface ActivityItemProps {
  title: string;
  date: string;
  value: string;
  color: string;
  barColor: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, date, value, color, barColor }) => (
  <View style={[styles.activityItem, { borderLeftColor: barColor }]}>
    <View>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDate}>{date}</Text>
    </View>
    <Text style={[styles.activityValue, { color: color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    borderLeftWidth: 4, // A barrinha colorida lateral
    paddingLeft: 10,
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  activityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ActivityItem;
