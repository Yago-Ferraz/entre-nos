import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // --- Estrutura Principal ---
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7", 
    alignItems: "center",
    justifyContent: "center", 
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 35, 
  },

  // --- Logo ---
  image: {
    width: 150,
    height: 150,
    marginBottom: 50, 
  },

  // --- Container do Formulário ---
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },

  // --- Inputs e Labels ---
  inputContainer: {
    width: '100%',
    marginBottom: 20, 
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8, 
    fontWeight: "500",
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#666",
  },

  // --- Botões ---
  loginButton: {
    backgroundColor: "#0D823B",
    width: "100%",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  createAccountButton: {
    marginTop: 24, 
  },
  createAccountText: {
    fontSize: 16,
    color: "#0D823B",
    fontWeight: "600",
  },
});