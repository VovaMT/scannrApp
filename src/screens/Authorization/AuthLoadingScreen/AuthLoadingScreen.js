import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { checkLicense, getUserInfoByKey } from "services/api/authApi";
import { fetchDeviceId } from "utils/deviceUtils";
import { saveUserData } from "services/storage/userStorage";

const AuthLoadingScreen = ({ navigation }) => {

  useEffect(() => {
    const checkAuth = async () => {
      const deviceId = await fetchDeviceId();

      if (!deviceId) {
        Alert.alert("Помилка", "Не вдалося отримати ID пристрою");
        return;
      }

      try {
        await checkLicense(deviceId);

        // Якщо ліцензія є, завантажуємо дані користувача
        const userData = await getUserInfoByKey(deviceId);

        if (userData) {
          await saveUserData(userData.name, deviceId, true);
        }

        navigation.replace("Home");

      } catch (error) {
        console.log("Помилка при перевірці ліцензії:", error.message);

        if (error.message === "User not found") {
          navigation.replace("Registration");
        } else {
          navigation.replace("Restricted");
        }
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

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
