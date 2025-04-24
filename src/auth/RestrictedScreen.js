import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { getUserData, saveUserData, clearUserData } from "../utils/storage";
import { checkLicense } from "../api/authApi";

const RestrictedScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState("");
  const [deviceKey, setDeviceKey] = useState("");
  const [hasLicense, setHasLicense] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { name, key, hasLicense } = await getUserData();
      if (name) setName(name);
      if (key) setDeviceKey(key);
      if (hasLicense === "true") setHasLicense(true);
    };
    loadUser();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
  
    const { key, name } = await getUserData();
  
    try {
      await checkLicense(key);
      await saveUserData(name, key, true);
      Alert.alert("Ліцензія отримана", "Тепер ви маєте доступ до модулів");
      navigation.replace("Home");
    } catch (err) {
      if (err.message === "User not found") {
        await clearUserData();
        Alert.alert("Користувача не знайдено");
        navigation.replace("Registration");
      } else {
        Alert.alert("Ліцензії все ще немає", "Спробуйте пізніше");
      }
    }
    setRefreshing(false);
  }, []);
  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>У вас ще немає ліцензії</Text>
      <Text style={styles.subtext}>Потягніть вниз, щоб перевірити ще раз</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Користувач</Text>
        <Text style={styles.text}>Ім’я: {name || "-"}</Text>
        <Text style={styles.text}>Ключ: {deviceKey || "-"}</Text>
        <Text style={styles.text}>
          Ліцензія: {hasLicense ? "є" : "відсутня"}
        </Text>
      </View>
    </ScrollView>
  );
};

export default RestrictedScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  section: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
