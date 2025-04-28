import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReservationScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Резервування</Text>
  </View>
);

export default ReservationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
