import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardBase from '../../components/cards/cardbase'; 
import Buttongeneric from '../../components/buttons/buttongeneric';
import Header from '../../components/header/header';
import { cor_primaria } from '../../global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LojaStackParamList } from '../../types/navigationTypes';

// --- DADOS MOCKADOS (Para preencher a tela) ---
const mainProduct = {
  id: 1,
  title: 'Macarons coloridos',
  description: 'Variedade de sabores e cores vibrantes',
  price: 8.00,
  image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1000&auto=format&fit=crop' // Imagem placeholder
};

const crossSellItems = [
  {
    id: 2,
    title: 'Cookies de chocolate',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cf446?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Bolo de cenoura',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1000&auto=format&fit=crop'
  }
];

type ProductDetailScreenProps = NativeStackScreenProps<LojaStackParamList, 'TelaProduto'>;

export default function ProductDetailScreen({ navigation }: ProductDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    console.log(`Adicionado: ${quantity}x ${mainProduct.title}`);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
         <Header title="Loja" showBackButton={true} onBackPress={handleGoBack} />
         <TouchableOpacity style={styles.cartIconHeader}>
            <Ionicons name="cart-outline" size={24} color="#FFF" />
         </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: mainProduct.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.ratingBadge}>
             <Text style={styles.ratingText}>4.8 ★</Text>
          </View>
          <View style={styles.heartButton}>
             <Ionicons name="heart" size={20} color="#FFA500" />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>{mainProduct.title}</Text>
          <Text style={styles.productDescription}>{mainProduct.description}</Text>
          <Text style={styles.productPrice}>
            R$ {mainProduct.price.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <View style={styles.crossSellSection}>
          <Text style={styles.sectionTitle}>Peça também!</Text>
          
          {crossSellItems.map((item) => (
            <CardBase key={item.id} style={styles.crossSellCard}>
              <View style={styles.cardContent}>
                <Image source={{ uri: item.image }} style={styles.miniImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardPrice}>
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <TouchableOpacity style={styles.addButtonMini}>
                  <Ionicons name="add" size={24} color={cor_primaria} />
                </TouchableOpacity>
              </View>
            </CardBase>
          ))}
        </View>

      </ScrollView>

      <View style={styles.actionFooter}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={handleDecrement} style={[styles.qtyBtn, styles.qtyBtnLeft]}>
            <Ionicons name="remove" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.qtyInputContainer}>
            <Text style={styles.qtyText}>{quantity}</Text>
          </View>

          <TouchableOpacity onPress={handleIncrement} style={[styles.qtyBtn, styles.qtyBtnRight]}>
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002E5D',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cor_primaria,
  },
  crossSellSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
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
    bottom: 60,
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
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    backgroundColor: cor_primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  qtyBtnRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  qtyInputContainer: {
    width: 40,
    height: 36,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
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
