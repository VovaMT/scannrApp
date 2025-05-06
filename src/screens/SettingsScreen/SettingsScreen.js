import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { getUserData, saveUserData, saveUseCameraSetting, getUseCameraSetting } from "services/storage/userStorage";
import { getUserStores, setActiveStore } from "services/api/authApi";
import DropDownPicker from "react-native-dropdown-picker";

const SettingsScreen = () => {
  const [name, setName] = useState("-");
  const [role, setRole] = useState(null);
  const [deviceKey, setDeviceKey] = useState("-");
  const [keyLicense, setKeyLicense] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const [storeItems, setStoreItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSwitch = async (value) => {
    if (value) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Помилка", "Доступ до камери не надано");
        setUseCamera(false);
        await saveUseCameraSetting(false);
        return;
      }
    }
    setUseCamera(value);
    await saveUseCameraSetting(value);
  };


  const handleSaveStore = async () => {
    console.log("DeviceID:", deviceKey);
    console.log("License:", keyLicense);
    console.log("Store ID:", selectedStore);
  
    try {
      await setActiveStore(selectedStore, deviceKey, keyLicense);
      await saveUserData(name, deviceKey, keyLicense, role, selectedStore);
      Alert.alert("Успіх", "Магазин встановлено як активний");
    } catch (error) {
      Alert.alert("Помилка", error.message || "Не вдалося зберегти магазин");
    }
  };
  


  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUserData();
        setName(user.name || "-");
        setDeviceKey(user.key || "-");
        setKeyLicense(user.keyLicense || "");
        setRole(user.role);

        const useCameraSetting = await getUseCameraSetting();
        setUseCamera(useCameraSetting);

        const stores = await getUserStores(user.key, user.keyLicense);
        const formattedStores = stores.map((store) => ({
          label: store.location,
          value: store.id,
        }));
        setStoreItems(formattedStores);

        if (formattedStores.length > 0) {
          setSelectedStore(formattedStores[0].value);
        }
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Користувач</Text>
        <Text style={styles.text}>Ім’я: {name}</Text>
        <Text style={styles.text}>Ключ пристрою: {deviceKey}</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Магазин</Text>

        {role === 1 && storeItems[0] && (
          <Text style={styles.text}>{storeItems[0].label}</Text>
        )}

        {role === 2 && (
          <>
            <DropDownPicker
              open={dropdownOpen}
              value={selectedStore}
              items={storeItems}
              setOpen={setDropdownOpen}
              setValue={setSelectedStore}
              setItems={setStoreItems}
              placeholder="Виберіть магазин"
              zIndex={1000}
              zIndexInverse={3000}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveStore}>
              <Text style={styles.buttonText}>Зберегти</Text>
            </TouchableOpacity>
          </>
        )}

      </View>

    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    paddingVertical: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
