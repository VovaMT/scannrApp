import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearGoods, insertGoods } from "../../services/database/goodsService";

import { fetchGoods } from "../../services/api/goodsApi";
import styles from "./styles";

const DownloadScreen = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchAndStoreGoods = async () => {
    try {
      setLoading(true);
      setProgress(0.1);

      const deviceKey = await AsyncStorage.getItem("device_key");

      const goods = await fetchGoods(deviceKey);
      setProgress(0.4);

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
