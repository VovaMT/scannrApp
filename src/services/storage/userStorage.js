import AsyncStorage from "@react-native-async-storage/async-storage";

// Зберегти дані користувача
export const saveUserData = async (name, key, licensed = false) => {
  await AsyncStorage.setItem("user_name", name);
  await AsyncStorage.setItem("device_key", key);
  await AsyncStorage.setItem("has_license", licensed ? "true" : "false");
};

// Отримати дані користувача
export const getUserData = async () => {
  const name = await AsyncStorage.getItem("user_name");
  const key = await AsyncStorage.getItem("device_key");
  const hasLicense = await AsyncStorage.getItem("has_license");
  return { name, key, hasLicense };
};

// Очистити дані користувача
export const clearUserData = async () => {
  await AsyncStorage.multiRemove(["user_name", "device_key", "has_license"]);
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
