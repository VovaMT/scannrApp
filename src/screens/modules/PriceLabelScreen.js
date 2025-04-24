import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PriceLabelScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Цінники</Text>
  </View>
);

export default PriceLabelScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
