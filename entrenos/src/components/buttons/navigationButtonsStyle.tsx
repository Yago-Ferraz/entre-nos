import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  back: {
    backgroundColor: "#0D823B",
    marginRight: 5,
  },
  next: {
    backgroundColor: "#fff",
    marginLeft: 5,
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
  },
  nextText: {
    color: "#0D823B",
    fontWeight: "600",
  },
});
