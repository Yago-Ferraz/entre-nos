import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MOCK_CHATS = [
  { id: '1', name: 'Julia', lastMessage: 'Perfeito então, obrigada!', time: '08:42', avatar: 'https://i.pravatar.cc/150?img=5', unread: 1, type: 'normal' },
  { id: '2', name: 'Gustavo', lastMessage: 'Oi Ana, gostaria de encomendar...', time: '10:00', avatar: 'https://i.pravatar.cc/150?img=11', unread: 0, type: 'order' },
  { id: '3', name: 'D. Maria', lastMessage: 'Vamos formalizar seu negocio?', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?img=25', unread: 0, type: 'normal' },
  { id: '4', name: 'Paulo', lastMessage: 'Qual o valor do cento de docinhos?', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?img=33', unread: 1, type: 'normal' },
];

export default function ChatListScreen() {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState('Todas');

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.chatCard} 
      onPress={() => navigation.navigate('ChatDetail', { user: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.rowBetween}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
           {item.type === 'order' && <FontAwesome5 name="clipboard-list" size={12} color="#FFA000" style={{marginRight: 5}} />}
           <Text style={styles.lastMessage} numberOfLines={1}>
             {item.type === 'order' ? `Pedido #PED001 ${item.lastMessage}` : item.lastMessage}
           </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Verde */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
            <View style={{width: 28}} /> 
            <Text style={styles.headerTitle}>Conversas</Text>
            <View style={{width: 28}} />
        </View>
      </View>

      <View style={styles.body}>
        {/* Busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#0D1F47" />
          <TextInput placeholder="pesquisar" style={styles.searchInput} />
        </View>

        {/* Filtros */}
        <View style={styles.filterContainer}>
            {['Todas', 'Não Lidas', 'Pedidos'].map((f) => (
                <TouchableOpacity 
                    key={f} 
                    style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                    onPress={() => setFilter(f)}
                >
                    <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* Lista */}
        <FlatList
          data={MOCK_CHATS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    backgroundColor: '#1B5E20', 
    height: 110,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  body: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: { marginLeft: 10, flex: 1, color: '#333' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  filterButtonActive: { borderColor: '#1B5E20', borderWidth: 1.5 },
  filterText: { color: '#0D1F47', fontWeight: '500' },
  filterTextActive: { color: '#1B5E20', fontWeight: 'bold' },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  chatInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#0D1F47' },
  lastMessage: { color: '#888', fontSize: 14, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#FFA000', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});