import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, AuthStackParamList } from '../../../Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { getProdutosAnalytics } from '../../../services/produto';
import CardBase from '@/src/components/cards/cardbase';
import { typography, cor_terciaria,cor_secundaria } from '@/src/global';
import Header from '@/src/components/header/header';
type ProdutoScreenNav = NativeStackNavigationProp<AuthStackParamList>;

const ProdutoScreem = () => {
  const navigation = useNavigation<ProdutoScreenNav>();

  const goToCreate = () => {
    navigation.navigate(ROUTES.CREATEPRODUTO);
  };
  const [analytics, setAnalytics] = useState<{
    total_produtos: number;
    estoque_baixo: number;
    produto_mais_vendido: any | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getProdutosAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.log("Erro ao carregar analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <View style={styles.container}>
      <Header title='Produtos' showBackButton={true} onBackPress={navigation.goBack}></Header>
    
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <View style={styles.margin}>
        <CardBase width={'90%'}>
          {/* Este é o novo conteúdo do card */}
          <View style={styles.cardContent}>
            
            {/* Título do Card */}
            <View style={styles.titleContainer}>
              <Icon name="pie-chart" size={20} color="#2E7D32" />
              <Text style={styles.title}>Visão Geral do Estoque</Text>
            </View>

            {/* Container dos Stats */}
            <View style={styles.statsContainer}>
              
              {/* Stat: Total de Produtos */}
              <View style={[styles.statItem, styles.statItemCenter]}>
                <Text style={styles.statLabel}>Total de Produtos:</Text>
                <Text style={styles.statValueNum}>
                  {analytics?.total_produtos ?? 0}
                </Text>
              </View>

              {/* Stat: Baixo Estoque */}
              <View style={[styles.statItem, styles.statItemCenter]}>
                <Text style={styles.statLabel}>Baixo Estoque:</Text>
                <Text style={styles.statValueNum}>
                  {analytics?.estoque_baixo ?? 0}
                </Text>
              </View>

              {/* Stat: Mais Vendidos */}
              <View style={[styles.statItem, styles.statItemCenter]}>
                <Text style={styles.statLabel}>Mais Vendidos:</Text>
                <Text style={styles.statValueText}>
                  {analytics?.produto_mais_vendido 
                    ? analytics.produto_mais_vendido.nome 
                    : "N/A"}
                </Text>
                
              </View>

            </View>
          </View>
        </CardBase>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={goToCreate}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
    
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Removi para alinhar ao topo
    alignItems: 'center', // Centraliza o card na horizontal
    paddingTop: 20, // Adiciona um espaço no topo
    backgroundColor: '#f5f5f5', // Um fundo para a tela
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: cor_terciaria, // Cor laranja do botão na imagem
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Sombra mais forte
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 34, 
  },

  // --- Novos Estilos para o Card ---
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Espaço entre o título e os números
  },
  title: {
    ...typography.h2,
    color:cor_secundaria, // Cor escura para o título
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statItem: {
    // Cada item (coluna)
  },
  statItemCenter: {
    alignItems: 'center', // Alinha o item do meio ao centro
  },
  statItemEnd: {
    alignItems: 'flex-end', // Alinha o último item à direita
  },
  statLabel: {
    ...typography.p,
    color: cor_secundaria, // Cor cinza para o label
    marginBottom: 4,
  },
  statValueNum: {
    ...typography.h1,
    color: cor_secundaria, 
  },
  statValueText: {
    fontSize: 18, // Fonte um pouco menor para o texto
    fontWeight: 'bold',
    color: '#0056b3', // Cor azul para o produto mais vendido
    maxWidth: 120, // Evita que o nome quebre o layout
    textAlign: 'right', // Garante alinhamento
  },

  // Você pode remover este estilo se não for mais usado
  info: {
    fontSize: 18,
    marginBottom: 10
  },
  margin:{
    marginTop:20
  }
});

export default ProdutoScreem;