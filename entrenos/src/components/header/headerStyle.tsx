import { StyleSheet,Dimensions  } from "react-native";
import { typography } from "@/src/global";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#0D823B",
    paddingVertical: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: height*0.12,
    justifyContent:"center",
  },
  title: {
    ...typography.h1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    
  },
});
