import React, { useEffect, useState } from "react";
import { View, Text, Switch } from "react-native";
import { Camera } from "expo-camera";
import { getUserData, saveUseCameraSetting, getUseCameraSetting } from "../../services/storage/userStorage";
import styles from "./styles";

const SettingsScreen = () => {
  const [name, setName] = useState("");
  const [deviceKey, setDeviceKey] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);

  const toggleSwitch = async (value) => {
    if (value) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setUseCamera(false);
        await saveUseCameraSetting(false);
        return;
      }
    }

    setUseCamera(value);
    await saveUseCameraSetting(value);
  };

  useEffect(() => {
    const loadUser = async () => {
      const { name, key, hasLicense } = await getUserData();
      const useCameraSetting = await getUseCameraSetting();
      if (name) setName(name);
      if (key) setDeviceKey(key);
      if (hasLicense === "true") setHasLicense(true);
      setUseCamera(useCameraSetting);
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Користувач</Text>
        <Text style={styles.text}>Ім’я: {name || "-"}</Text>
        <Text style={styles.text}>Ключ:</Text>
        <Text style={styles.text}>{deviceKey || "-"}</Text>
        <Text style={styles.text}>Ліцензія: {hasLicense ? "є" : "відсутня"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Налаштування</Text>
        <View style={styles.switchRow}>
          <Text style={styles.text}>Використовувати камеру</Text>
          <Switch
            value={useCamera}
            onValueChange={toggleSwitch}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
