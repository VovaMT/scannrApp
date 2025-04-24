import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { initDB, clearGoods, insertGoods } from "../database/db";
import { fetchGoods } from "../api/goodsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DownloadScreen = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchAndStoreGoods = async () => {
    try {
      setLoading(true);
      setProgress(0.1);
  
      const deviceKey = await AsyncStorage.getItem("device_key");
  
      await initDB();
      setProgress(0.3);
  
      const goods = await fetchGoods(deviceKey); 
      setProgress(0.6);
  
      await clearGoods();
      setProgress(0.8);
  
      await insertGoods(goods);
      setProgress(1);
  
      Alert.alert("Дані успішно збережено у SQLite!");
    } catch (error) {
      
      Alert.alert("Помилка", error.message || "Невідома помилка");
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Завантаження товарів</Text>

      <View style={styles.buttonWrapper}>
        <Button
          title={loading ? "Завантаження..." : "Завантажити"}
          onPress={fetchAndStoreGoods}
          disabled={loading}
        />
        {loading && (
          <View style={styles.progressLine}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default DownloadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 20,
    position: "relative",
  },
  progressLine: {
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6b8e23",
    borderRadius: 2,
  },
});
