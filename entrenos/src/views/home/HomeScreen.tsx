import React ,{useEffect} from 'react';
import { View, Text, Button, StyleSheet,Dimensions,ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext';
import HeaderHome from '../../components/header/headerhome';
import {baseurl} from '../../services/api';
import { typography, cor_secundaria, cor_primaria, cor_terciaria,cor_backgroud } from "@/src/global";
import QuickActionCard from "../../components/buttons/QuickActionCard";
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../Routes';

const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const { logout, user } = useAuth();

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();

      console.log('Usuário deslogado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };
  return (


    <View style={styles.container}>
      <HeaderHome 
        name={ user?.name || 'Usuário'}
        avatarUrl= {`${baseurl}${user?.empresa?.logo}`}
      />
      <View style={styles.containertext}>
        <Text style={styles.title}>{`Bom dia, ${user?.name} !`}</Text>
        <Text style={styles.subtitulo}>Tudo pronto para mais um dia de sucesso?</Text>
      </View>
      <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      horizontal={true} 
      showsHorizontalScrollIndicator={false}
    >
      <QuickActionCard
        iconName="package-variant-closed"
        iconColor={cor_primaria}
        title="Produtos"
        subtitle="24 produtos"
        onPress={() => navigation.navigate(ROUTES.PRODUTOSCREEM as never)}
        style={{ marginRight: 16 }}
      />
      <QuickActionCard
        iconName="clipboard-text-outline"
        iconColor={cor_terciaria}
        title="Pedidos"
        subtitle="3 Novos"
        onPress={() => console.log("Pedidos clicado")}
        style={{ marginRight: 16 }}
      />
      <QuickActionCard
        iconName="bullhorn-outline"
        iconColor={cor_secundaria}
        title="Campanha"
        subtitle="Nova campanha"
        onPress={() => console.log("Campanha clicado")}
        style={{ marginRight: 16 }}
      />
      <QuickActionCard
        iconName="database"
        title="moedas"
        subtitle="105 Novas"
        onPress={() => console.log("moedas clicado")}
      />
    </ScrollView>
  

    </View>
  
);

};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
  paddingHorizontal: 16,
  alignItems: 'flex-start',
  marginTop: height*0.018,
  
},
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: cor_backgroud,
    width: '100%',
    height: '100%',
  },
  title: {
    ...typography.h1,
    color: cor_secundaria,
  },
  subtitulo:{
    ...typography.p,
    color: '#000000ff'
  },
  containertext:{
    marginLeft: width*0.077,
    marginTop: height*0.0155,
  }
});
