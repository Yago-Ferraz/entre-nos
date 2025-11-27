import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../Routes';
import Header from '../../../components/header/header';
import ActivityItem from '../../../components/ActivityItem';
import { getTransacoes } from '../../../services/moeda';
import { Transacao } from '../../../types/moeda';

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

const ExtratoScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransacoes();
        setTransacoes(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar extrato.');
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Extrato Completo"
        showBackButton={true}
        onBackPress={handleBack}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando extrato...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={32} color={COLORS.red} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorTip}>Não foi possível carregar seu extrato. Tente novamente.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {transacoes.length > 0 ? (
            transacoes.map((transacao) => (
              <ActivityItem
                key={transacao.id}
                title={transacao.tipo_operacao}
                date={new Date(transacao.created_at).toLocaleDateString('pt-BR')}
                value={`${transacao.valor_movimentado.startsWith('-') ? '-' : '+'} ${transacao.tipo_ativo === 'BRL' ? 'R$' : ''} ${parseFloat(transacao.valor).toFixed(2).replace('.', ',')} ${transacao.tipo_ativo === 'COIN' ? 'Moedas' : ''}`}
                color={transacao.valor_movimentado.startsWith('-') ? COLORS.red : COLORS.greenValid}
                barColor={transacao.valor_movimentado.startsWith('-') ? COLORS.red : COLORS.greenValid}
              />
            ))
          ) : (
            <View style={styles.noTransactionsContainer}>
              <MaterialCommunityIcons name="history" size={50} color={COLORS.textGray} />
              <Text style={styles.noTransactionsText}>Nenhuma transação encontrada ainda.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: Dimensions.get('window').width * 0.05,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.red,
    textAlign: 'center',
  },
  errorTip: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 5,
    textAlign: 'center',
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noTransactionsText: {
    fontSize: 16,
    color: COLORS.textGray,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default ExtratoScreen;
