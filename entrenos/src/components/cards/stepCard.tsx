import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";

// Pega a largura da tela
const { width: screenWidth } = Dimensions.get('window');

interface StepCardProps {
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ children }) => {
  return (
    // ScrollView para a área externa (fundo)
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* View para o card branco interno */}
      <View style={styles.cardContainer}>{children}</View>
    </ScrollView>
  );
};

// Estilos unificados (combinando os dois arquivos)
const styles = StyleSheet.create({
  // Estilo do ScrollView (área externa que permite rolar)
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20, // Espaço ao redor do card
  },
  
  // Estilo do Card (o container branco)
  cardContainer: {
    // --- De 'stylesthis.cardContainer' ---
    width: screenWidth * 0.9, // 90% da tela

    // --- De 'styles.container' (do outro arquivo) ---
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    
    // IMPORTANTE: Removi 'height: "70%"' e 'marginTop: 40'.
    // O card agora crescerá com o conteúdo (fotos, formulários, etc.)
  },
});

export default StepCard;