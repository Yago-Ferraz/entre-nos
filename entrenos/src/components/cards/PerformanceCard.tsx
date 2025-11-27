import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardBase from './cardbase';
import {
  typography,
  cor_secundaria,
  cor_terciaria,
  cinza,
} from '@/src/global';
import { DashboardStats } from '../../types/loja'; // Adjust path

interface PerformanceCardProps {
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  onPress?: () => void;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  dashboardStats,
  loading,
  error,
  onPress
}) => {
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return 'N/A';
    }
    return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <CardBase style={styles.container} width="100%">
        <ActivityIndicator size="large" color={cor_secundaria} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </CardBase>
    );
  }

  if (error) {
    return (
      <CardBase style={styles.container} width="100%">
        <Text style={styles.errorText}>Erro: {error}</Text>
      </CardBase>
    );
  }

  if (!dashboardStats) {
    return (
      <CardBase style={styles.container} width="100%">
        <Text style={styles.errorText}>Nenhum dado disponível.</Text>
      </CardBase>
    );
  }

  return (
    <CardBase 
      style={styles.container} 
      onPress={onPress}
      width="100%"
    >
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name="chart-timeline-variant" 
          size={38} 
          color={cor_secundaria} 
          style={{ marginRight: 8 }}
        />
        <Text style={[typography.h2, { color: cor_secundaria }]}>
          Seu Desempenho
        </Text>
      </View>

      {/* --- Conteúdo (3 Colunas) --- */}
      <View style={styles.contentRow}>
        
        {/* Coluna 1: Vendas */}
        <View style={styles.column}>
          <Text style={styles.label}>Vendas da Semana:</Text>
          <Text style={styles.value}>{dashboardStats.vendas_semana.total_vendas}</Text>
          <Text style={styles.subText}>{dashboardStats.vendas_semana.percentual_variacao}% semana passada</Text>
        </View>

        {/* Coluna 2: Produto */}
        <View style={styles.column}>
          <Text style={styles.label}>Mais Vendido:</Text>
          <Text style={styles.value} numberOfLines={1}>{dashboardStats.produto_mais_vendido.nome}</Text>
          <Text style={styles.subText}>{dashboardStats.produto_mais_vendido.porcentagem_total}% das vendas</Text>
        </View>

        {/* Coluna 3: Média */}
        <View style={styles.column}>
          <Text style={styles.label}>Média Diária:</Text>
          <Text style={styles.value}>{formatCurrency(dashboardStats.media_diaria_semana.valor_medio_diario)}</Text>
          <Text style={styles.subText}>{dashboardStats.media_diaria_semana.periodo_referencia}</Text>
        </View>

      </View>

      {/* --- Footer --- */}
      <View style={styles.footer}>
        <MaterialCommunityIcons 
          name="lightbulb-on-outline" 
          size={18} 
          color={cor_terciaria} // Laranja/Amarelo
          style={{ marginRight: 6 }}
        />
        <Text style={styles.footerText}>
          clique no card e veja os detalhes
        </Text>
      </View>

    </CardBase>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF', // Garante fundo branco
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1, // Distribui o espaço igualmente
    paddingRight: 4, // Pequeno respiro entre colunas
    alignItems: 'center',
  },
  // Sobrescrevendo estilos globais para ajuste fino conforme a imagem
  label: {
    ...typography.cardLabel,
    color: cinza,
    marginBottom: 4,
  },
  value: {
    ...typography.h4, // Usando um estilo de título menor para o valor
    color: cor_secundaria,
    marginBottom: 4,
  },
  subText: {
    ...typography.cardLabel, // Reutilizando o estilo de label para consistência
    color: cinza,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    ...typography.p, // Usando o estilo de parágrafo padrão
    color: cor_secundaria,
  },
  loadingText: {
    ...typography.p,
    textAlign: 'center',
    marginTop: 10,
    color: cor_secundaria,
  },
  errorText: {
    ...typography.p,
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
  },
});

export default PerformanceCard;