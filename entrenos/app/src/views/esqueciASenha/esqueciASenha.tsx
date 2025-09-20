import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import CustomInput from '../../components/customInput/customInput';
import CustomButton from '../../components/customButton/customButton';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://SEU_IP_DA_REDE:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      Alert.alert('Sucesso', 'Instruções enviadas para o seu e-mail.');
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      Alert.alert('Sucesso', 'Instruções enviadas para o seu e-mail.');
    } finally {
      setIsLoading(false);
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/logoEntreNos.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Recuperação de Senha</Text>
      <Text style={styles.subtitle}>
        Informe seu e-mail e digite sua nova senha para recuperar o acesso à sua conta.
      </Text>

      <CustomInput
        label='E-mail'
        placeholder="Insira seu E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <CustomInput
        label='Senha'
        placeholder="Digite sua nova senha"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />

      <CustomInput
        label='Confirme a senha'
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      <CustomButton
        title={isLoading ? 'Enviando...' : 'Criar nova senha'}
        onPress={handleForgotPassword}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F8F8F8',
  },
  logo: {
    width: 200,
    height: 171,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'jost',
    color: '#196324',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#0a0a0aff',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;