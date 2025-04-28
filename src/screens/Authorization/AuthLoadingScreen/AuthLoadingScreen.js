import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { getUserData } from "../../../services/storage/userStorage";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const { key, hasLicense } = await getUserData();

      if (!key) {
        navigation.replace("Registration");
      } else if (!hasLicense) {
        navigation.replace("Restricted");
      } else {
        navigation.replace("Home");
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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
