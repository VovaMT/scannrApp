import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ModuleCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export default ModuleCard;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#e2f0d9",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
