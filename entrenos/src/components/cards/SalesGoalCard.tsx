import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardBase from './cardbase'; // VERIFIQUE O CAMINHO CORRETO PARA SEU CardBase
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cor_primaria, cor_terciaria, typography } from '@/src/global';

const textWhite = '#FFFFFF';

interface SalesGoalCardProps {
  currentValue: number;
  goalValue: number;
}

const SalesGoalCard: React.FC<SalesGoalCardProps> = ({ currentValue, goalValue }) => {
  // Cálculo da porcentagem (limitado a 100% visualmente)
  const percentageRaw = (currentValue / goalValue) * 100;
  const percentage = Math.min(percentageRaw, 100);
  const isGoalReached = currentValue >= goalValue;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    // O CardBase recebe o estilo que sobrescreve a cor de fundo padrão
    <CardBase style={styles.cardOverride}>
      <View style={styles.contentContainer}>
        {/* Título Principal */}
        <Text style={styles.headerTitle}>Vendas de Hoje</Text>

        {/* Seção de Valores */}
        <View style={styles.valuesRow}>
          {/* Bloco da Esquerda (Total) */}
          <View>
            <Text style={styles.labelText}>Total:</Text>
            <Text style={styles.valueTextLarge}>{formatCurrency(currentValue)}</Text>
          </View>

          {/* Bloco da Direita (Meta) - Alinhado à direita */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.labelText}>Meta Diária:</Text>
            <Text style={styles.valueTextSmall}>{formatCurrency(goalValue)}</Text>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>

        {/* Rodapé (Meta Batida) */}
        {isGoalReached && (
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Meta diária batida! </Text>
            <MaterialCommunityIcons name="party-popper" size={14} color={cor_terciaria} />
          </View>
        )}
      </View>
    </CardBase>
  );
};

const styles = StyleSheet.create({
  // Estilo que sobrescreve o CardBase
  cardOverride: {
    backgroundColor: cor_primaria,
    // O CardBase já tem borderRadius: 12, mas se quiser forçar mais arredondado como na img_1:
    borderRadius: 14, 
    paddingBottom:20
  },
  // Padding interno do conteúdo
  contentContainer: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    ...typography.h2,
    color: textWhite,
    marginBottom: 18, // Espaço grande abaixo do título
  },
  valuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Alinha os valores pela base
    marginBottom: 16, // Espaço entre valores e a barra
  },
  labelText: {
    ...typography.p,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  valueTextLarge: {
    ...typography.h2,
    color: textWhite,
  },
  valueTextSmall: {
    ...typography.h3,
    color: textWhite,
  },
  // O "trilho" da barra (fundo mais escuro)
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4, // Bordas arredondadas
    width: '100%',
    overflow: 'hidden', // Garante que o preenchimento não vaze as bordas arredondadas
  },
  // O preenchimento laranja
  progressBarFill: {
    height: '100%',
    backgroundColor: cor_terciaria,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinhado à direita
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    ...typography.p,
    color: textWhite,
  },
});

export default SalesGoalCard;