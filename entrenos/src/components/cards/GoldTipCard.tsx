import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- IMPORTAÇÃO DOS SEUS COMPONENTES ---
import CardBase from '@/src/components/cards/cardbase'; // Ajuste o caminho se necessário
import Buttongeneric from '@/src/components/buttons/buttongeneric'; // Ajuste o caminho se necessário

// --- ESTILOS GLOBAIS ---
import { 
  cor_secundaria, 
  cor_terciaria, 
  cor_primaria, 
  typography,
  FONT_FAMILY,
  FONT_SIZE,
  cor_backgroud,
} from '@/src/global';

interface GoldTipCardProps {
  tipText: string;
  onNewTipPress?: () => void;
}

const GoldTipCard: React.FC<GoldTipCardProps> = ({ 
  tipText, 
  onNewTipPress 
}) => {
  return (
    <CardBase style={styles.goldTipCard}>
      {/* Cabeçalho */}
      <View style={styles.goldTipHeader}>
        <MaterialCommunityIcons name="asterisk" size={24} color={cor_terciaria} />
        <Text style={styles.goldTipTitle}>Dica de Ouro do Dia</Text>
      </View>

      {/* Caixa de Texto com a Borda Lateral */}
      <View style={styles.tipBox}>
        <Text style={styles.tipBoxText}>
          {tipText}
        </Text>
      </View>

      {/* Botão Nova Dica */}
      <Buttongeneric 
        title="Nova Dica"
        onPress={onNewTipPress || (() => console.log('Nova dica solicitada'))}
        variant="primary"
        style={styles.refreshButton}
        textStyle={{ color: '#FFF', fontSize: FONT_SIZE.XS, fontFamily: FONT_FAMILY.JOST_MEDIUM }}
        leftIcon={<MaterialCommunityIcons name="refresh" size={FONT_SIZE.MD} color="#FFF" style={{ marginRight: 6 }} />}
      />
    </CardBase>
  );
};

const styles = StyleSheet.create({
  goldTipCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  goldTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  goldTipTitle: {
    ...typography.h3,
    color: cor_secundaria,
    marginLeft: 8,
    fontFamily: FONT_FAMILY.JOST_BOLD,
  },
  tipBox: {
    backgroundColor: cor_backgroud,
    width: '100%',
    padding: 16,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: cor_secundaria,
    marginBottom: 20,
  },
  tipBoxText: {
    ...typography.p,
    color: cor_secundaria,
    fontSize: FONT_SIZE.XS,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.JOST_REGULAR,
  },
  refreshButton: {
    backgroundColor: cor_primaria,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    height: 36,
    width: 'auto',
    alignSelf: 'center',
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default GoldTipCard;