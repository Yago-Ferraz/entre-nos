import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingsCard from '../../components/settings/SettingsCard';
import SettingsItem from '../../components/settings/SettingsItem';
import { HelpCircle, MessageSquare, Star } from 'lucide-react-native';

interface SuporteViewProps {
  navigation: any;
}

const SuporteView = ({ navigation }: SuporteViewProps) => {
  return (
    <View style={styles.container}>
      {/* Header simples */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suporte</Text>
      </View>

      {/* Card de opções */}
      <SettingsCard title="">
        <SettingsItem
          icon={HelpCircle}
          label="FAQ"
          onPress={() => console.log('Abrir FAQ')}
        />
        <Text style={styles.description}>Veja se sua dúvida já foi respondida</Text>

        <SettingsItem
          icon={MessageSquare}
          label="Contate seu suporte"
          onPress={() => console.log('Abrir suporte')}
        />
        <Text style={styles.description}>Fale com alguém</Text>

        <SettingsItem
          icon={Star}
          label="Faça avaliações"
          onPress={() => console.log('Abrir avaliações')}
        />
        <Text style={styles.description}>Deixe sua avaliação nos nossos perfis</Text>
      </SettingsCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    backgroundColor: '#0F5132',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginLeft: 36,
    marginTop: -6,
    marginBottom: 8,
  },
});

export default SuporteView;
