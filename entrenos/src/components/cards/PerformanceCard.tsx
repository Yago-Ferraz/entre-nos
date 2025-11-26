import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardBase from './cardbase'; // Ajuste o caminho conforme sua estrutura
import { 
  typography, 
  cor_secundaria, 
  cor_terciaria, 
  cinza, 
  FONT_SIZE, 
  FONT_FAMILY 
} from '@/src/global'; // Ajuste o caminho da importação

interface PerformanceCardProps {
  vendasSemana: number;
  variacaoSemana: string; // ex: "-11%"
  produtoMaisVendido: string;
  porcentagemProduto: string; // ex: "80%"
  mediaDiaria: number;
  onPress?: () => void;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  vendasSemana,
  variacaoSemana,
  produtoMaisVendido,
  porcentagemProduto,
  mediaDiaria,
  onPress
}) => {

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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
          <Text style={styles.value}>{vendasSemana} Vendas</Text>
          <Text style={styles.subText}>{variacaoSemana} semana passada</Text>
        </View>

        {/* Coluna 2: Produto */}
        <View style={styles.column}>
          <Text style={styles.label}>Mais Vendido:</Text>
          <Text style={styles.value} numberOfLines={1}>{produtoMaisVendido}</Text>
          <Text style={styles.subText}>{porcentagemProduto} das vendas</Text>
        </View>

        {/* Coluna 3: Média */}
        <View style={styles.column}>
          <Text style={styles.label}>Média Diária:</Text>
          <Text style={styles.value}>{formatCurrency(mediaDiaria)}</Text>
          <Text style={styles.subText}>por dia esta semana</Text>
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
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    ...typography.p, // Usando o estilo de parágrafo padrão
    color: cor_secundaria,
  }
});

export default PerformanceCard;