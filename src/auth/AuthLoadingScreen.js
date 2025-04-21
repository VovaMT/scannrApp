import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getUserData } from '../utils/storage';
import { checkLicense } from '../api/authApi';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const { key, license } = await getUserData();

      if (!key) {
        navigation.replace('Registration');
      } else if (!license) {
        navigation.replace('Restricted');
      } else {
        navigation.replace('Home');
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
