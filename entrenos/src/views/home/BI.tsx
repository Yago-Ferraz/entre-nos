import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity,
  FlatList,
  ViewToken,
  ActivityIndicator // Added for loading indicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- SEUS COMPONENTES ---
import Header from '@/src/components/header/header';
import CardBase from '@/src/components/cards/cardbase';
import Buttongeneric from '@/src/components/buttons/buttongeneric'; 

// --- ESTILOS GLOBAIS ---
import { 
  cor_backgroud, 
  cor_secundaria, 
  cor_primaria, 
  cor_terciaria, 
  cinza,
  typography,
  FONT_FAMILY,
  FONT_SIZE,
} from '@/src/global';

// --- SERVIÇOS E TIPOS ---
import { getWeeklyDashboardSummary } from '@/src/services/lojaService';
import { WeeklyDashboardSummaryResponse } from '@/src/types/loja';
import { BIScreenNavigationProp } from '@/src/types/navigationTypes'; // Assuming BIScreenNavigationProp is in loja.ts or navigationTypes.ts

interface Achievement {
  key: string;
  title: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap; // Type for icon names
  condition: (data: WeeklyDashboardSummaryResponse | null, totalSalesNum: number, weeklyGoalMet: boolean) => boolean;
  unlockedColor: string;
  lockedColor: string;
}

const { width: screenWidth } = Dimensions.get('window');

