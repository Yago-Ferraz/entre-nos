import React from "react";
import { View, Text, StyleSheet  } from "react-native";
import { styles } from "./headerStyle";


interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (

      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>

  );
};




export default Header;

