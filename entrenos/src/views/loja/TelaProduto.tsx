import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardBase from '../../components/cards/cardbase';
import Buttongeneric from '../../components/buttons/buttongeneric';
import Header from '../../components/header/header';
import NextBackStepper from '../../components/buttons/NextBackStepper';
import { cor_primaria, cor_terciaria, typography, FONT_SIZE } from '../../global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LojaStackParamList } from '../../types/navigationTypes';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getProdutoById } from '../../services/produtoService';
import { ProdutoDetalhado } from '../../types/produto';
import { baseurl } from '../../services/api';
import AlertMessage from '../../components/alertas/AlertMessage';

type ProductDetailScreenRouteProp = RouteProp<LojaStackParamList, 'TelaProduto'>;
type ProductDetailScreenProps = NativeStackScreenProps<LojaStackParamList, 'TelaProduto'>;

export default function ProductDetailScreen({ navigation }: ProductDetailScreenProps) {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;

  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error"; } | null>(null);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProdutoById(productId);
        setProduto(data);
        setError(null);
      } catch (e) {
        setError('Não foi possível carregar o produto.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);


  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setAlert({ message: "Você não pode comprar seus próprios itens.", type: "error" });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={cor_primaria} />
        <Text>Carregando produto...</Text>
      </SafeAreaView>
    );
  }

  if (error || !produto) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
         <Header title="Erro" showBackButton={true} onBackPress={handleGoBack} />
        <Text style={styles.errorText}>{error || 'Produto não encontrado.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onHide={() => setAlert(null)}
        />
      )}
      <View style={styles.headerWrapper}>
         <Header title="Loja" showBackButton={true} onBackPress={handleGoBack} />
         <TouchableOpacity style={styles.cartIconHeader} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={24} color="#FFF" />
         </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.heroImageContainer}>
          <Image source={{ uri: produto.imagem.startsWith('http') ? produto.imagem : `${baseurl}${produto.imagem}` }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.ratingBadge}>
             <Text style={styles.ratingText}>4.8 ★</Text>
          </View>
         
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.productTitle, typography.h2]}>{produto.nome}</Text>
          <Text style={[styles.productDescription, typography.p]}>{produto.descricao}</Text>
          <Text style={[styles.productPrice, typography.h3]}>
            R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {produto.upsell_produtos && produto.upsell_produtos.length > 0 && (
          <View style={styles.crossSellSection}>
            <Text style={[styles.sectionTitle, typography.h4]}>Peça também!</Text>
            {produto.upsell_produtos.map((item) => (
              <CardBase key={item.id} style={styles.crossSellCard}>
                <View style={styles.cardContent}>
                  <Image source={{ uri:  item.imagem.startsWith('http') ? item.imagem : `${baseurl}${item.imagem}` }} style={styles.miniImage} />
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, typography.h4]}>{item.nome}</Text>
                    <Text style={styles.cardPrice}>
                      R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.addButtonMini} onPress={handleAddToCart}>
                    <Ionicons name="add" size={24} color={cor_primaria} />
                  </TouchableOpacity>
                </View>
              </CardBase>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.actionFooter}>
        <NextBackStepper value={quantity} scale={0.8} onChange={handleQuantityChange} />
        <Buttongeneric
          title="Adicionar"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          width="55%"
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: FONT_SIZE.MD,
    marginTop: 20,
  },
  headerWrapper: {
    backgroundColor: cor_primaria,
    height: 80,
    justifyContent: 'center',
    zIndex: 10,
  },
  cartIconHeader: {
    position: 'absolute',
    right: 20,
    top: '50%',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroImageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  productTitle: {
    color: '#002E5D',
    marginBottom: 8,
  },
  productDescription: {
    color: '#666',
    marginBottom: 16,
  },
  productPrice: {
    fontWeight: 'bold',
    color: cor_primaria,
  },
  crossSellSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#002E5D',
    marginBottom: 16,
  },
  crossSellCard: {
    marginBottom: 12,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: '#002E5D',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cor_primaria,
    marginTop: 4,
  },
  addButtonMini: {
    padding: 5,
  },
  actionFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    marginVertical: 0,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: cor_primaria,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});