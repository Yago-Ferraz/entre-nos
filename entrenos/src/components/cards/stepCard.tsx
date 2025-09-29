import React from "react";
import { View } from "react-native";
import { styles } from "./stepCardStyle";

interface StepCardProps {
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default StepCard;
