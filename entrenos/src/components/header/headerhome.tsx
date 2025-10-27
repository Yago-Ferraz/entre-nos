import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { typography } from "@/src/global";

const { width, height } = Dimensions.get("window");

interface HeaderProps {
  name: string;
  message?: string;
  avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ name, message = "Bem-vindo de volta!", avatarUrl }) => {
  return (
    <View style={styles.container}>
        <View style={styles.textfoto}>
            {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.message}>{message}</Text>
                </View>
        </View>

    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#0D823B",
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "flex-start",
    
    paddingTop:height*0.07,
    height: height*0.175 ,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  textfoto:{
        marginLeft:width*0.054,
        gap:width*0.029,
        flexDirection: "row",
        alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 12,
  },
  name: {
    ...typography.h3,
    color: "#fff",
    fontWeight: "bold",
  },
  message: {
    ...typography.p,
    color: "#fff",
    marginTop: 4,
  },
});
