// components/QuickActionCard.tsx
import React from "react";
import { TouchableOpacity, ViewStyle, Text, StyleSheet,Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { typography } from "@/src/global"; // seu typography global
import { cor_primaria, cor_secundaria, cinza } from "@/src/global"; // cores globais
const { width, height } = Dimensions.get("window");
interface QuickActionCardProps {
  iconName: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  style?: ViewStyle;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  iconName,
  iconColor,
  title,
  subtitle,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <MaterialCommunityIcons
        name={iconName}
        size={width*0.1}
        color={iconColor || cor_primaria}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height*0.1,
    minWidth: width*0.30,
    elevation: 2, // sombra Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    ...typography.h4,
    marginTop: 8,
    color: cor_secundaria,
    textAlign: "center",
  },
  subtitle: {
    ...typography.p,
    marginTop: 4,
    color: cinza,
    textAlign: "center",
  },
});
