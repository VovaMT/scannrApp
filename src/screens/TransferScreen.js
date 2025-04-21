import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransferScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Переміщення</Text>
  </View>
);

export default TransferScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
