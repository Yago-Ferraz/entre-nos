import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // --- Estilos reutilizados do cadastro ---
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 22, // Aumentei um pouco para dar mais destaque
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 32,
  },
  
  // --- Novos estilos para a tela de Login ---
  loginButton: {
    backgroundColor: "#0D823B", // Mesma cor do botão de seleção
    width: "100%",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24, // Espaço acima do botão
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end', // Alinha o botão à direita
    marginTop: 12,
    padding: 4, // Área de toque maior
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: 'underline',
  }
});