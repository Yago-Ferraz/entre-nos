import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Pressable } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { baseurl } from '../../services/api'; // Import baseurl

// Tipos de dados (ajuste se necessário)
interface Account {
  id: number;
  name: string;
  email: string;
  profileImage?: string; // Optional if there's a specific profile image
  empresa?: {
    logo?: string;
  };
}

interface AccountsModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentAccount: Account;
  onNavigate: (screen: string) => void;
}

// Item individual da conta dentro do modal
const AccountItem: React.FC<{ account: Account }> = ({ account }) => (
  <View style={styles.accountItem}>
    <Image 
      source={{ uri: `${baseurl}${account.empresa?.logo}` || account.profileImage || 'https://via.placeholder.com/40' }} // Fallback image
      style={styles.accountAvatar} 
    />
    <View style={styles.accountTextContainer}>
      <Text style={styles.accountName}>{account.name}</Text>
      <Text style={styles.accountEmail}>{account.email}</Text>
    </View>
  </View>
);


export const AccountsModal: React.FC<AccountsModalProps> = ({ 
  isVisible, 
  onClose, 
  currentAccount, 
  onNavigate 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true} onTouchEnd={(e) => e.stopPropagation()}>
          <View style={styles.modalHandle} />

          <Text style={styles.sectionTitle}>Gerenciar Conta</Text>

          <View style={styles.accountsListCard}>
            <AccountItem 
              account={currentAccount} 
            />
            
            <TouchableOpacity style={styles.addAccountButton} onPress={() => onNavigate('Login')}>
              <AntDesign name="pluscircle" size={24} color="#2F9E44" />
              <Text style={styles.addAccountText}>adicionar uma conta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.actionButton, styles.createButton]} 
            onPress={() => onNavigate('CriarNovaConta')}
          >
            <Text style={styles.createButtonText}>Criar uma nova conta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]} 
            onPress={() => onNavigate('SairDaConta')}
          >
            <Text style={styles.logoutButtonText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

// 🔴 Estilos para o AccountsModal (src/components/AccountsModal/styles.ts)
export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
  },
  modalContent: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    maxHeight: '80%', // Limita a altura do modal
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  
  // Estilos da Lista de Contas
  accountsListCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  accountTextContainer: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
  },
  
  // Botão Adicionar Conta
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addAccountText: {
    color: '#2F9E44',
    marginLeft: 10,
    fontWeight: 'bold',
  },

  // Estilos dos Botões de Ação
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  createButton: {
    backgroundColor: '#2F9E44',
    borderColor: '#2F9E44',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    borderColor: '#2F9E44',
  },
  logoutButtonText: {
    color: '#2F9E44',
    fontSize: 16,
    fontWeight: 'bold',
  },
});