import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const MOCK_MESSAGES = [
  { id: '1', text: 'Olá, gostaria de saber se o bolo red velvet está disponível', sender: 'them', time: '08:36' },
  { id: '2', text: 'Olá! Está sim, os bolos são feitos por encomenda', sender: 'me', time: '08:39' },
  { id: '3', text: 'Perfeito! Vou querer pedir um', sender: 'them', time: '08:40' },
  { id: '4', text: 'Ótimo! levará 4 horas para ser entregue', sender: 'me', time: '08:41' },
  { id: '5', text: 'Perfeito então, obrigada!', sender: 'them', time: '08:42' },
];

export default function ChatDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user } = route.params || { user: { name: 'Chat', avatar: 'https://i.pravatar.cc/150' } };

  const [messageText, setMessageText] = useState('');

  const renderMessage = ({ item }: any) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.messageText, isMe ? styles.textMe : styles.textThem]}>{item.text}</Text>
          <Text style={[styles.timeText, isMe ? styles.textMeTime : styles.textThemTime]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 15}}>
                <Ionicons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
            <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
            <Text style={styles.headerName}>{user.name}</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 20 }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
        <View style={styles.inputContainer}>
            <View style={styles.inputField}>
                <TouchableOpacity><Feather name="smile" size={24} color="#999" /></TouchableOpacity>
                <TextInput 
                    style={styles.input} 
                    placeholder="Escreva algo..." 
                    value={messageText}
                    onChangeText={setMessageText}
                />
                <TouchableOpacity><Feather name="paperclip" size={24} color="#999" /></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={20} color="#FFF" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    backgroundColor: '#1B5E20',
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#FFF' },
  headerName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginBottom: 5 },
  messageRow: { marginBottom: 15, width: '100%' },
  messageRowMe: { alignItems: 'flex-end' },
  messageRowThem: { alignItems: 'flex-start' },
  bubble: { padding: 15, borderRadius: 15, maxWidth: '80%' },
  bubbleMe: { backgroundColor: '#0D1F47', borderTopRightRadius: 0 },
  bubbleThem: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFD54F', borderTopLeftRadius: 0 },
  messageText: { fontSize: 16 },
  textMe: { color: '#FFF' },
  textThem: { color: '#0D1F47' },
  timeText: { fontSize: 10, alignSelf: 'flex-end', marginTop: 5 },
  textMeTime: { color: '#CCC' },
  textThemTime: { color: '#999' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', alignItems: 'center', paddingBottom: 20 },
  inputField: { flex: 1, flexDirection: 'row', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center', marginRight: 10 },
  input: { flex: 1, marginHorizontal: 10 },
  sendButton: { backgroundColor: '#FFA000', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
});