import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Dimensions } from "react-native";
import { styles } from "./headerStyle";
import { Ionicons } from '@expo/vector-icons'; // ou outro pacote de ícones
const { width, height } = Dimensions.get("window");
interface HeaderProps {
  title: string;
  showBackButton?: boolean;          // desativado por padrão
  onBackPress?: () => void;          // função de callback opcional
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, onBackPress }) => {
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles2.backButton}>
          <Ionicons name="arrow-back" size={width*0.081} color="white" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles2 = StyleSheet.create({
  backButton: {
    width:'auto',
    position: 'absolute',
    top: "50%",
    left: width * 0.068,
    zIndex: 1,

  }
});
