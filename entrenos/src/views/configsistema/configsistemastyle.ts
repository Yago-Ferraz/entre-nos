import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // --- ESTILOS DO HEADER (Reutilizados do ProfileScreen) ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  secondaryLogo: {
    width: 60,
    height: 60,
    borderRadius: 30, // Adiciona bordas arredondadas para um visual circular
    resizeMode: 'contain',
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  
  // --- ESTILOS DO CONTEÚDO "SOBRE O SISTEMA" ---
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
  contentTextHighlight: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
    fontWeight: 'bold', // Para o texto central em negrito
  },
  missionStatement: {
    textAlign: 'center', // Para centralizar a frase da missão
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  illustrationImage: {
    width: 150, // Ajuste conforme o tamanho da imagem real
    height: 150, // Ajuste conforme o tamanho da imagem real
    resizeMode: 'contain',
  },

  // --- ESTILOS DO BOTÃO INFERIOR FIXO ---
  bottomButtonArea: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    // O marginBottom é para dar espaço à barra de navegação inferior
    marginBottom: 60, // Ajuste este valor se a barra de navegação for maior ou menor
  },
  updateButton: {
    backgroundColor: '#2F9E44', // Cor verde principal
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#2F9E44',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Placeholder para a barra de navegação inferior (apenas para manter o layout)
  bottomNavPlaceholder: {
    height: 60, // Altura da sua barra de navegação
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8, // Para simular a barra de ícones
  }
});