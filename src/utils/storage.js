import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
  const name = await AsyncStorage.getItem('user_name');
  const key = await AsyncStorage.getItem('device_key');
  const license = await AsyncStorage.getItem('key_license');
  return { name, key, license };
};

export const saveUserData = async (name, key, license = '') => {
  await AsyncStorage.setItem('user_name', name);
  await AsyncStorage.setItem('device_key', key);
  if (license) {
    await AsyncStorage.setItem('key_license', license);
  }
};

export const clearUserData = async () => {
  await AsyncStorage.removeItem('user_name');
  await AsyncStorage.removeItem('device_key');
  await AsyncStorage.removeItem('key_license');
};
