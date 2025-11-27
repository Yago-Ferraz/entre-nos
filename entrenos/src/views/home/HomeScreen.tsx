import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '../../AuthContext';
import HeaderHome from '../../components/header/headerhome';
import { baseurl } from '../../services/api';
import { typography, cor_secundaria, cor_primaria, cor_terciaria, cor_backgroud } from "@/src/global";
import QuickActionCard from "../../components/buttons/QuickActionCard";
import PerformanceCard from '../../components/cards/PerformanceCard';
import SalesGoalCard from '../../components/cards/SalesGoalCard'; // Import SalesGoalCard
import GoldTipCard from '../../components/cards/GoldTipCard';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../Routes';
import { getEmpresaStats, getDashboardStats } from '../../services/lojaService';
import { DashboardStats } from '../../types/loja';

const { width, height } = Dimensions.get("window");

interface Stats {
  total_produtos: number;
  total_pedidos: number;
  moedas: number;
}

const HomeScreen: React.FC = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [salesGoalCardRefreshKey, setSalesGoalCardRefreshKey] = useState(0);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getEmpresaStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setDashboardStats(data);
      setDashboardError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      setDashboardError('Falha ao carregar dados de desempenho.');
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchDashboardStats();
  }, [fetchStats, fetchDashboardStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchStats(),
      fetchDashboardStats(),
    ]);
    setSalesGoalCardRefreshKey(prev => prev + 1); // Trigger SalesGoalCard refresh
    setRefreshing(false);
  }, [fetchStats, fetchDashboardStats]);

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
        name={user?.name || 'Usuário'}
        avatarUrl={`${baseurl}${user?.empresa?.logo}`}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={cor_primaria} // Customize refresh indicator color
          />
        }
      >
        <View style={styles.containertext}>
          <Text style={styles.title}>{`Bom dia, ${user?.name} !`}</Text>
          <Text style={styles.subtitulo}>Tudo pronto para mais um dia de sucesso?</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <QuickActionCard
              iconName="package-variant-closed"
              iconColor={cor_primaria}
              title="Produtos"
              subtitle={`${stats?.total_produtos || 0} produtos`}
              onPress={() => navigation.navigate(ROUTES.PRODUTOSCREEM as never)}
              style={{ marginRight: 16 }}
            />
            <QuickActionCard
              iconName="clipboard-text-outline"
              iconColor={cor_terciaria}
              title="Pedidos"
              subtitle={`${stats?.total_pedidos || 0} Novos`}
              onPress={() => navigation.navigate('Home', { screen: ROUTES.PEDIDOS })}
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
              subtitle={`${stats?.moedas || 0} Novas`}
              onPress={() => navigation.navigate(ROUTES.CAIXA as never)}
            />
          </ScrollView>
        </View>
        <View style={styles.salesGoalCardContainer}>
          <SalesGoalCard refreshKey={salesGoalCardRefreshKey} />
        </View>

        <View style={styles.performanceCardContainer}>
          <PerformanceCard
            dashboardStats={dashboardStats}
            loading={refreshing}
            error={dashboardError}
            onPress={() => navigation.navigate(ROUTES.BI as never)}
          />
        </View>
        <View style={styles.goldTipCardContainer}>
          <GoldTipCard />
        </View>
      </ScrollView>
    </View>

  );

};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
  paddingHorizontal: 16,
  alignItems: 'flex-start', // Mantém os itens alinhados no início do eixo cruzado
  paddingTop: height * 0.02,
  paddingBottom:2
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
    ...typography.detalhes,
  },
  containertext:{
    marginLeft: width*0.077,
    marginTop: height*0.0155,
  },
  goldTipCardContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  salesGoalCardContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16, // Reduzido para diminuir o vão
  },
  performanceCardContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
