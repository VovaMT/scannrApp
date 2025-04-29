import { Platform } from "react-native";
import * as Application from "expo-application";

export const fetchDeviceId = async () => {
  if (Platform.OS === 'ios') {
    return await Application.getIosIdForVendorAsync();
  } else if (Platform.OS === 'android') {
    return Application.getAndroidId();
  }
  return null;
};
