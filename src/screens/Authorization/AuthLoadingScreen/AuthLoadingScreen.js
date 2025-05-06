import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import {
  getUserLicenseInfo,
  getUserInfo,
} from "services/api/authApi";
import { fetchDeviceId } from "utils/deviceUtils";
import {
  getUserData,
  saveUserData,
  clearUserData,
  saveStores
} from "services/storage/userStorage";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let localData = await getUserData();
        let deviceId = localData.key || await fetchDeviceId();
        if (!deviceId) throw new Error("no_device");

        let license = localData.keyLicense;

        // Якщо ліцензії ще нема — пробуємо отримати з сервера
        if (!license) {
          license = await getUserLicenseInfo(deviceId);
        }

        // Тепер завжди отримуємо повну інформацію
        const userInfo = await getUserInfo(deviceId, license);

        const activeStoreId = userInfo.store?.id || null;
        await saveUserData(userInfo.name, deviceId, userInfo.keyLicense, userInfo.role, activeStoreId);

        if (userInfo.role === 2 && userInfo.stores) {
          await saveStores(userInfo.stores);
        }

        navigation.replace("Home");
      } catch (error) {
        console.log("Помилка:", error.message);
        handleAuthError(error.message, navigation);
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const handleAuthError = async (message, navigation) => {
  switch (message) {
    case "User not found":
      await clearUserData();
      navigation.replace("Registration");
      break;
    case "Invalid license":
    case "Token does not match key":
    case "No license":
      await clearUserData();
      navigation.replace("Restricted");
      break;
    case "User not assigned to any store":
      Alert.alert("Помилка", "Користувач не прив'язаний до жодного магазину");
      navigation.replace("Restricted");
      break;
    case "no_device":
      Alert.alert("Помилка", "Не вдалося отримати ID пристрою");
      break;
    default:
      if (message.includes("Network request failed")) {
        Alert.alert("Помилка", "Немає з'єднання з сервером");
      } else {
        navigation.replace("Restricted");
      }
      break;
  }
};

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
