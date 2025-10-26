import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, AuthStackParamList } from '../../../Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProdutoScreenNav = NativeStackNavigationProp<AuthStackParamList>;

const ProdutoScreem = () => {
    const navigation = useNavigation<ProdutoScreenNav>();

  const goToCreate = () => {
    navigation.navigate(ROUTES.CREATEPRODUTO); 
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo da tela */}

      <TouchableOpacity style={styles.fab} onPress={goToCreate}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
  },
});

export default ProdutoScreem;
