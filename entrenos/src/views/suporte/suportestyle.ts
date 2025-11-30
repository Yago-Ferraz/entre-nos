// src/views/Support/styles.ts
import { StyleSheet } from 'react-native';
import { cor_primaria } from '@/src/global';

export const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  // --- ESTILOS DO HEADER ESCURO ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45, // Ajuste para descer abaixo da status bar (pode usar useSafeAreaInsets)
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: cor_primaria, // Cor de fundo escura
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  
  // --- ESTILOS DO CONTEÚDO PRINCIPAL ---
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsGroup: {
    // Grupo de cards, sem a necessidade de um card branco maior, pois os itens já são cards
  },

  // Placeholder para a barra de navegação inferior
  bottomNavPlaceholder: {
    height: 60, // Altura da sua barra de navegação
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});