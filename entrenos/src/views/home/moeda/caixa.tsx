import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator // Import ActivityIndicator for loading state
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../Routes';
import Header from '../../../components/header/header'; 
import Buttongeneric from '../../../components/buttons/buttongeneric';
import CardBase from '../../../components/cards/cardbase';
import ActivityItem from '../../../components/ActivityItem';
import { getCarteira, getTransacoes } from '../../../services/moeda';
import { Carteira, Transacao } from '../../../types/moeda';

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

const { width } = Dimensions.get('window');

const FluxoCaixaScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carteiraData, transacoesData] = await Promise.all([
          getCarteira(),
          getTransacoes(),
        ]);
        setCarteira(carteiraData);
        setTransacoes(transacoesData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados.');
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => navigation.goBack();
  const handleExtrato = () => navigation.navigate('EXTRATO');
  const handleCopyPix = () => console.log('Copiar Pix');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header (Seu Componente) */}
      <Header 
        title="Fluxo de Caixa e Moedas" 
        showBackButton={true} 
        onBackPress={handleBack} 
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando dados da carteira...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={32} color={COLORS.red} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorTip}>Tente novamente mais tarde.</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

        {/* 2. Saldo em Reais */}
        <CardBase style={styles.cardSpacing}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
              <FontAwesome5 name="money-bill-wave" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}> Saldo em Reais (R$)</Text>
            </View>
            <Text style={styles.labelSmall}>Você tem:</Text>
            <Text style={styles.valueLarge}>R$ {carteira?.saldo_dinheiro ? parseFloat(carteira.saldo_dinheiro).toFixed(2).replace('.', ',') : '0,00'}</Text>
          </View>
        </CardBase>

        {/* 3. Saldo de Moedas */}
        <CardBase style={styles.cardSpacing}>
          <View style={styles.cardContent}>
            <View style={[styles.cardHeaderRow, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="wallet" size={20} color={COLORS.primary} />
                <Text style={styles.cardTitle}> Saldo de Moedas (App)</Text>
              </View>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.secondary} />
            </View>
            
            <View style={styles.coinsRow}>
              <FontAwesome5 name="coins" size={32} color={COLORS.secondary} style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.labelSmall}>Você tem:</Text>
                <Text style={styles.valueLarge}>{carteira?.saldo_moeda ? parseInt(carteira.saldo_moeda).toLocaleString('pt-BR') : '0'} Moedas</Text>
              </View>
            </View>
          </View>
        </CardBase>

        {/* 4. Atividade Recente */}
        <CardBase style={styles.cardSpacing}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
              <FontAwesome5 name="exchange-alt" size={18} color={COLORS.primary} />
              <Text style={styles.cardTitle}> Atividade Recente</Text>
            </View>

            {/* Lista de Atividades */}
            <View style={styles.activityList}>
              {transacoes.length > 0 ? (
                transacoes.slice(0, 5).map((transacao) => (
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
                <Text style={styles.noActivityText}>Nenhuma atividade recente encontrada.</Text>
              )}
            </View>

            {/* Botão Ver Extrato (Seu Componente) */}
            <Buttongeneric 
              title="Ver Extrato Completo" 
              onPress={handleExtrato} 
              leftIcon={<MaterialCommunityIcons name="history" size={20} color="white" />}
              style={{ marginTop: 15, backgroundColor: COLORS.primary }}
            />
          </View>
        </CardBase>

        {/* 5. Entradas (Ganhos) e Pix */}
        <CardBase style={styles.cardSpacing}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="arrow-down-outline" size={22} color={COLORS.primary} />
              <Text style={styles.cardTitle}> Entradas (Ganhos)</Text>
            </View>
            
            <Text style={styles.descriptionText}>
              Veja como seu dinheiro e suas moedas estão entrando:
            </Text>

            <View style={styles.bulletPoints}>
               <BulletPoint title="Vendas de Produtos" text="Receba em Reais pelas suas delícias!" />
               <BulletPoint title="Bônus Diário (App)" text="Ganhe Moedas só por usar o app!" />
               <BulletPoint title="Indicação de Amigo (App)" text="Convide e seja recompensado!" />
               <BulletPoint title="Recarga de Moedas" text="Compre Moedas com Reais via Pix" />
            </View>

            <View style={styles.divider} />

            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons name="qrcode-scan" size={20} color={COLORS.secondary} />
              <Text style={[styles.cardTitle, { color: COLORS.textDark }]}> Recarregar Moedas (via Pix)</Text>
            </View>
            <Text style={styles.pixInstruction}>Use o Pix para adicionar mais moedas à sua carteira do app.</Text>

            {/* Placeholder do QR Code */}
            <View style={styles.qrCodeContainer}>
               <Ionicons name="qr-code-outline" size={100} color="#000" />
            </View>
            
            <Text style={styles.pixLabel}>Código Pix para Recarga:</Text>
            <View style={styles.pixCodeBox}>
              <Text style={styles.pixCodeText} numberOfLines={1}>codigopixdoceriadaana1234567890</Text>
            </View>

            {/* Botão Copiar (Seu Componente) */}
            <Buttongeneric 
              title="Copiar Código Pix" 
              onPress={handleCopyPix} 
              style={{ backgroundColor: COLORS.secondary, marginTop: 10 }}
              leftIcon={<Ionicons name="copy-outline" size={18} color="white" />}
            />
          </View>
        </CardBase>

        {/* 6. Usar Moedas */}
        <CardBase style={[styles.cardSpacing, { marginBottom: 80 }]}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
              <FontAwesome5 name="coins" size={18} color={COLORS.primary} />
              <Text style={styles.cardTitle}> Usar Moedas (App)</Text>
            </View>
            <Text style={styles.descriptionText}>Gaste suas moedas em vantagens exclusivas do app.</Text>

            <View style={styles.coinActionContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.coinActionTitle}>Promover Campanha</Text>
                <Text style={styles.coinActionDesc}>Promova suas campanhas de marketing.</Text>
              </View>
              <View style={styles.coinBadge}>
                <Text style={styles.coinBadgeText}>200 Moedas</Text>
              </View>
            </View>

            <View style={styles.coinActionContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.coinActionTitle}>Desbloquear Recurso Premium</Text>
                <Text style={styles.coinActionDesc}>Acesso a ferramentas avançadas.</Text>
              </View>
              <View style={styles.coinBadge}>
                <Text style={styles.coinBadgeText}>500 Moedas</Text>
              </View>
            </View>

          </View>
        </CardBase>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// --- SUB-COMPONENTES AUXILIARES (Para manter o arquivo organizado) ---

const BulletPoint = ({ title, text }: any) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletDot}>•</Text>
    <Text style={styles.bulletText}>
      <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{title}: </Text>
      {text}
    </Text>
  </View>
);

// --- ESTILOS ESPECÍFICOS DA TELA ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: 20,
  },
  cardSpacing: {
    marginBottom: 16,
    padding: 16, // Padding interno do CardBase
  },
  cardContent: {
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginLeft: 8,
  },
  labelSmall: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 4,
  },
  valueLarge: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 2,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  // Atividade Recente Styles
  activityList: {
    marginTop: 10,
  },
  // Entradas Styles
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  bulletPoints: {
    marginBottom: 15,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  bulletDot: {
    fontSize: 18,
    color: COLORS.textDark,
    marginRight: 6,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 13,
    color: '#444',
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  pixInstruction: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  qrCodeContainer: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#FAFAFA'
  },
  pixLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  pixCodeBox: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  pixCodeText: {
    color: '#555',
    textAlign: 'center',
    fontSize: 12,
  },
  // Usar Moedas Styles
  coinActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  coinActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  coinActionDesc: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  coinBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  coinBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Mock TabBar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  noActivityText: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
    paddingVertical: 20,
  }
});

export default FluxoCaixaScreen;