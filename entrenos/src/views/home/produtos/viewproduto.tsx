import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image, TextInput,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, AuthStackParamList } from '../../../Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { getProdutosAnalytics, getProdutos } from '../../../services/produto';
import CardBase from '@/src/components/cards/cardbase'; // Seu componente CardBase
import { typography, cor_terciaria, cor_secundaria } from '@/src/global';
import Header from '@/src/components/header/header';
import { Produto } from '../../../types/produto';

const { width,height } = Dimensions.get("window");

type ProdutoScreenNav = NativeStackNavigationProp<AuthStackParamList>;

const ProdutoScreem = () => {
  const navigation = useNavigation<ProdutoScreenNav>();

  const goToCreate = () => {
    navigation.navigate(ROUTES.CREATEPRODUTO);
  };

  // Ação ao clicar no Card de Resumo (Topo)
  const handleSummaryPress = () => {
    console.log("Clicou no resumo do estoque");
  };

  // Ação ao clicar em um Produto da lista
  const handleProductPress = (produto: Produto) => {
    navigation.navigate(ROUTES.CREATEPRODUTO, {produto} );
  };

  const [analytics, setAnalytics] = useState<{
    total_produtos: number;
    estoque_baixo: number;
    produto_mais_vendido: any | null;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [listproduto, setlistproduto] = useState<Produto[]>([]); 
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [produtosData, analyticsData] = await Promise.all([
          getProdutos(),
          getProdutosAnalytics()
        ]);
        
        if (Array.isArray(produtosData)) {
            setlistproduto(produtosData);
        } else {
            console.log("Formato de dados inesperado", produtosData);
        }

        setAnalytics(analyticsData);
      } catch (error) {
        console.log('Erro ao carregar dados', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProdutos = listproduto.filter(item => 
    item.results.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  // --- Header da LISTA (Abaixo do card fixo) ---
  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
        {/* Título da Seção de Produtos */}
        <View style={styles.sectionTitleContainer}>
            <Icon name="cubes" size={25} color="#2E7D32" /> 
            <Text style={styles.sectionTitle}>Seus Produtos</Text>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
            <Icon name="search" size={18} color="#002147" style={styles.searchIcon} />
            <TextInput 
                style={styles.searchInput}
                placeholder="pesquisar"
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
    </View>
  );

  // --- Item da Lista usando CARDBASE ---
  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.cardWrapper}>
        <TouchableOpacity 
                style={styles.productTouchArea} 
                onPress={() => handleProductPress(item)}
                activeOpacity={0.7}
            >
        <CardBase width="100%" style={[styles.paddingcard, styles.cardItem]}>
            
                {/* Conteúdo do Produto (Layout Row) */}
                <View style={styles.productRow}>
                    <Image 
                        source={{ uri: item.results.imagem || 'https://via.placeholder.com/100' }} 
                        style={styles.productImage} 
                        resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>{item.results.nome}</Text>
                        <Text style={styles.productCode}>ID: {item.id}</Text> 
                        <Text style={styles.productQty}>{item.results.quantidade} qtd</Text>
                    </View>
                    <View style={styles.productPriceContainer}>
                        <Text style={styles.productPrice}>
                            R$ {item.results.preco}
                        </Text>
                    </View>
                </View>
            
        </CardBase>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title='Produtos' showBackButton={true} onBackPress={navigation.goBack} />
    
      {loading ? (
        <View style={styles.loadingContainer}>
            <Text>Carregando...</Text>
        </View>
      ) : (
        <>
            {/* --- ÁREA FIXA (Card de Resumo) --- */}
            <View style={styles.fixedHeaderArea}>
                <TouchableOpacity activeOpacity={0.9} onPress={handleSummaryPress}>
                    <CardBase width={'100%'} style={styles.padding}>
                        <View style={styles.cardContent}>
                            <View style={styles.titleContainer}>
                                <Icon name="pie-chart" size={20} color="#2E7D32" />
                                <Text style={styles.cardTitle}>Visão Geral</Text>
                            </View>
                            <View style={styles.statsContainer}>
                                <View style={[styles.statItem, styles.statItemCenter]}>
                                    <Text style={styles.statLabel}>Total</Text>
                                    <Text style={styles.statValueNum}>{analytics?.total_produtos ?? 0}</Text>
                                </View>
                                <View style={[styles.statItem, styles.statItemCenter]}>
                                    <Text style={styles.statLabel}>Baixo</Text>
                                    <Text style={styles.statValueNum}>{analytics?.estoque_baixo ?? 0}</Text>
                                </View>
                                <View style={[styles.statItem, styles.statItemCenter]}>
                                    <Text style={styles.statLabel}>Top Venda</Text>
                                    <Text style={styles.statValueNum}>
                                        {analytics?.produto_mais_vendido ? analytics.produto_mais_vendido.nome : "-"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </CardBase>
                </TouchableOpacity>
                {renderListHeader()}
            </View>
            

            {/* --- ÁREA DE LISTAGEM --- */}
            <FlatList
                data={filteredProdutos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
                keyboardShouldPersistTaps="handled"

                
            />
        </>
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  // --- Área Fixa ---
  fixedHeaderArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5, // Pequeno espaço antes da lista começar
  },

  // --- Lista ---
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 20, // Mantém a margem lateral para a lista toda
  },
  listHeaderContainer: {
    paddingTop: 10,
    marginBottom: 10,
  },

  // --- Card de Resumo (Interno) ---
  cardContent: { padding: 10 }, // Reduzi um pouco o padding interno
  titleContainer: { ...typography.h1, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { ...typography.h2, color: cor_secundaria, marginLeft: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: {},
  statItemCenter: { alignItems: 'center' },

  statLabel: { ...typography.p, color: cor_secundaria, marginBottom: 2 },
  statValueNum: { ...typography.h1, color: cor_secundaria, },
  statValueText: { fontSize: 14, fontWeight: 'bold', color: '#002147', textAlign: 'right', maxWidth: 90 },

  // --- Seção de Título e Busca ---
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002147',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  // --- Item Produto (Dentro do CardBase) ---
  cardWrapper: {
    marginBottom: 12, // Espaço vertical entre os cards da lista
  },
  productTouchArea: {
   
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: '30%',
    height: height*0.09,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 2,
  },
  productCode: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  productQty: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cor_terciaria,
  },
  productPriceContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  // --- FAB ---
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: cor_terciaria,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 34,
  },
  padding :{
    padding:20

  },
  paddingcard:{
    padding:12
  },
  cardItem: {
  minHeight: height*0.12,  
  justifyContent: "center",
}
});

export default ProdutoScreem;