const BIScreen: React.FC = () => {
  const navigation = useNavigation<BIScreenNavigationProp>();
  
  const [dashboardData, setDashboardData] = useState<WeeklyDashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- CARROSSEL LOGIC ---
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const cardContentWidth = screenWidth - 32 - 24;

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  };

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        const data = await getWeeklyDashboardSummary();
        setDashboardData(data);
      } catch (err: any) {
        setError('Erro ao carregar o resumo do dashboard: ' + (err.message || 'Erro desconhecido'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  const handlePrevTip = () => { if (activeTipIndex > 0) scrollToIndex(activeTipIndex - 1); };
  const handleNextTip = () => {
    if (dashboardData?.frases_dra_clara && activeTipIndex < dashboardData.frases_dra_clara.length - 1) {
      scrollToIndex(activeTipIndex + 1);
    }
  };
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) setActiveTipIndex(viewableItems[0].index);
  }, []);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderCarouselItem = ({ item, index }: { item: string, index: number }) => {
    const isFirst = index === 0;
    const isLast = !!(dashboardData && index === dashboardData.frases_dra_clara.length - 1);
    return (
      <View style={[styles.carouselItemContainer, { width: cardContentWidth }]}>
        <TouchableOpacity style={styles.arrowButton} onPress={handlePrevTip} disabled={isFirst}>
           <MaterialCommunityIcons name="chevron-left" size={28} color={isFirst ? cinza : cor_secundaria} />
        </TouchableOpacity>
        <Text style={styles.tipText}>{item}</Text>
        <TouchableOpacity style={styles.arrowButton} onPress={handleNextTip} disabled={isLast}>
           <MaterialCommunityIcons name="chevron-right" size={28} color={isLast ? cinza : cor_secundaria} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={cor_primaria} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <Buttongeneric 
          title="Tentar Novamente"
          onPress={() => navigation.replace('BI')} // Simple retry by re-mounting the component
          variant="primary"
          style={{ backgroundColor: cor_primaria, marginTop: 20 }}
        />
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="information-outline" size={50} color={cinza} />
        <Text style={styles.errorText}>Nenhum dado encontrado para o dashboard.</Text>
      </View>
    );
  }

  // Calculate metaPorcentagem
  const totalVendaSemanaNum = parseFloat(dashboardData.total_venda_semana.replace(',', '.'));
  const metaSemanalNum = dashboardData.meta_semanal;
  const metaPorcentagem = metaSemanalNum > 0 ? Math.min(100, Math.round((totalVendaSemanaNum / metaSemanalNum) * 100)) : 0;

  const weeklyGoalMet = metaPorcentagem >= 100;

  const achievements: Achievement[] = [
    {
      key: 'weekly_goal_achieved',
      title: 'Meta Semanal Concluída!',
      iconName: 'trophy',
      condition: (_, __, weeklyGoalMet) => weeklyGoalMet,
      unlockedColor: cor_primaria, // Green
      lockedColor: cinza, // Gray
    },
    {
      key: 'first_sale',
      title: 'Primeira Venda!',
      iconName: 'cash-multiple',
      condition: (data, totalSalesNum) => totalSalesNum > 0 && data !== null, // Ensure data is not null
      unlockedColor: cor_secundaria, // Blue
      lockedColor: cinza,
    },
    {
      key: 'top_product_sold',
      title: 'Produto em Destaque!',
      iconName: 'star-circle',
      condition: (data) => data !== null && !!data.produto_mais_vendido_semana.nome, // Ensure data is not null
      unlockedColor: cor_terciaria, // Orange
      lockedColor: cinza,
    },
    // Add more achievements here as needed
  ];

  return (
    <View style={styles.container}>
      <Header title="Seus resultados" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- SEÇÃO 1: RESUMO --- */}
        <View style={styles.sectionHeader}>
           <MaterialCommunityIcons name="calendar-month" size={24} color={cor_secundaria} />
           <Text style={styles.sectionTitle}>Resumo da Semana</Text>
        </View>

        <CardBase style={styles.summaryCard}>
          <MaterialCommunityIcons name="chart-line-variant" size={40} color={cor_primaria} style={{ marginBottom: 8 }} />
          <Text style={styles.bigValue}>R$ {dashboardData.total_venda_semana.replace('.', ',')}</Text>
          <Text style={styles.label}>Total de Vendas</Text>
          <View style={styles.indicatorContainer}>
            <MaterialCommunityIcons name="arrow-up" size={16} color={cor_primaria} />
            <Text style={styles.indicatorText}>N/A</Text> 
          </View>
        </CardBase>

        <CardBase style={styles.summaryCard}>
          <MaterialCommunityIcons name="package-variant-closed" size={40} color={cor_terciaria} style={{ marginBottom: 8 }} />
          <Text style={styles.bigValue}>{dashboardData.produto_mais_vendido_semana.nome}</Text>
          <Text style={styles.label}>Produto Mais Vendido</Text>
          <View style={styles.indicatorContainer}>
             <MaterialCommunityIcons name="star" size={16} color={cor_primaria} />
             <Text style={[styles.indicatorText, { marginLeft: 4 }]}>Favorito!</Text>
          </View>
        </CardBase>

        <CardBase style={styles.summaryCard}>
          <View style={styles.checkCircle}>
             <MaterialCommunityIcons name="check" size={24} color="#FFF" />
          </View>
          <Text style={styles.bigValue}>{metaPorcentagem}%</Text>
          <Text style={styles.label}>Meta Semanal</Text>
          <View style={styles.progressBarBackground}>
             <View style={[styles.progressBarFill, { width: `${metaPorcentagem}%` }]} />
          </View>
        </CardBase>

        <Text style={styles.congratsText}>
          Parabéns! Sua meta semanal é de R$ {dashboardData.meta_semanal.toFixed(2).replace('.', ',')} e você já atingiu R$ {dashboardData.total_venda_semana}.
        </Text>

        {/* --- SEÇÃO 2: DICA --- */}
        <CardBase style={styles.tipCard}>
           <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="face-woman" size={32} color={cor_secundaria} /> 
           </View>
           <Text style={styles.tipTitle}>Dica da D. Maria:</Text>
           <View style={{ height: 100 }}>
             <FlatList
               ref={flatListRef}
               data={dashboardData.frases_dra_clara}
               renderItem={renderCarouselItem}
               keyExtractor={(item, index) => index.toString()}
               horizontal
               pagingEnabled
               showsHorizontalScrollIndicator={false}
               onViewableItemsChanged={onViewableItemsChanged}
               viewabilityConfig={viewabilityConfig}
               getItemLayout={(data, index) => ({ length: cardContentWidth, offset: cardContentWidth * index, index })}
             />
           </View>
           <View style={styles.dotsContainer}>
              {dashboardData.frases_dra_clara.map((_, index) => (
                <View key={index} style={[styles.dot, activeTipIndex === index && styles.dotActive]} />
              ))}
           </View>
        </CardBase>

        {/* --- SEÇÃO 3: ALERTAS --- */}
        <CardBase style={styles.alertascard}>
          <View style={[styles.sectionHeader, {marginTop: 0, marginBottom: 16}]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={24} color={cor_terciaria} />
            <Text style={styles.sectionTitle}>Alertas Inteligentes</Text>
          </View>

          {dashboardData.alertas_inteligentes.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
                <View style={styles.alertIconContainer}>
                    <MaterialCommunityIcons name="alert" size={24} color={cor_terciaria} />
                </View>
                <Text style={styles.alertText}>{alert}</Text>
            </View>
          ))}
        </CardBase>

        {/* --- SEÇÃO 4: CAMPANHA --- */}
        <CardBase style={styles.campaignCard}>
            <MaterialCommunityIcons name="bullhorn" size={40} color={cor_terciaria} style={{marginBottom: 12}} />
            <Text style={styles.campaignTitle}>Campanha Inteligente</Text>
            <Text style={styles.campaignDescription}>Está chegando o Dia das Mães! Que tal criar uma campanha especial para elas?</Text>
            <Buttongeneric 
                title="Criar Campanha"
                onPress={() => {}}
                variant="primary"
                style={{ backgroundColor: cor_terciaria, width: '80%', marginTop: 8 }}
                textStyle={{ color: '#FFF' }}
            />
        </CardBase>

        {/* --- SEÇÃO 5: VENDAS POR DIA --- */}
        <CardBase style={styles.chartCard}>
           <View style={[styles.sectionHeader, { marginTop: 0, marginBottom: 20 }]}>
              <MaterialCommunityIcons name="chart-bar" size={24} color={cor_primaria} />
              <Text style={styles.sectionTitle}>Vendas por Dia</Text>
           </View>
           <View style={styles.chartArea}>
              {Object.entries(dashboardData.vendas_por_dia_semana).map(([day, valor], index) => {
                 const daysMap: { [key: string]: string } = {
                   segunda: 'Seg',
                   terca: 'Ter',
                   quarta: 'Qua',
                   quinta: 'Qui',
                   sexta: 'Sex',
                 };
                 const displayDay = daysMap[day] || day;
                 const maxSales = Math.max(...Object.values(dashboardData.vendas_por_dia_semana));
                 const height = maxSales > 0 ? (valor / maxSales) * 100 : 0;
                 const dailyGoal = dashboardData.meta_semanal / 5; // Assuming 5 working days
                 const didMeetDailyGoal = valor >= dashboardData.meta_diaria;

                 return (
                    <View key={index} style={styles.barContainer}>
                       <View style={[styles.bar, { height: `${height}%`, backgroundColor: didMeetDailyGoal ? cor_primaria : cor_terciaria }]}>
                          {valor > 0 && <Text style={styles.barValueText}>R${valor}</Text>}
                       </View>
                       <Text style={styles.barLabel}>{displayDay}</Text>
                    </View>
                 );
              })}
           </View>
        </CardBase>


        {/* --- SEÇÃO 6: FORMALIZE SEU NEGÓCIO (NOVO) --- */}
        <CardBase style={styles.campaignCard}>
            <MaterialCommunityIcons name="handshake" size={40} color={cor_primaria} style={{marginBottom: 12}} />
            
            <Text style={styles.campaignTitle}>Formalize Seu Negócio</Text>
            
            <Text style={styles.campaignDescription}>
               A D. Maria te ajuda a dar o próximo passo para o sucesso e segurança da sua Doceria.
            </Text>

            <Buttongeneric 
                title="Falar com D. Maria"
                onPress={() => console.log('Falar com Dra. Clara')}
                variant="primary"
                style={{ backgroundColor: cor_terciaria, width: '90%', marginTop: 8 }} // Botão laranja
                textStyle={{ color: '#FFF' }}
                // Se o seu botão suporta ícone direito ou esquerdo:
                leftIcon={<MaterialCommunityIcons name="chat-processing" size={18} color="#FFF" style={{marginRight: 8}} />}
            />
        </CardBase>

        {/* --- SEÇÃO 7: SUAS CONQUISTAS (NOVO) --- */}
        <CardBase style={styles.achievementsCard}>
           {/* Título do Card */}
           <View style={styles.achievementsHeader}>
              <MaterialCommunityIcons name="medal" size={24} color={cor_terciaria} style={{marginRight: 8}} />
              <Text style={styles.achievementsTitle}>Suas Conquistas</Text>
           </View>

           {/* Linha de Ícones */}
           <View style={styles.achievementsRow}>
              {achievements.map((achievement) => {
                const totalVendaSemanaNum = parseFloat(dashboardData.total_venda_semana.replace(',', '.'));
                const weeklyGoalMet = metaPorcentagem >= 100;
                const isUnlocked = achievement.condition(dashboardData, totalVendaSemanaNum, weeklyGoalMet);
                const iconColor = isUnlocked ? achievement.unlockedColor : achievement.lockedColor;

                return (
                  <View key={achievement.key} style={styles.achievementItem}>
                    <MaterialCommunityIcons name={achievement.iconName} size={48} color={iconColor} style={{ marginBottom: 8 }} />
                    <Text style={[styles.achievementText, { color: iconColor }]}>
                      {achievement.title}
                    </Text>
                  </View>
                );
              })}
           </View>
        </CardBase>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cor_backgroud },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  
  // Headers
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { ...typography.h3, color: cor_secundaria, marginLeft: 8, fontFamily: FONT_FAMILY.JOST_BOLD },

  // Summary Cards
  summaryCard: { backgroundColor: '#FFFFFF', paddingVertical: 24, paddingHorizontal: 16, marginBottom: 16, alignItems: 'center', justifyContent: 'center', width: '100%' },
  bigValue: { ...typography.h2, color: cor_secundaria, marginBottom: 4 },
  label: { ...typography.p, color: cinza, marginBottom: 8 },
  indicatorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  indicatorText: { ...typography.p, fontFamily: FONT_FAMILY.JOST_SEMIBOLD, color: cor_primaria },
  checkCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: cor_secundaria, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  progressBarBackground: { width: '100%', height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginTop: 12, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: cor_primaria, borderRadius: 5 },
  congratsText: { ...typography.p, color: cinza, textAlign: 'center', marginTop: 8, marginBottom: 20, fontSize: FONT_SIZE.XS, lineHeight: 18, paddingHorizontal: 10 },

  // Tip Card (D. Maria)
  alertascard: { backgroundColor: '#FFFFFF',padding: 16, marginBottom: 20 },
  tipCard: { backgroundColor: '#FFFFFF', paddingVertical: 20, paddingHorizontal: 12, alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: cor_secundaria, alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: cor_backgroud },
  tipTitle: { ...typography.h3, color: cor_secundaria, marginBottom: 12, fontFamily: FONT_FAMILY.JOST_BOLD },
  carouselItemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tipText: { ...typography.p, color: cor_secundaria, textAlign: 'center', flex: 1, paddingHorizontal: 8, lineHeight: 20 },
  arrowButton: { padding: 8, borderRadius: 20 },
  dotsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  dotActive: { backgroundColor: cor_terciaria, width: 10, height: 10, borderRadius: 5 },

  // Alertas
  alertItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F6F6F6',
    padding: 12,                
    borderRadius: 12,           
    marginBottom: 12,           
  },
  alertIconContainer: { marginRight: 12 },
  alertText: { ...typography.p, color: cor_secundaria, flex: 1, fontSize: FONT_SIZE.XS, lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 12 },

  // Campanha e Formalização (Reutilizando estilos similares)
  campaignCard: { backgroundColor: '#FFFFFF', padding: 24, alignItems: 'center', marginTop: 12, marginBottom: 12 },
  campaignTitle: { ...typography.h3, color: cor_secundaria, marginBottom: 8, fontFamily: FONT_FAMILY.JOST_BOLD, textAlign: 'center' },
  campaignDescription: { ...typography.p, color: cinza, textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },

  // Gráfico
  chartCard: { backgroundColor: '#FFFFFF', padding: 16, marginBottom: 20, width: '100%' },
  chartArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, paddingTop: 20 },
  barContainer: { alignItems: 'center', width: 50, height: '100%', justifyContent: 'flex-end' },
  bar: { width: 60, borderRadius: 6, marginBottom: 8, justifyContent: 'flex-end', alignItems: 'center' },
  barValueText: { color: '#FFF', fontSize: FONT_SIZE.XS, fontFamily: FONT_FAMILY.JOST_BOLD, marginBottom: 4 },
  barLabel: { ...typography.p, fontSize: FONT_SIZE.XS, color: cinza },

  // --- NOVOS ESTILOS: CONQUISTAS ---
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementsTitle: {
    ...typography.h3,
    color: cor_secundaria,
    fontFamily: FONT_FAMILY.JOST_BOLD,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  achievementText: {
    ...typography.p,
    fontSize: FONT_SIZE.XS,
    color: cinza,
    textAlign: 'center',
    marginTop: 4,
  },
  // Loading and Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cor_backgroud,
  },
  loadingText: {
    marginTop: 10,
    fontSize: FONT_SIZE.MD,
    color: cor_secundaria,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cor_backgroud,
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: FONT_SIZE.MD,
    color: 'red',
    textAlign: 'center',
  },
});

export default BIScreen;