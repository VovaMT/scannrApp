import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InventoryScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Модуль інвентаризації</Text>
  </View>
);

export default InventoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
