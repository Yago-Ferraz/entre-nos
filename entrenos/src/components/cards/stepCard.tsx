import React from "react";
import { View,ScrollView,StyleSheet  } from "react-native";
import { styles } from "./stepCardStyle";
import { Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
interface StepCardProps {
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ children }) => {
  return(<ScrollView contentContainerStyle={stylesthis.scrollContainer}>
   <View style={[styles.container,stylesthis.cardContainer]}>{children}</View>;
  </ScrollView>)
};


const stylesthis = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardContainer: {
    width: screenWidth * 0.9, // 90% da tela

  },
});


export default StepCard;
