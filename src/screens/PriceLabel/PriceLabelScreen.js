import React from "react";
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { View, Text, StyleSheet } from "react-native";
import * as Application from 'expo-application';

const PriceLabelScreen = () => {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const fetchDeviceId = async () => {
      if (Platform.OS === 'ios') {
        const id = await Application.getIosIdForVendorAsync();
        setDeviceId(id);
      } else if (Platform.OS === 'android') {
        const id = Application.getAndroidId(); 
        setDeviceId(id);
      }
    };

    fetchDeviceId();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ID пристрою: {deviceId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});

export default PriceLabelScreen;

