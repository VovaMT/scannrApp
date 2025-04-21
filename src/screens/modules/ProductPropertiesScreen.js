import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductPropertiesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Властивості товару</Text>
  </View>
);

export default ProductPropertiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
