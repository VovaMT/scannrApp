import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserData = async () => {
  const name = await AsyncStorage.getItem("user_name");
  const key = await AsyncStorage.getItem("device_key");
  const hasLicense = await AsyncStorage.getItem("has_license");
  return { name, key, hasLicense};
};

export const saveUserData = async (name, key, licensed = false) => {
  await AsyncStorage.setItem("user_name", name);
  await AsyncStorage.setItem("device_key", key);
  if (licensed) {
    await AsyncStorage.setItem("has_license", "true");
  }
};

export const clearUserData = async () => {
  await AsyncStorage.removeItem("user_name");
  await AsyncStorage.removeItem("device_key");
  await AsyncStorage.removeItem("has_license");
};

export const saveUseCameraSetting = async (value) => {
  await AsyncStorage.setItem("use_camera", value ? "true" : "false");
};

export const getUseCameraSetting = async () => {
  const value = await AsyncStorage.getItem("use_camera");
  return value === "true";
};

