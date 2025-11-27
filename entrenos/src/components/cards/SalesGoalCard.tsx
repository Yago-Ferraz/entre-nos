import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import CardBase from './cardbase'; // VERIFIQUE O CAMINHO CORRETO PARA SEU CardBase
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cor_primaria, cor_terciaria, typography } from '@/src/global';
import { updateMeta, getDashboard } from '../../services/lojaService';

const textWhite = '#FFFFFF';

interface SalesGoalCardProps {
  refreshKey?: number; // Optional prop to trigger refresh
}

const SalesGoalCard: React.FC<SalesGoalCardProps> = ({ refreshKey }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState('0');
  const [currentGoal, setCurrentGoal] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const fetchData = async () => {
    try {
      const data = await getDashboard();
      setCurrentValue(parseFloat(data.vendas_hoje) || 0);
      setCurrentGoal(data.meta || 0);
      setNewGoal(String(data.meta || 0));
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      // Optionally show an alert to the user
      // Alert.alert('Erro', 'Não foi possível carregar os dados de vendas.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleUpdateGoal = async () => {
    const goal = parseFloat(newGoal);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('Valor Inválido', 'Por favor, insira um valor numérico positivo para a meta.');
      return;
    }

    try {
      await updateMeta(goal);
      setCurrentGoal(goal); // Optimistic update
      setModalVisible(false);
      fetchData(); // Refresh data from server
      Alert.alert('Sucesso', 'Sua meta de vendas foi atualizada.');
    } catch (error) {
      console.error('Erro ao atualizar a meta:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a meta. Tente novamente.');
    }
  };

  const percentageRaw = currentGoal > 0 ? (currentValue / currentGoal) * 100 : 0;
  const percentage = Math.min(percentageRaw, 100);
  const isGoalReached = currentValue >= currentGoal && currentGoal > 0;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <CardBase style={styles.cardOverride}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerTitle}>Vendas de Hoje</Text>

        <View style={styles.valuesRow}>
          <View>
            <Text style={styles.labelText}>Total:</Text>
            <Text style={styles.valueTextLarge}>{formatCurrency(currentValue)}</Text>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.labelText}>Meta Diária:</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.valueTextSmall}>{formatCurrency(currentGoal)}</Text>
                <MaterialCommunityIcons name="pencil-outline" size={14} color="rgba(255, 255, 255, 0.7)" style={{marginLeft: 5}}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>

        {isGoalReached && (
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Meta diária batida! </Text>
            <MaterialCommunityIcons name="party-popper" size={14} color={cor_terciaria} />
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Atualizar Meta Diária</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewGoal}
              value={newGoal}
              keyboardType="numeric"
              placeholder="Digite o novo valor da meta"
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#666" />
              <Button title="Salvar" onPress={handleUpdateGoal} />
            </View>
          </View>
        </View>
      </Modal>
    </CardBase>
  );
};

const styles = StyleSheet.create({
  cardOverride: {
    backgroundColor: cor_primaria,
    borderRadius: 14, 
    paddingBottom:20
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    ...typography.h2,
    color: textWhite,
    marginBottom: 18,
  },
  valuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
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
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: cor_terciaria,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    ...typography.p,
    color: textWhite,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default SalesGoalCard;