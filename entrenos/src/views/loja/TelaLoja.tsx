import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Header from '../../components/header/header';
import { cor_primaria, cor_secundaria, typography, cor_terciaria, cor_backgroud, cor_vermelho, cinza, FONT_SIZE, FONT_FAMILY } from '../../global';
import CardBase from '../../components/cards/cardbase';
import Buttongeneric from '../../components/buttons/buttongeneric';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LojaStackParamList } from '../../types/navigationTypes';
import { getLojaDetails } from '../../services/lojaService';
import { LojaDetails, LojaProduto } from '../../types/loja';
import { useAuth } from '../../AuthContext';
import AlertMessage from '../../components/alertas/AlertMessage';

const { width, height } = Dimensions.get("window");

type ProductItemProps = {
  item: LojaProduto;
  navigation: any;
  onShowAlert: (alert: { message: string, type: 'success' | 'error' }) => void;
};

const ProductItem = ({ item, navigation, onShowAlert }: ProductItemProps) => (
  <CardBase style={localStyles.productCard} width="48%" onPress={() => navigation.navigate('TelaProduto', { productId: item.id })}>
    <Image source={{ uri: item.imagem }} style={localStyles.productImage} />
    <View style={localStyles.productContent}>
      <Text style={localStyles.productName} numberOfLines={2}>{item.nome}</Text>
      <Text style={localStyles.productDesc} numberOfLines={2}>{item.descricao}</Text>
      <Text style={localStyles.productPrice}>R$ {item.preco}</Text>
      
      <Buttongeneric 
        title="Adicionar ao Carrinho" 
        onPress={() => onShowAlert({ message: "Você não pode comprar seus próprios itens.", type: 'error' })}
        style={localStyles.addButton}
        textStyle={{ fontSize: 10 }}
      />
    </View>
  </CardBase>
);

type LojaScreenProps = NativeStackScreenProps<LojaStackParamList, 'TelaLoja'>;

export default function LojaScreen({ navigation }: LojaScreenProps) {
  const { user } = useAuth();
  const lojaId = user?.empresa?.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [lojaDetails, setLojaDetails] = useState<LojaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<LojaProduto[]>([]);
  const [alert, setAlert] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchLojaDetails = async () => {
      if (!lojaId) {
        setError('Você não possui uma loja cadastrada.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getLojaDetails(lojaId);
        
        setLojaDetails(data);
        if (data.produtos) {
          setFilteredProducts(data.produtos);
        }
        setError(null);
      } catch (e) {
        setError('Não foi possível carregar os detalhes da loja.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchLojaDetails();
  }, [lojaId]);

  useEffect(() => {
    if (lojaDetails && lojaDetails.produtos) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = lojaDetails.produtos.filter((product: LojaProduto) =>
        product.nome.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, lojaDetails]);

  if (loading) {
    return (
      <View style={[localStyles.container, localStyles.center]}>
        <ActivityIndicator size="large" color={cor_primaria} />
        <Text>Carregando sua loja...</Text>
      </View>
    );
  }

  if (error && !lojaDetails) {
    return (
      <View style={[localStyles.container, localStyles.center]}>
        <Text style={localStyles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!lojaDetails) {
    return (
        <View style={[localStyles.container, localStyles.center]}>
            <Text>Nenhum detalhe da loja encontrado.</Text>
        </View>
    );
  }
  
  const mainImage = lojaDetails.fotos && lojaDetails.fotos.length > 0 ? lojaDetails.fotos[0].imagem : 'https://images.unsplash.com/photo-1559553156-2e97137af16f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';


  return (
    <View style={localStyles.container}>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onHide={() => setAlert(null)}
        />
      )}
      <StatusBar barStyle="light-content" backgroundColor={cor_primaria} />
      
      <Header 
        title={'Loja'}
        showBackButton={false} 
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={localStyles.scrollContent}> 
        
        <View style={localStyles.bannerContainer}>
          <Image 
            source={{ uri: mainImage }} 
            style={localStyles.bannerImage} 
          />
          <View style={localStyles.avatarContainer}>
             <View style={localStyles.avatarCircle}>
                <Image source={{ uri: lojaDetails.logo }} style={localStyles.avatarImage} />
             </View>
          </View>
        </View>

        <CardBase style={localStyles.storeInfoCard} width="90%">
          <Text style={localStyles.storeName}>{lojaDetails.user.name}</Text>
          <Text style={localStyles.storeSubtitle}>
            {lojaDetails.descricao}
          </Text>
          
          <View style={localStyles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome key={index} name={index < lojaDetails.avaliacao ? "star" : "star-o"} size={16} color={cor_terciaria} style={{marginHorizontal: 2}} />
            ))}
            <Text style={localStyles.ratingText}>({typeof lojaDetails.avaliacao === 'number' ? lojaDetails.avaliacao.toFixed(1) : '0.0'})</Text>
          </View>

          <View style={localStyles.infoRow}>
            <Ionicons name="mail" size={18} color={cor_primaria} style={localStyles.infoIcon} />
            <Text style={localStyles.infoText}>{lojaDetails.user.email}</Text>
          </View>
          <View style={localStyles.infoRow}>
            <Ionicons name="call" size={18} color={cor_primaria} style={localStyles.infoIcon} />
            <Text style={localStyles.infoText}>{lojaDetails.user.phone}</Text>
          </View>
        </CardBase>

        <View style={localStyles.sectionContainer}>
          <Text style={localStyles.sectionTitle}>Itens</Text>
          
          <View style={localStyles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput 
              placeholder="pesquisar" 
              style={localStyles.searchInput}
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={localStyles.gridContainer}>
          {filteredProducts.map((item: LojaProduto) => (
            <ProductItem key={item.id} item={item} navigation={navigation} onShowAlert={setAlert} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cor_backgroud,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: cor_vermelho,
    fontSize: FONT_SIZE.MD,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  bannerContainer: {
    height: 150,
    position: 'relative',
    marginBottom: 50,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    zIndex: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFCDD2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  storeInfoCard: {
    marginTop: -10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  storeName: {
    ...typography.h2,
    fontSize: FONT_SIZE.LG,
    color: cor_secundaria,
    marginTop: 10,
  },
  storeSubtitle: {
    ...typography.p,
    color: cinza,
    textAlign: 'center',
    marginVertical: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    ...typography.p,
    color: cinza,
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  infoIcon: {
    width: 25,
    textAlign: 'center',
    marginRight: 5,
  },
  infoText: {
    ...typography.p,
    color: cinza,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: FONT_SIZE.LG,
    color: cor_secundaria,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  productCard: {
    marginBottom: 15,
    padding: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  productContent: {
    padding: 10,
  },
  productName: {
    fontFamily: FONT_FAMILY.JOST_BOLD,
    fontSize: 13,
    color: '#000',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 10,
    color: cinza,
    marginBottom: 6,
    height: 28,
  },
  productPrice: {
    fontFamily: FONT_FAMILY.JOST_BOLD,
    fontSize: 14,
    color: cor_primaria,
    marginBottom: 8,
  },
  addButton: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 20,
  },
});