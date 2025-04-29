import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet, Alert } from "react-native";
import { checkLicense, getUserInfoByKey } from "services/api/authApi";
import { saveUserData } from "services/storage/userStorage";
import { fetchDeviceId } from "utils/deviceUtils";
import { getUserData } from "services/storage/userStorage"; 
const RestrictedScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceKey, setDeviceKey] = useState("-");
  const [userName, setUserName] = useState("-");

  useEffect(() => {
    const loadDeviceInfo = async () => {
      const id = await fetchDeviceId();
      setDeviceKey(id || "-");

      const user = await getUserData();
      if (user.name) setUserName(user.name);
    };
    loadDeviceInfo();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const id = await fetchDeviceId();
    try {
      await checkLicense(id);
      const userData = await getUserInfoByKey(id);
      if (userData) {
        await saveUserData(userData.name, id, true);
      }
      Alert.alert("Ліцензія отримана", "Тепер ви маєте доступ до модулів");
      navigation.replace("Home");
    } catch (err) {
      if (err.error && err.error.includes("User not found")) {
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>У вас ще немає ліцензії</Text>
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
