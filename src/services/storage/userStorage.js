import AsyncStorage from "@react-native-async-storage/async-storage";

// Зберегти дані користувача
export const saveUserData = async (name, key, keyLicense, role, activeStoreId = null) => {
  await AsyncStorage.setItem("user_name", name);
  await AsyncStorage.setItem("device_key", key);
  await AsyncStorage.setItem("key_license", keyLicense);
  await AsyncStorage.setItem("user_role", String(role));
  if (activeStoreId !== null) {
    await AsyncStorage.setItem("user_active_store", String(activeStoreId));
  }
};

// Отримати дані користувача
export const getUserData = async () => {
  const name = await AsyncStorage.getItem("user_name");
  const key = await AsyncStorage.getItem("device_key");
  const keyLicense = await AsyncStorage.getItem("key_license");
  const roleStr = await AsyncStorage.getItem("user_role");
  const storeStr = await AsyncStorage.getItem("user_active_store");

  const role = roleStr ? parseInt(roleStr, 10) : null;
  const activeStore = storeStr ? parseInt(storeStr, 10) : null;

  return { name, key, keyLicense, role, activeStore };
};

// Очистити всі дані користувача
export const clearUserData = async () => {
  await AsyncStorage.multiRemove([
    "user_name",
    "device_key",
    "key_license",
    "user_role",
    "user_active_store"
  ]);
};

// Зберегти налаштування використання камери
export const saveUseCameraSetting = async (value) => {
  await AsyncStorage.setItem("use_camera", value ? "true" : "false");
};

// Отримати налаштування використання камери
export const getUseCameraSetting = async () => {
  const value = await AsyncStorage.getItem("use_camera");
  return value === "true";
};

// Зберегти список магазинів
export const saveStores = async (stores) => {
  await AsyncStorage.setItem("user_stores", JSON.stringify(stores));
};

// Отримати список магазинів
export const getStores = async () => {
  const json = await AsyncStorage.getItem("user_stores");
  return json ? JSON.parse(json) : [];
};

// Очистити список магазинів (без активного)
export const clearStores = async () => {
  await AsyncStorage.removeItem("user_stores");
};
