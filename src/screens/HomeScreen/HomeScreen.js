import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { modules } from "./helper";
import styles from "./styles";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {modules.map((mod, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moduleBox}
            onPress={() => navigation.navigate(mod.route)}
          >
            <View style={styles.iconRow}>
              <Ionicons name={mod.icon} size={24} color="#333" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleText}>{mod.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;
