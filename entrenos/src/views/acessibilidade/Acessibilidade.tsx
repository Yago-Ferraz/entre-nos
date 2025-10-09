import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';
import SettingsCard from '../../components/settings/SettingsCard';
import SettingsItem from '../../components/settings/SettingsItem';
import { Moon, Eye, Type } from 'lucide-react-native';

const AcessibilidadeView = () => {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [modoDaltonico, setModoDaltonico] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header com usuário */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>Ana Souza</Text>
            <Text style={styles.userEmail}>ana.souza@email.com</Text>
          </View>
        </View>

        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Accessibility.svg' }}
          style={styles.iconRight}
        />
      </View>

      {/* Card de acessibilidade */}
      <SettingsCard title="Acessibilidade">
        <View style={styles.itemRow}>
          <View style={styles.left}>
            <Moon size={18} color="#0F5132" style={styles.icon} />
            <Text style={styles.label}>Modo Escuro</Text>
          </View>
          <Switch
            value={modoEscuro}
            onValueChange={setModoEscuro}
            trackColor={{ false: '#ccc', true: '#0F5132' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.itemRow}>
          <View style={styles.left}>
            <Eye size={18} color="#0F5132" style={styles.icon} />
            <Text style={styles.label}>Modo daltônico</Text>
          </View>
          <Switch
            value={modoDaltonico}
            onValueChange={setModoDaltonico}
            trackColor={{ false: '#ccc', true: '#0F5132' }}
            thumbColor="#fff"
          />
        </View>

        <SettingsItem icon={Type} label="Tamanho da fonte" onPress={() => {}} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F5132',
  },
  userEmail: {
    fontSize: 13,
    color: '#777',
  },
  iconRight: {
    width: 40,
    height: 40,
  },
  itemRow: {
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
  icon: {
    marginRight: 8,
  },
});

export default AcessibilidadeView;
