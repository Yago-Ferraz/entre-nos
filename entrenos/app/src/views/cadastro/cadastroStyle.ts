import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",

  },
  content: {
    flex: 1,               // ocupa o espaço restante abaixo do header
    justifyContent: "center", // centraliza vertical
    alignItems: "center",     // centraliza horizontal
    width: "100%",
    },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 20,
  },
  stepText: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  // --- novos estilos para escolha (empresa / consumidor)
  choiceContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: "#0D823B",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 120,
    alignItems: "center",
  },
  choiceButtonSelected: {
    backgroundColor: "#0D823B",
  },
  choiceText: {
    fontSize: 16,
    color: "#0D823B",
    fontWeight: "500",
  },
  choiceTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
