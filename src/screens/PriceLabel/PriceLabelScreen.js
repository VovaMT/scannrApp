import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PriceLabelScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.moduleBox}
          onPress={() => navigation.navigate("PriceLabelList", { mode: "check" })}
        >
          <View style={styles.iconRow}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#333" />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleText}>Перевірка цінників</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moduleBox}
          onPress={() => navigation.navigate("PriceLabelList", { mode: "print" })}
        >
          <View style={styles.iconRow}>
            <Ionicons name="print-outline" size={24} color="#333" />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleText}>Друк цінників</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PriceLabelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moduleBox: {
    width: "48%",
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  iconRow: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  moduleContent: {
    justifyContent: "center",
  },
  moduleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
