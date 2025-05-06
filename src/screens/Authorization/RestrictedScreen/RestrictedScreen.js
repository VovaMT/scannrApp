import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet, Alert } from "react-native";
import { getUserInfo } from "services/api/authApi";
import { saveUserData, getUserData, saveStores } from "services/storage/userStorage";
import { fetchDeviceId } from "utils/deviceUtils";

const RestrictedScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceKey, setDeviceKey] = useState("-");
  const [userName, setUserName] = useState("-");

  useEffect(() => {
    const loadDeviceInfo = async () => {
      const user = await getUserData();
      let key = user.key;

      setDeviceKey(key || "-");
      if (user.name) setUserName(user.name);
    };
    loadDeviceInfo();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
  
    try {
      const user = await getUserData();
      let key = user.key;
      let keyLicense = user.keyLicense;
  
      if (!key || !keyLicense) {
        throw new Error("Missing local key or license");
      }
  
      const userInfo = await getUserInfo(key, keyLicense);
  
      const activeStoreId = userInfo.store?.id || null;
      await saveUserData(userInfo.name, key, userInfo.keyLicense, userInfo.role, activeStoreId);
  
      if (userInfo.role === 2 && userInfo.stores) {
        await saveStores(userInfo.stores);
      }
  
      Alert.alert("Ліцензія підтверджена", "Тепер ви маєте доступ до модулів");
      navigation.replace("Home");
  
    } catch (err) {
      console.log("Помилка:", err.message);
      const msg = err.message || "Помилка";
  
      if (msg === "User not found") {
        Alert.alert("Користувача не знайдено");
        navigation.replace("Registration");
      } else if (
        msg === "No license" ||
        msg === "Invalid license" ||
        msg === "Token does not match key"
      ) {
        Alert.alert("Неправильна ліцензія", "Отримайте нову або зверніться до адміністратора");
      } else if (msg === "User not assigned to any store") {
        Alert.alert("Помилка", "Користувач не прив'язаний до жодного магазину");
      } else {
        Alert.alert("Ліцензії все ще немає", "Спробуйте пізніше");
      }
    }
  
    setRefreshing(false);
  }, [navigation]);
  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>У вас ще немає доступу</Text>
      <Text style={styles.subtext}>Потягніть вниз, щоб перевірити ще раз</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Користувач</Text>
        <Text style={styles.text}>Ім’я: {userName}</Text>
        <Text style={styles.text}>Ключ пристрою: {deviceKey}</Text>
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
