import React, { useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Header from '../../components/header/header';
import { cor_primaria, cor_secundaria, typography } from '../../global';
import CardBase from '../../components/cards/cardbase';
import Buttongeneric from '../../components/buttons/buttongeneric';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LojaStackParamList } from '../../types/navigationTypes';

const { width, height } = Dimensions.get("window");

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Macarons Coloridos',
    description: 'Variedade de sabores e cores vibrantes.',
    price: 'R$ 8,00',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Cookies de Chocolate',
    description: 'Crocantes por fora, macios por dentro.',
    price: 'R$ 6,50',
    image: 'https://images.unsplash.com/photo-1499636138143-bd649043ea80?ixlib.rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Bolo de Cenoura',
    description: 'Clássico bolo de cenoura com cobertura.',
    price: 'R$ 60,00',
    image: 'https://images.unsplash.com/photo-1595103445371-a8ef96d66e51?ixlib.rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    name: 'Brigadeiro Gourmet',
    description: 'O tradicional doce em versão gourmet.',
    price: 'R$ 4,00',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?ixlib.rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
];

type ProductItemProps = {
  item: Product;
  navigation: any;
};

const ProductItem = ({ item, navigation }: ProductItemProps) => (
  <CardBase style={localStyles.productCard} width="48%" onPress={() => navigation.navigate('TelaProduto', { productId: item.id })}>
    <Image source={{ uri: item.image }} style={localStyles.productImage} />
    <View style={localStyles.productContent}>
      <Text style={localStyles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={localStyles.productDesc} numberOfLines={2}>{item.description}</Text>
      <Text style={localStyles.productPrice}>{item.price}</Text>
      
      <Buttongeneric 
        title="Adicionar ao Carrinho" 
        onPress={() => console.log('Add', item.name)}
        style={localStyles.addButton}
        textStyle={{ fontSize: 10 }}
      />
    </View>
  </CardBase>
);

type LojaScreenProps = NativeStackScreenProps<LojaStackParamList, 'TelaLoja'>;

export default function LojaScreen({ navigation }: LojaScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  React.useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = PRODUCTS.filter((product: Product) =>
      product.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  return (
    <View style={localStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={cor_primaria} />
      
      <Header 
        title="Loja" 
        showBackButton={true} 
        onBackPress={() => console.log('Voltar')}
      />

      <ScrollView contentContainerStyle={localStyles.scrollContent}> 
        
        <View style={localStyles.bannerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1559553156-2e97137af16f?ixlib.rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
            style={localStyles.bannerImage} 
          />
          <View style={localStyles.avatarContainer}>
             <View style={localStyles.avatarCircle}>
                <Text style={localStyles.avatarText}>doceria{'\n'}da ana</Text>
             </View>
          </View>
        </View>

        <CardBase style={localStyles.storeInfoCard} width="90%">
          <Text style={localStyles.storeName}>Doceria da Ana</Text>
          <Text style={localStyles.storeSubtitle}>
            Doces caseiros feitos com amor e carinho para adoçar o seu dia!
          </Text>
          
          <View style={localStyles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome key={star} name="star" size={16} color={cor_secundaria} style={{marginHorizontal: 2}} />
            ))}
            <Text style={localStyles.ratingText}>(4.8 - 250 avaliações)</Text>
          </View>

          <View style={localStyles.infoRow}>
            <Ionicons name="location-sharp" size={18} color={cor_primaria} style={localStyles.infoIcon} />
            <Text style={localStyles.infoText}>Rua das Delícias, 123 - Centro, Cidade</Text>
          </View>
          <View style={localStyles.infoRow}>
            <Ionicons name="time" size={18} color={cor_primaria} style={localStyles.infoIcon} />
            <Text style={localStyles.infoText}>Aberto: Seg-Sáb, 9h-18h</Text>
          </View>
          <View style={localStyles.infoRow}>
            <Ionicons name="call" size={18} color={cor_primaria} style={localStyles.infoIcon} />
            <Text style={localStyles.infoText}>(00) XXXX-XXXX</Text>
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
          {filteredProducts.map((item: Product) => (
            <ProductItem key={item.id} item={item} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  },
  avatarText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  storeInfoCard: {
    marginTop: -10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00296B',
    marginTop: 10,
  },
  storeSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginVertical: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
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
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00296B',
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 10,
    color: '#777',
    marginBottom: 6,
    height: 28,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
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
