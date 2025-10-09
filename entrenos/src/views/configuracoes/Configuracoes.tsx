import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import SettingsCard from '../../components/settings/SettingsCard';
import SettingsItem from '../../components/settings/SettingsItem';
import { User, Settings, Accessibility, HelpCircle, PlusCircle } from 'lucide-react-native';

interface ConfiguracoesViewProps {
  navigation: any;
}

const ConfiguracoesView = ({ navigation }: ConfiguracoesViewProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Aqui estão as contas cadastradas (pode vir de API futuramente)
  const contas = [
    { nome: 'Ana Souza', email: 'ana.souza@email.com' },
    { nome: 'Ana Amaral', email: 'ana.amaral@email.com' },
  ];

  return (
    <View style={styles.container}>
      {/* Cards de Configuração */}
      <SettingsCard title="Conta">
        <SettingsItem
          icon={User}
          label="Trocar Perfil"
          onPress={() => setModalVisible(true)} // 
        />
        <SettingsItem
          icon={Settings}
          label="Configurações do Sistema"
          onPress={() => navigation.navigate('ConfigSistema')}
        />
      </SettingsCard>

      <SettingsCard title="Ajuda">
        <SettingsItem
          icon={Accessibility}
          label="Acessibilidade"
          onPress={() => navigation.navigate('Acessibilidade')}
        />
        <SettingsItem
          icon={HelpCircle}
          label="Suporte"
          onPress={() => navigation.navigate('Suporte')}
        />
      </SettingsCard>

      {/* 🔹 Modal de Troca de Perfil */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.title}>Contas</Text>

            {contas.length > 0 ? (
              <View style={styles.contasBox}>
                {contas.map((conta, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contaItem}
                    onPress={() => console.log(`Selecionou ${conta.nome}`)}
                  >
                    <Text style={styles.contaNome}>{conta.nome}</Text>
                    <Text style={styles.contaEmail}>{conta.email}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addConta}>
                  <PlusCircle color="#007b33" size={18} />
                  <Text style={styles.addContaText}>Adicionar uma conta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.semConta}>Nenhuma conta cadastrada.</Text>
            )}

            <TouchableOpacity style={styles.botaoPrimario}>
              <Text style={styles.textoBotao}>Criar uma nova conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoSecundario}>
              <Text style={styles.textoBotao}>Sair da conta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.fechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  contasBox: {
    borderWidth: 1,
    borderColor: '#007b33',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  contaItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  contaNome: {
    fontWeight: '600',
    color: '#333',
  },
  contaEmail: {
    color: '#777',
    fontSize: 13,
  },
  addConta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  addContaText: {
    color: '#007b33',
    fontWeight: '600',
  },
  botaoPrimario: {
    backgroundColor: '#007b33',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoSecundario: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotao: {
    color: '#000',
    fontWeight: '600',
  },
  semConta: {
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  fechar: {
    color: '#007b33',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ConfiguracoesView;
